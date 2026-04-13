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
