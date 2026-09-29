"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import type { FormState } from "@/lib/admin";

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const next = String(formData.get("next") ?? "/admin");
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: next.startsWith("/admin") ? next : "/admin",
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin" && (error as AuthError & { code?: string }).code === "rate_limited") {
        return { error: "Too many login attempts. Please wait 15 minutes and try again." };
      }
      return { error: "Wrong email or password." };
    }
    // Redirects are thrown as errors and must be re-thrown
    throw error;
  }
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/admin/login" });
}
