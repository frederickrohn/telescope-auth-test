// All auth lives here (plus app/api/auth/[...nextauth]) so it can be swapped back to Supabase Auth.
// This variant: Auth.js v5 + GitHub, JWT sessions, no database adapter.
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { connection } from "next/server";

export const { handlers, auth, signOut: authSignOut } = NextAuth({
  // Runs behind Telescope's proxy, which sends X-Forwarded-Host/Proto.
  trustHost: true,
  providers: [
    GitHub({
      profile(profile) {
        return {
          id: String(profile.id),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          login: profile.login,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, profile }) {
      if (profile) {
        token.githubId = String(profile.id);
        token.login = profile.login as string;
      }
      if (user?.image) token.picture = user.image;
      return token;
    },
    session({ session, token }) {
      session.user.githubId = token.githubId as string;
      session.user.login = token.login as string;
      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    user: { githubId: string; login: string } & import("next-auth").DefaultSession["user"];
  }
}

export type AppUser = { id: string; name: string; login: string; image?: string };

export async function getUser(): Promise<AppUser | null> {
  // auth() reads the clock; keep it out of prerendering (Cache Components).
  await connection();
  const session = await auth();
  if (!session?.user?.githubId) return null;
  const { githubId, name, login, image } = session.user;
  return { id: githubId, name: name ?? login, login, image: image ?? undefined };
}

// Sign-in is NOT a server action here: app/sign-in-button.tsx posts a plain HTML form to
// /api/auth/signin/github, which answers with a 302 to github.com (server-redirect path).
export { signInPath } from "./auth-paths";

export async function signOut() {
  "use server";
  await authSignOut({ redirectTo: "/" });
}
