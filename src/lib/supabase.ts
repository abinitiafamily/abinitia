import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_abinitia_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://ucvicxjvcsojpbwkydkf.supabase.co'

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_abinitia_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client com permissões de backend / service role (apenas para server actions e route handlers)
export function getServiceSupabase() {
  const serviceKey =
    process.env.abinitia_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    supabaseAnonKey

  return createClient(supabaseUrl, serviceKey)
}
