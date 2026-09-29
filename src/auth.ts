import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "./auth.config";
import { db } from "@/lib/db";
import { hashIp, rateLimit } from "@/lib/security";

const loginSchema = z.object({
  email: z.email().max(200),
  password: z.string().min(1).max(200),
});

let dummyHash: string | undefined;

class TooManyAttempts extends CredentialsSignin {
  code = "rate_limited";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials, request) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
        const allowed = await rateLimit(`login:${hashIp(ip)}`, 10, 15 * 60 * 1000);
        if (!allowed) throw new TooManyAttempts();

        const user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
        // Compare against a dummy hash when the user does not exist, to keep timing similar
        dummyHash ??= await bcrypt.hash("timing-dummy-password", 12);
        const hash = user?.passwordHash ?? dummyHash;
        const valid = await bcrypt.compare(parsed.data.password, hash);
        if (!user || !valid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
});

/** Use at the top of every admin server action and page. Throws when not logged in. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user;
}
