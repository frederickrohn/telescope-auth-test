import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

async function Profile() {
  const session = await auth();
  if (!session?.user) redirect("/");
  const { name, image, login } = session.user;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" width={56} height={56} className="rounded-full" />
        )}
        <div>
          <p className="text-lg font-semibold">{name}</p>
          {login && <p className="text-sm text-zinc-500">@{login}</p>}
        </div>
      </div>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button type="submit" className="btn btn-secondary">
          Sign out
        </button>
      </form>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <Profile />
      </Suspense>
    </div>
  );
}
