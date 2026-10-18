import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { SignOut } from "../auth-buttons";
import { db } from "@/lib/supabase/admin";
import { createNote, deleteNote, updateNote } from "./actions";

type Note = { id: string; body: string; updated_at: string };

async function Profile() {
  const user = await getUser();
  if (!user) redirect("/");
  return (
    <div className="flex items-center gap-4">
      {user.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.image} alt="" width={48} height={48} className="rounded-full" />
      )}
      <div className="flex-1">
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm text-zinc-500">@{user.login}</p>
      </div>
      <SignOut />
    </div>
  );
}

async function Notes() {
  const user = await getUser();
  if (!user) return null;
  const { data, error } = await db()
    .from("clerk_notes")
    .select("id, body, updated_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) return <p className="text-sm text-red-600">Couldn&apos;t load notes: {error.message}</p>;
  const notes = (data ?? []) as Note[];
  return (
    <div className="flex flex-col gap-4">
      <form action={createNote} className="flex gap-2">
        <input name="body" required maxLength={500} placeholder="New note" className="input" />
        <button type="submit" className="btn w-auto">Add</button>
      </form>
      {notes.length === 0 && <p className="text-sm text-zinc-500">No notes yet.</p>}
      <ul className="flex flex-col gap-2">
        {notes.map((note) => (
          <li key={note.id} className="flex gap-2">
            <form action={updateNote} className="flex flex-1 gap-2">
              <input type="hidden" name="id" value={note.id} />
              <input name="body" required maxLength={500} defaultValue={note.body} className="input" />
              <button type="submit" className="btn btn-secondary w-auto">Save</button>
            </form>
            <form action={deleteNote}>
              <input type="hidden" name="id" value={note.id} />
              <button type="submit" className="btn btn-secondary w-auto" aria-label="Delete note">Delete</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <Suspense fallback={<div className="h-12" />}>
        <Profile />
      </Suspense>
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading notes…</p>}>
        <Notes />
      </Suspense>
    </div>
  );
}
