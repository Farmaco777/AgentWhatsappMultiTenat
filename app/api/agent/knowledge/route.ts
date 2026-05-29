import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, safeQuery } from '@/src/lib/supabaseServer';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) return NextResponse.json({ error: 'Falta tenantId' }, { status: 400 });

    const result = await safeQuery(
      supabaseAdmin
        .from('knowledge_sources')
        .select('*')
        .eq('tenant_id', tenantId),
      { data: [], error: null } as any,
      2000
    );

    return NextResponse.json(result?.data || []);
  } catch (error: any) {
    console.error('[Agent Knowledge API] Error en GET:', error);
    return NextResponse.json([]);
  }
}


export async function POST(req: NextRequest) {
  try {
    const { tenantId, type, source_url, content, file_path } = await req.json();

    if (!tenantId || !type) return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from('knowledge_sources')
      .insert([{
        tenant_id: tenantId,
        type,
        source_url,
        content,
        file_path,
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
