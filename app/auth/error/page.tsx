import { Suspense } from "react";
import Link from "next/link";

async function Message({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const { message } = await searchParams;
  return <p className="text-sm text-zinc-500 break-words">{message ?? "Unknown error"}</p>;
}

export default function AuthError(props: PageProps<"/auth/error">) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Sign-in failed</h1>
      <Suspense>
        <Message searchParams={props.searchParams as Promise<{ message?: string }>} />
      </Suspense>
      <Link href="/" className="btn btn-secondary">Back</Link>
    </div>
  );
}
