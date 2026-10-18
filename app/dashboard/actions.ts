"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// RLS scopes every query to the signed-in user; user_id defaults to auth.uid().
export async function createNote(formData: FormData) {
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;
  const supabase = await createClient();
  const { error } = await supabase.from("notes").insert({ body });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function updateNote(formData: FormData) {
  const id = String(formData.get("id"));
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;
  const supabase = await createClient();
  const { error } = await supabase.from("notes").update({ body, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function deleteNote(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("notes").delete().eq("id", String(formData.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}
