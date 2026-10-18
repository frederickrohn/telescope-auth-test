// All auth lives here (plus app/auth/callback) so it can be swapped for Auth.js later.
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Our own public origin. Behind Telescope's proxy, Host is the Sprite and X-Forwarded-Proto is https.
async function origin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export async function getUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// Server-side PKCE flow: the server action gets the provider URL from Supabase,
// then redirect()s the browser to <project>.supabase.co/auth/v1/authorize → github.com.
export async function signInWithGitHub() {
  "use server";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo: `${await origin()}/auth/callback?next=/dashboard` },
  });
  if (error) redirect(`/auth/error?message=${encodeURIComponent(error.message)}`);
  redirect(data.url);
}

export async function signOut() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
