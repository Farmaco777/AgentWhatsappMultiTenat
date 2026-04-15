import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/src/lib/supabaseServer';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get('tenantId');

  if (!tenantId) return NextResponse.json({ error: 'Falta tenantId' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('agent_configs')
    .select('*')
    .eq('tenant_id', tenantId)
    .single();

  return NextResponse.json(data || {});
}

export async function POST(req: NextRequest) {
  try {
    const { tenantId, prompt_system, model, temperature, is_active } = await req.json();

    if (!tenantId) return NextResponse.json({ error: 'Falta tenantId' }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from('agent_configs')
      .upsert({
        tenant_id: tenantId,
        prompt_system,
        model,
        temperature,
        is_active,
        updated_at: new Date().toISOString()
      }, { onConflict: 'tenant_id' })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
