const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export interface AIResponse {
  text: string;
  orderItems?: Array<{ name: string; quantity: number; price: number }>;
  intent?: 'pedido' | 'soporte' | 'pregunta';
}

export async function generateAIContent(userMessage: string, context: string): Promise<AIResponse> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const prompt = `
    Context: ${context}
    User Message: "${userMessage}"
    
    Response format (JSON):
    {
      "text": "Message to send to user",
      "orderItems": [{"name": "product 1", "quantity": 1, "price": 10000}], // optional if ordering
      "intent": "pedido" // one of 'pedido', 'soporte', 'pregunta'
    }
    
    Instructions:
    - Eres un asistente virtual experto para el negocio descrito en el contexto.
    - Tienes DOS fuentes principales de información:
      1. El "Prompt del Negocio" (Instrucciones de personalidad y conocimiento general).
      2. El "Catálogo de Productos" (Lista de productos, precios y disponibilidad).
    - Utiliza AMBAS fuentes para responder de forma precisa. Si un usuario pregunta por precios o disponibilidad, consulta el catálogo.
    - Sé conciso, amable y profesional.
    - Si el usuario muestra intención de compra, identifica los productos del catálogo y devuelve el objeto 'orderItems'.
    - Si la información no está en ninguna de las fuentes, responde cortésmente que no tienes esa información específica.
  `;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('AI_ERROR:', data);
      throw new Error('AI generation failed');
    }

    const aiResponse: AIResponse = JSON.parse(data.candidates[0].content.parts[0].text);
    return aiResponse;
  } catch (error) {
    console.error('AI_SERVICE_ERROR:', error);
    throw error;
  }
}
