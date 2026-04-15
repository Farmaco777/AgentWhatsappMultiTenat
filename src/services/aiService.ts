import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin } from "@/src/lib/supabaseServer";
import { logUsage } from "./usageService";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Motor de IA Profesional Multi-Tenant
 * Genera una respuesta basada en la consolidación de 3 fuentes:
 * 1. Personalidad (agent_configs) - Desde página "Agente"
 * 2. Conocimiento Externo (knowledge_sources) - Desde página "Agente" (URLs/Docs)
 * 3. Catálogo (products) - Desde página "Catálogo"
 */
export async function generateAIContent(message: string, tenantId: string) {
  try {
    // 1. Carga de todo el conocimiento disponible en paralelo para optimizar latencia
    const [configRes, productsRes, knowledgeRes] = await Promise.all([
      supabaseAdmin.from('agent_configs').select('*').eq('tenant_id', tenantId).single(),
      supabaseAdmin.from('products').select('*').eq('tenant_id', tenantId).eq('is_available', true),
      supabaseAdmin.from('knowledge_sources').select('*').eq('tenant_id', tenantId)
    ]);

    const config = configRes.data;
    const products = productsRes.data || [];
    const knowledge = knowledgeRes.data || [];

    // 2. Construcción del Prompt del Sistema (Contexto Maestro)
    const systemInstruction = `
      ### PERSONALIDAD Y ROL
      ${config?.prompt_system || 'Eres un asistente cordial para negocios en WhatsApp.'}
      Tono de comunicación: ${config?.tone || 'profesional'}
      Nombre del asistente: ${config?.name || 'MultiBot'}

      ### CONOCIMIENTO ESPECÍFICO DEL NEGOCIO (Knowledge base)
      Este conocimiento proviene de documentos y URLs cargados por el dueño del negocio:
      ${knowledge.length > 0 
        ? knowledge.map(k => `- Información desde ${k.type}: ${k.content || k.source_url || 'Dato adjunto'}`).join('\n')
        : 'No hay fuentes de conocimiento externas configuradas.'}

      ### CATÁLOGO DE PRODUCTOS / SERVICIOS
      Considérate experto en este catálogo y responde dudas sobre precios o descripción:
      ${products.length > 0 
        ? products.map(p => `- ${p.name} ($${p.price}): ${p.description} | Categoría: ${p.category}`).join('\n')
        : 'Actualmente no hay productos en el catálogo.'}

      ### REGLAS CRÍTICAS:
      1. Solo responde basándote en la información proporcionada arriba (Personalidad + Conocimiento + Catálogo).
      2. Si el cliente pregunta algo fuera de este contexto o de lo que sabes, dile amablemente que no posees esa información.
      3. No inventes precios ni características que no estén listados expresamente.
      4. Mantén tus respuestas breves, estructuradas y directas para facilitar la lectura en WhatsApp.
    `;

    // 3. Ejecución del Modelo de IA configurado específicamente para este cliente
    const modelId = config?.model || "gemini-1.5-flash";
    const model = genAI.getGenerativeModel({ 
      model: modelId,
      systemInstruction: systemInstruction 
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    // 4. REGISTRO DE MÉTRICAS (Uso de Tokens)
    const usage = response.usageMetadata;
    if (usage && usage.totalTokenCount) {
      await logUsage(tenantId, 'ai_tokens', usage.totalTokenCount, {
        prompt_tokens: usage.promptTokenCount,
        completion_tokens: usage.candidatesTokenCount,
        model: modelId
      });
    }

    return {
      text,
      model: modelId
    };
  } catch (error) {
    console.error("AI_ENGINE_ERROR:", error);
    return {
      text: "Lo siento, tuve un inconveniente técnico al procesar tu solicitud. Por favor intenta de nuevo en unos momentos.",
      error: true
    };
  }
}
