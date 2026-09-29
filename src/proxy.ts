import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

// Redirects logged-out visitors to /admin/login
const handler = auth((req) => {
  const { pathname } = req.nextUrl;
  if (!req.auth?.user && pathname !== "/admin/login") {
    const url = new URL("/admin/login", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", pathname);
    return Response.redirect(url);
  }
});

/** Protects /admin routes. */
export function proxy(request: NextRequest) {
  return handler(request, { params: Promise.resolve({}) });
}

export const config = {
  matcher: ["/admin/:path*"],
};
