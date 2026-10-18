"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";

async function requireUser() {
  const user = await getUser();
  if (!user) throw new Error("Not signed in");
  return user;
}

export async function createNote(formData: FormData) {
  const user = await requireUser();
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;
  const { error } = await db().from("clerk_notes").insert({ body, user_id: user.id });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function updateNote(formData: FormData) {
  const user = await requireUser();
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;
  const { error } = await db()
    .from("clerk_notes")
    .update({ body, updated_at: new Date().toISOString() })
    .eq("id", String(formData.get("id")))
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function deleteNote(formData: FormData) {
  const user = await requireUser();
  const { error } = await db()
    .from("clerk_notes")
    .delete()
    .eq("id", String(formData.get("id")))
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}
