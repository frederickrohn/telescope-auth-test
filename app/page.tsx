import { Suspense } from "react";
import Link from "next/link";
import { getUser } from "@/lib/auth";
import { SignInButtons } from "./auth-buttons";

async function SignInOrContinue() {
  const user = await getUser();
  if (user) {
    return (
      <Link href="/dashboard" className="btn">
        Continue as {user.login}
      </Link>
    );
  }
  return (
    <SignInButtons />
  );
}

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Telescope Auth Test</h1>
        <p className="mt-2 text-sm text-zinc-500">
          A throwaway notes app for checking Clerk sign-in (GitHub) and Supabase CRUD through the Telescope preview.
        </p>
      </div>
      <Suspense fallback={<div className="h-11" />}>
        <SignInOrContinue />
      </Suspense>
    </div>
  );
}
