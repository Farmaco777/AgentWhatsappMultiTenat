import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/src/lib/supabaseServer';
import { normalizePhoneNumber } from '@/src/lib/whatsappUtils';
import { generateAIContent } from '@/src/services/aiService';
import { sendWhatsAppMessage } from '@/src/services/whatsappService';

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

    // Check if it's a WhatsApp message event
    if (body.object === 'whatsapp_business_account' && body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      const entry = body.entry[0];
      const change = entry.changes[0];
      const value = change.value;
      const message = value.messages[0];
      const contact = value.contacts[0];

      const from = message.from; 
      const text = message.text?.body;
      const phoneNumberId = value.metadata.phone_number_id; // The ID of the phone receiving the msg

      if (!text) return new NextResponse('NO_TEXT', { status: 200 });

      console.log(`[WHATSAPP] Mensaje de ${from} a ${phoneNumberId}: ${text}`);

      // 1. Identificar Tenant por su ID de Teléfono
      const { data: tenant, error: tenantError } = await supabaseAdmin
        .from('tenants')
        .select('*')
        .eq('whatsapp_phone_number_id', phoneNumberId)
        .single();

      if (tenantError || !tenant) {
        console.error('Tenant no encontrado para ID:', phoneNumberId);
        return new NextResponse('TENANT_NOT_FOUND', { status: 200 });
      }

      // 2. Identificar o Crear Cliente (Normalización E.164)
      const normalizedPhone = normalizePhoneNumber(from);
      let { data: customer, error: customerError } = await supabaseAdmin
        .from('customers')
        .select('*')
        .eq('tenant_id', tenant.id)
        .eq('phone', normalizedPhone)
        .single();

      if (!customer) {
        const { data: newCustomer, error: createError } = await supabaseAdmin
          .from('customers')
          .insert([{
            tenant_id: tenant.id,
            name: contact.profile?.name || 'Cliente Nuevo',
            phone: normalizedPhone
          }])
          .select()
          .single();
        
        if (createError) throw createError;
        customer = newCustomer;
      }

      // 3. Crear o Buscar Conversación Activa
      let { data: conversation, error: convError } = await supabaseAdmin
        .from('conversations')
        .select('*')
        .eq('tenant_id', tenant.id)
        .eq('customer_id', customer.id)
        .eq('status', 'active')
        .single();

      if (!conversation) {
        const { data: newConv, error: createConvError } = await supabaseAdmin
          .from('conversations')
          .insert([{
            tenant_id: tenant.id,
            customer_id: customer.id,
            status: 'active'
          }])
          .select()
          .single();
        
        if (createConvError) throw createConvError;
        conversation = newConv;
      }

      // 4. Guardar Mensaje del Cliente
      await supabaseAdmin
        .from('messages')
        .insert([{
          conversation_id: conversation.id,
          tenant_id: tenant.id,
          sender: 'customer',
          text: text
        }]);

      // 5. Generar Respuesta IA con Contexto del Negocio
      // Buscamos productos para darle contexto
      const { data: products } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('tenant_id', tenant.id);

      const aiContext = `
        Negocio: ${tenant.name}
        Prompt del Negocio: ${tenant.training_data || 'Asistente de ventas'}
        Productos disponibles: ${JSON.stringify(products)}
        Cliente: ${customer.name}
      `;

      const aiResponse = await generateAIContent(text, aiContext);

      // 6. Enviar Respuesta por WhatsApp y Guardar
      await sendWhatsAppMessage(from, aiResponse.text);

      await supabaseAdmin
        .from('messages')
        .insert([{
          conversation_id: conversation.id,
          tenant_id: tenant.id,
          sender: 'ai',
          text: aiResponse.text
        }]);

      return new NextResponse('SUCCESS', { status: 200 });
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('ERROR_PROCESSING_WEBHOOK:', error);
    return new NextResponse('INTERNAL_SERVER_ERROR', { status: 500 });
  }
}
