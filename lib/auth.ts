// All auth lives here (plus proxy.ts and the Clerk components in app/) so it can be swapped.
// This variant: Clerk (development instance) with GitHub as a social connection.
import { auth, currentUser } from "@clerk/nextjs/server";
import { connection } from "next/server";

export type AppUser = { id: string; name: string; login: string; image?: string };

export async function getUser(): Promise<AppUser | null> {
  // Keep request-time auth out of prerendering (Cache Components).
  await connection();
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  if (!user) return null;
  const github = user.externalAccounts.find((a) => a.provider.includes("github"));
  const login = github?.username ?? user.username ?? user.id;
  return {
    id: userId,
    name: user.fullName ?? login,
    login,
    image: user.imageUrl,
  };
}
