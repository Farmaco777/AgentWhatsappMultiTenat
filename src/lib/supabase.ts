import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase. Por favor, configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en tu archivo .env.local');
}

// Client para uso en el Frontend (respeta RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Envuelve una consulta de Supabase con un límite de tiempo (timeout) en el lado del cliente.
 * Si la consulta tarda más de timeoutMs o lanza un error, se retorna el valor por defecto (fallback).
 */
export async function safeQueryClient<T>(
  promise: Promise<T> | PromiseLike<T>,
  fallback: T,
  timeoutMs: number = 2000
): Promise<T> {
  let timeoutId: NodeJS.Timeout | undefined;
  const timeoutPromise = new Promise<T>((resolve) => {
    timeoutId = setTimeout(() => {
      console.warn(`[Supabase Client] Consulta expirada tras ${timeoutMs}ms. Usando valor por defecto.`);
      resolve(fallback);
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    if (timeoutId) clearTimeout(timeoutId);
    return result;
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId);
    console.error("[Supabase Client] Error en consulta:", error);
    return fallback;
  }
}
