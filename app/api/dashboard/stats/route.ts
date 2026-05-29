import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, safeQuery } from '@/src/lib/supabaseServer';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) return NextResponse.json({ error: 'Falta tenantId' }, { status: 400 });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Ejecutar todas las consultas en paralelo con un timeout de 2000ms
    const [metricsResult, chatsResult, customersResult, messagesResult] = await safeQuery(
      Promise.all([
        supabaseAdmin
          .from('usage_metrics')
          .select('amount, metric_type, created_at')
          .eq('tenant_id', tenantId)
          .gte('created_at', startOfMonth.toISOString()),
        supabaseAdmin
          .from('conversations')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', tenantId),
        supabaseAdmin
          .from('customers')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', tenantId),
        supabaseAdmin
          .from('messages')
          .select('sender_type')
          .eq('tenant_id', tenantId)
      ]),
      [
        { data: [], error: null },
        { count: 0, error: null },
        { count: 0, error: null },
        { data: [], error: null }
      ] as any[],
      2000
    );

    const metrics = metricsResult?.data || [];
    const chatCount = chatsResult?.count || 0;
    const customerCount = customersResult?.count || 0;
    const messages = messagesResult?.data || [];

    const totalTokens = metrics?.filter((m: any) => m.metric_type === 'ai_tokens')
      .reduce((acc: number, curr: any) => acc + curr.amount, 0) || 0;

    const totalSessions = metrics?.filter((m: any) => m.metric_type === 'conversation_window')
      .reduce((acc: number, curr: any) => acc + curr.amount, 0) || 0;

    // Generar Rendimiento Semanal (Desglose diario)
    const days = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
    const weeklySessions = [0, 1, 2, 3, 4, 5, 6].map(dayOffset => {
      const d = new Date();
      d.setDate(d.getDate() - dayOffset);
      const dayStr = d.toISOString().split('T')[0];
      
      const count = metrics?.filter((m: any) => 
        m.metric_type === 'conversation_window' && 
        m.created_at && m.created_at.startsWith(dayStr)
      ).reduce((acc: number, curr: any) => acc + curr.amount, 0) || 0;

      return {
        day: days[d.getDay()],
        count: count
      };
    }).reverse();

    const botMsgs = messages?.filter((m: any) => m.sender_type === 'bot').length || 0;
    const totalMsgs = messages?.length || 0;
    const autonomy = totalMsgs > 0 ? Math.round((botMsgs / totalMsgs) * 100) : 0;

    return NextResponse.json({
      aiTokens: totalTokens,
      totalSessions: totalSessions,
      weeklySessions: weeklySessions,
      activeChats: chatCount,
      totalCustomers: customerCount,
      autonomy: autonomy
    });
  } catch (error: any) {
    console.error('[Dashboard Stats API] Error general:', error);
    // En caso de error general, retornamos valores por defecto en lugar de colapsar la respuesta
    return NextResponse.json({
      aiTokens: 0,
      totalSessions: 0,
      weeklySessions: [0, 1, 2, 3, 4, 5, 6].map(dayOffset => {
        const d = new Date();
        d.setDate(d.getDate() - dayOffset);
        const days = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
        return { day: days[d.getDay()], count: 0 };
      }).reverse(),
      activeChats: 0,
      totalCustomers: 0,
      autonomy: 0
    });
  }
}
