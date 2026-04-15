import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/src/lib/supabaseServer';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) return NextResponse.json({ error: 'Falta tenantId' }, { status: 400 });

    // 1. Obtener conteo de tokens de IA del mes actual
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0,0,0,0);

    const { data: metrics } = await supabaseAdmin
      .from('usage_metrics')
      .select('amount, metric_type, created_at')
      .eq('tenant_id', tenantId)
      .gte('created_at', startOfMonth.toISOString());

    const totalTokens = metrics?.filter(m => m.metric_type === 'ai_tokens')
      .reduce((acc, curr) => acc + curr.amount, 0) || 0;

    const totalSessions = metrics?.filter(m => m.metric_type === 'conversation_window')
      .reduce((acc, curr) => acc + curr.amount, 0) || 0;

    // 1.5 Generar Rendimiento Semanal (Desglose diario)
    const days = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
    const weeklySessions = [0, 1, 2, 3, 4, 5, 6].map(dayOffset => {
      const d = new Date();
      // Calcular el inicio del día para la comparación
      d.setDate(d.getDate() - dayOffset);
      const dayStr = d.toISOString().split('T')[0];
      
      const count = metrics?.filter(m => 
        m.metric_type === 'conversation_window' && 
        m.created_at.startsWith(dayStr)
      ).reduce((acc, curr) => acc + curr.amount, 0) || 0;

      return {
        day: days[d.getDay()],
        count: count
      };
    }).reverse(); // Para que sea de Lunes a Domingo cronológicamente

    // 2. Obtener chats activos y clientes
    const { count: chatCount } = await supabaseAdmin
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId);

    const { count: customerCount } = await supabaseAdmin
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId);

    // 3. Obtener autonomy (mensajes bot vs humanos)
    const { data: messages } = await supabaseAdmin
      .from('messages')
      .select('sender_type')
      .eq('tenant_id', tenantId);

    const botMsgs = messages?.filter(m => m.sender_type === 'bot').length || 0;
    const totalMsgs = messages?.length || 1;
    const autonomy = Math.round((botMsgs / totalMsgs) * 100);

    return NextResponse.json({
      aiTokens: totalTokens,
      totalSessions: totalSessions,
      weeklySessions: weeklySessions,
      activeChats: chatCount || 0,
      totalCustomers: customerCount || 0,
      autonomy: autonomy || 0
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
