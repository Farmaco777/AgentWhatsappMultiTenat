import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/src/lib/supabaseServer';
import { checkAndLogConversationWindow } from '@/src/services/usageService';

export async function POST(req: NextRequest) {
  try {
    const { tenantId, conversationId, message, phoneNumber } = await req.json();

    if (!tenantId || !message || !phoneNumber) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    // 1. CONTABILIZAR SESIÓN DE 24H (Facturación Meta)
    await checkAndLogConversationWindow(tenantId, conversationId);

    // 2. Obtener credenciales de WhatsApp del Tenant
    const { data: credentials } = await supabaseAdmin
      .from('whatsapp_credentials')
      .select('access_token, phone_number_id')
      .eq('tenant_id', tenantId)
      .single();

    if (!credentials) {
      return NextResponse.json({ error: 'WhatsApp no configurado para este tenant' }, { status: 400 });
    }

    // 2. Enviar mensaje a través de la API de Meta
    const metaUrl = `https://graph.facebook.com/v21.0/${credentials.phone_number_id}/messages`;
    
    // Aquí deberías descifrar el token si usaste cifrado en el paso anterior
    const decryptedToken = credentials.access_token; 

    const response = await fetch(metaUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${decryptedToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phoneNumber,
        type: 'text',
        text: { body: message }
      }),
    });

    const metaData = await response.json();

    if (!response.ok) {
      throw new Error(metaData.error?.message || 'Error al enviar a Meta');
    }

    // 3. Guardar el mensaje en nuestra base de datos como enviado por humano
    await supabaseAdmin
      .from('messages')
      .insert([{
        conversation_id: conversationId,
        tenant_id: tenantId,
        sender_type: 'human',
        content: message,
        status: 'sent',
        message_id: metaData.messages?.[0]?.id
      }]);

    return NextResponse.json({ success: true, messageId: metaData.messages?.[0]?.id });
  } catch (error: any) {
    console.error('SEND_MESSAGE_ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
