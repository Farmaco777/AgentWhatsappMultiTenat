import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/src/lib/supabaseServer';
import { normalizePhoneNumber } from '@/src/lib/whatsappUtils';
import { generateAIContent } from '@/src/services/aiService';
import { sendWhatsAppMessage } from '@/src/services/whatsappService';
import { checkAndLogConversationWindow } from '@/src/services/usageService';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'multibot_verify_token_2024';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      return new NextResponse(challenge, { status: 200 });
    } else {
      return new NextResponse(null, { status: 403 });
    }
  }
  return new NextResponse(null, { status: 400 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validación inicial del payload de Meta
    if (body.object === 'whatsapp_business_account' && body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      const entry = body.entry[0];
      const change = entry.changes[0];
      const value = change.value;
      const message = value.messages[0];
      const contact = value.contacts[0];

      const from = message.from; 
      const text = message.text?.body;
      const phoneNumberId = value.metadata.phone_number_id; 
      const wabaId = entry.id;
      const metaMessageId = message.id;

      if (!text) return new NextResponse('NO_TEXT_SUPPORTED_YET', { status: 200 });

      console.log(`[WHATSAPP WEBHOOK] Mensaje recibido: "${text}" de ${from} para PhoneID ${phoneNumberId}`);

      // 2. Mapeo del Tenant (Empresa) a través de la cuenta de WhatsApp
      const { data: waAccount, error: accountError } = await supabaseAdmin
        .from('whatsapp_accounts')
        .select('tenant_id, id, status')
        .eq('phone_number_id', phoneNumberId)
        .single();

      if (accountError || !waAccount) {
        console.error('ERROR: Cuenta de WhatsApp no registrada en el SaaS para ID:', phoneNumberId);
        return new NextResponse('ACCOUNT_NOT_FOUND', { status: 200 }); // Respondemos 200 para evitar reintentos de Meta
      }

      const tenantId = waAccount.tenant_id;

      // 3. Identificar o Crear Cliente del Tenant
      const normalizedPhone = normalizePhoneNumber(from);
      let { data: customer, error: customerError } = await supabaseAdmin
        .from('customers')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('phone', normalizedPhone)
        .single();

      if (!customer) {
        const { data: newCustomer, error: createError } = await supabaseAdmin
          .from('customers')
          .insert([{
            tenant_id: tenantId,
            name: contact.profile?.name || 'Cliente Nuevo',
            phone: normalizedPhone
          }])
          .select()
          .single();
        
        if (createError) throw createError;
        customer = newCustomer;
      }

      // 4. Buscar o Crear Conversación Activa
      let { data: conversation, error: convError } = await supabaseAdmin
        .from('conversations')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('customer_id', customer.id)
        .eq('status', 'active')
        .single();

      if (!conversation) {
        const { data: newConv, error: createConvError } = await supabaseAdmin
          .from('conversations')
          .insert([{
            tenant_id: tenantId,
            customer_id: customer.id,
            status: 'active'
          }])
          .select()
          .single();
        
        if (createConvError) throw createConvError;
        conversation = newConv;
      }

      // 4.1. CONTABILIZAR SESIÓN DE 24H (Facturación Meta)
      await checkAndLogConversationWindow(tenantId, conversation.id);

      // 4.2. DEBOUNCE / CONCURRENCY LOCK (Evitar respuestas dobles)
      // Si el bot ya está pensando, ignoramos este disparo extra.
      // Añadimos un timeout de seguridad: si lleva más de 30 segundos bloqueado, lo ignoramos (posible error previo).
      const lastUpdate = new Date(conversation.updated_at).getTime();
      const now = new Date().getTime();
      const isStuck = (now - lastUpdate) > 30000;

      if (conversation.is_processing && !isStuck) {
        console.log(`[CONCURRENCY] Ignorando ráfaga de mensajes para conversación ${conversation.id}`);
        return new NextResponse('ALREADY_PROCESSING', { status: 200 });
      }

      // Marcamos como procesando ANTES de llamar a la IA
      await supabaseAdmin
        .from('conversations')
        .update({ is_processing: true, updated_at: new Date().toISOString() })
        .eq('id', conversation.id);

      try {
        // 4.5. VALIDACIÓN DE CONTROL HUMANO (Handoff)
        if (conversation.status === 'human_required') {
          console.log(`[HANDOFF] El humano está al mando de la conversación ${conversation.id}. Bot en silencio.`);
          return new NextResponse('HUMAN_IN_CONTROL', { status: 200 });
        }

        // 5. Persistir Mensaje del Cliente (Capa de Datos)
        await supabaseAdmin
          .from('messages')
          .insert([{
            conversation_id: conversation.id,
            tenant_id: tenantId,
            sender_type: 'customer',
            content: text,
            meta_message_id: metaMessageId
          }]);

        // 6. Cargar Configuración del Agente IA de este Tenant
        const { data: agentConfig } = await supabaseAdmin
          .from('agent_configs')
          .select('*')
          .eq('tenant_id', tenantId)
          .single();

        // 7. Cargar Contexto (Productos/Servicios)
        const { data: products } = await supabaseAdmin
          .from('products')
          .select('name, description, price, category')
          .eq('tenant_id', tenantId)
          .eq('is_available', true);

        // 8. Orquestación del Motor de IA (Agent Runtime)
        const aiContext = `
          ### CONFIGURACIÓN DEL AGENTE
          Instrucciones de Personalidad: ${agentConfig?.prompt_system || 'Eres un asistente de ventas cordial para WhatsApp.'}
          Mensaje de Bienvenida: ${agentConfig?.welcome_message || ''}
          
          ### CATÁLOGO DEL NEGOCIO
          ${products && products.length > 0 
            ? products.map(p => `- ${p.name} ($${p.price}): ${p.description}`).join('\n')
            : 'No hay productos configurados aún.'}

          ### DATOS DEL CLIENTE
          Nombre: ${customer.name}
        `;

        // Generar respuesta
        const aiResponse = await generateAIContent(text, aiContext);

        // 9. Envío de Respuesta y Registro (Outbound)
        await sendWhatsAppMessage(from, aiResponse.text);

        await supabaseAdmin
          .from('messages')
          .insert([{
            conversation_id: conversation.id,
            tenant_id: tenantId,
            sender_type: 'bot',
            content: aiResponse.text
          }]);

      } finally {
        // SIEMPRE liberamos el bloqueo, pase lo que pase
        await supabaseAdmin
          .from('conversations')
          .update({ is_processing: false, updated_at: new Date().toISOString() })
          .eq('id', conversation.id);
      }

      return new NextResponse('PROCESSED_SUCCESSFULLY', { status: 200 });
    }

    return new NextResponse('EVENT_RECEIVED_BUT_NOT_PROCESSED', { status: 200 });
  } catch (error) {
    console.error('CRITICAL_ERROR_WEBHOOK:', error);
    // Respondemos 200 aunque haya error interno para que Meta no se sature de reintentos
    // En producción usaríamos una cola (Redis/Supabase Queues) para manejar fallos.
    return new NextResponse('INTERNAL_ERROR_SILENCED', { status: 200 });
  }
}
