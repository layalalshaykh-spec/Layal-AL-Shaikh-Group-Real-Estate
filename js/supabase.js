/* =====================================================
   LAYAL ALSHAIKH — Supabase client
   Both values below are PUBLIC and safe to commit:
   the "anon" key only allows what Row Level Security permits.
   NEVER put the secret "service_role" key here.

   Fill these in from: Supabase Dashboard → Project Settings →
   Data API (Project URL) and API Keys (anon / public key).
   ===================================================== */
export const SUPABASE_URL      = 'https://clepqziyqmxbyvgoxnrn.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_mucqR9zACe9P1BnMWqhNRQ_uMWEom7L';

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const configured = SUPABASE_URL.startsWith('http') && SUPABASE_ANON_KEY.length > 20;

// Until you paste your keys, this stays null and the site/admin
// quietly fall back to the built-in demo content — nothing breaks.
export const supabase = configured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
