import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

// All auth lives here (plus the route handler) so it can be swapped later.
// JWT sessions (the default): no database.
export const { handlers, auth, signIn, signOut } = NextAuth({
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
    jwt({ token, user }) {
      if (user && "login" in user) token.login = user.login as string;
      return token;
    },
    session({ session, token }) {
      session.user.login = token.login as string | undefined;
      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    user: { login?: string } & import("next-auth").DefaultSession["user"];
  }
}
