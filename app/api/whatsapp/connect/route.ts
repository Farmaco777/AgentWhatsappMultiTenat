import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/src/lib/supabaseServer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenantId, type } = body;

    let accessToken, phoneNumberId, wabaId;

    if (type === 'automatic') {
      // Datos que vienen del SDK de Meta (Embedded Signup)
      accessToken = body.accessToken;
      phoneNumberId = body.phoneNumberId;
      wabaId = body.wabaId;
    } else {
      // Datos manuales del cliente
      accessToken = body.accessToken;
      phoneNumberId = body.phoneNumberId;
      wabaId = body.wabaId;
    }

    if (!accessToken || !phoneNumberId || !tenantId) {
      return NextResponse.json({ error: 'Faltan parámetros obligatorios' }, { status: 400 });
    }

    // 1. Guardar o actualizar la cuenta de WhatsApp
    const { data: account, error: accError } = await supabaseAdmin
      .from('whatsapp_accounts')
      .upsert({
        tenant_id: tenantId,
        phone_number_id: phoneNumberId,
        waba_id: wabaId,
        status: 'active',
        updated_at: new Date().toISOString()
      }, { onConflict: 'phone_number_id' })
      .select()
      .single();

    if (accError) throw accError;

    // 2. Guardar credenciales (Aquí deberías cifrarlas si implementaste la función de cifrado)
    const { error: credError } = await supabaseAdmin
      .from('whatsapp_credentials')
      .upsert({
        tenant_id: tenantId,
        whatsapp_account_id: account.id,
        access_token: accessToken, // TODO: Cifrar este token
        token_type: 'permanent',
        updated_at: new Date().toISOString()
      }, { onConflict: 'tenant_id, whatsapp_account_id' });

    if (credError) throw credError;

    return NextResponse.json({ success: true, account });
  } catch (error: any) {
    console.error('CONNECT_WHATSAPP_ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
