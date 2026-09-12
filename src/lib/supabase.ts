import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_abinitia_SUPABASE_URL ||
  'https://ucvicxjvcsojpbwkydkf.supabase.co'

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_abinitia_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjdmljeGp2Y3NvanBid2t5ZGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxODE4NTgsImV4cCI6MjEwNDc1Nzg1OH0.GN8IHp1FfyBSHiUoUKizHrclFcssqPey1DlRoKX7caQ'

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_abinitia_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_P3NANrdw-Loh_gttKkfVCA_BTWKkOr4'

// Client para uso no Frontend e React Components
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Client para uso seguro no Backend / Server Components / Route Handlers
export function getServiceSupabase() {
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.abinitia_SUPABASE_SERVICE_ROLE_KEY ||
    SUPABASE_ANON_KEY

  return createClient(SUPABASE_URL, serviceKey)
}
