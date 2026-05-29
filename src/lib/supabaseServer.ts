import { createClient } from '@supabase/supabase-js';

// NOTA: Estas variables deben estar en tu .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client con privilegios administrativos para el Webhook
// Esto permite crear clientes y conversaciones sin depender de una sesión de usuario
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Enuelve una consulta de Supabase con un límite de tiempo (timeout).
 * Si la consulta tarda más de timeoutMs o lanza un error, se retorna el valor por defecto (fallback).
 */
export async function safeQuery<T>(
  promise: Promise<T> | PromiseLike<T>,
  fallback: T,
  timeoutMs: number = 2000
): Promise<T> {
  let timeoutId: NodeJS.Timeout | undefined;
  const timeoutPromise = new Promise<T>((resolve) => {
    timeoutId = setTimeout(() => {
      console.warn(`[Supabase Admin] Consulta expirada tras ${timeoutMs}ms. Usando valor por defecto.`);
      resolve(fallback);
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    if (timeoutId) clearTimeout(timeoutId);
    return result;
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId);
    console.error("[Supabase Admin] Error en consulta:", error);
    return fallback;
  }
}

