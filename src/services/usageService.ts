import { supabaseAdmin } from "@/src/lib/supabaseServer";

/**
 * Registra una métrica de uso (Tokens, Mensajes, Sesiones)
 */
export async function logUsage(tenantId: string, metricType: 'ai_tokens' | 'messages_sent' | 'messages_received' | 'conversation_window', amount: number = 1, metadata: any = {}) {
  try {
    const { error } = await supabaseAdmin
      .from('usage_metrics')
      .insert([{
        tenant_id: tenantId,
        metric_type: metricType,
        amount: amount,
        metadata: metadata
      }]);

    if (error) console.error('Error logging usage:', error);
  } catch (e) {
    console.error('USAGE_LOGGER_ERROR:', e);
  }
}

/**
 * Lógica Meta 24h: Verifica si el mensaje actual inicia una nueva ventana de facturación.
 */
export async function checkAndLogConversationWindow(tenantId: string, conversationId: string) {
  try {
    const { data: conv } = await supabaseAdmin
      .from('conversations')
      .select('last_window_start')
      .eq('id', conversationId)
      .single();

    const now = new Date();
    const lastStart = conv?.last_window_start ? new Date(conv.last_window_start) : null;
    
    // Si han pasado más de 24 horas (86,400,000 ms) o es la primera ventana
    if (!lastStart || (now.getTime() - lastStart.getTime()) > (24 * 60 * 60 * 1000)) {
      await Promise.all([
        // 1. Iniciamos nueva ventana en DB
        supabaseAdmin.from('conversations')
          .update({ last_window_start: now.toISOString() })
          .eq('id', conversationId),
        
        // 2. Registramos la métrica de sesión para el tenant
        logUsage(tenantId, 'conversation_window', 1, { conversation_id: conversationId })
      ]);
      console.log(`[BILLING] Nueva ventana de 24h iniciada para conversación ${conversationId}`);
    }
  } catch (e) {
    console.error('CONV_WINDOW_ERROR:', e);
  }
}
