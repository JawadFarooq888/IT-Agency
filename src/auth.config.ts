import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth settings shared by the proxy and the full auth setup.
 * No database or bcrypt imports here.
 */
export const authConfig = {
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 12 }, // 12 hours
  trustHost: true,
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/admin/login") return true;
      if (pathname.startsWith("/admin")) return Boolean(auth?.user);
      return true;
    },
    jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.sub && session.user) session.user.id = token.sub;
      return session;
    },
  },
} satisfies NextAuthConfig;
