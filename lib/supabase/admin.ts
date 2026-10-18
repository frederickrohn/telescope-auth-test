import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Auth.js sessions aren't Supabase sessions, so RLS can't see the user. This server-only client uses the
// secret key (bypasses RLS); every query must filter by the signed-in user's GitHub id explicitly.
let client: SupabaseClient | undefined;
export function db() {
  client ??= createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
