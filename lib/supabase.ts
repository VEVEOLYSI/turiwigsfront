import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://wwhejujcslgtrvixsnpg.supabase.co';

const anon =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3aGVqdWpjc2xndHJ2aXhzbnBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0OTIyNTgsImV4cCI6MjA5NjA2ODI1OH0.BnyiiaspZkmK6qii7OF1vQumAs2jm0k_1w8NfGzy28E';

export const isSupabaseConfigured = Boolean(url && anon);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, anon, {
      realtime: { params: { eventsPerSecond: 10 } },
      auth: { persistSession: false },
    })
  : null;
