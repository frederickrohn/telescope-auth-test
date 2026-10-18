import { Suspense } from "react";
import Link from "next/link";
import { auth, signIn } from "@/auth";

async function SignInOrContinue() {
  const session = await auth();
  if (session?.user) {
    return (
      <Link href="/dashboard" className="btn">
        Continue as {session.user.name}
      </Link>
    );
  }
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", { redirectTo: "/dashboard" });
      }}
    >
      <button type="submit" className="btn">
        Sign in with GitHub
      </button>
    </form>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Telescope Auth Test</h1>
        <p className="mt-2 text-sm text-zinc-500">
          A throwaway app for checking that GitHub OAuth works through the Telescope preview.
        </p>
      </div>
      <Suspense fallback={<div className="h-11" />}>
        <SignInOrContinue />
      </Suspense>
    </div>
  );
}
