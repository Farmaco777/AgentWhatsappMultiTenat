import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/src/lib/supabaseServer';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get('tenantId');

  if (!tenantId) return NextResponse.json({ error: 'Falta tenantId' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('knowledge_sources')
    .select('*')
    .eq('tenant_id', tenantId);

  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  try {
    const { tenantId, type, source_url, content } = await req.json();

    if (!tenantId || !type) return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from('knowledge_sources')
      .insert([{
        tenant_id: tenantId,
        type,
        source_url,
        content,
        status: 'indexed' // En un flujo real esto pasaría a 'pending' para scapear/procesar
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Falta ID' }, { status: 400 });

  const { error } = await supabaseAdmin
    .from('knowledge_sources')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
