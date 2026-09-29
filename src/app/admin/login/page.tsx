import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Logo } from "@/components/ui/Logo";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage(props: PageProps<"/admin/login">) {
  const session = await auth();
  if (session?.user) redirect("/admin");
  const sp = await props.searchParams;
  const next = typeof sp.callbackUrl === "string" ? new URL(sp.callbackUrl, "http://x").pathname : "/admin";

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="card mt-8 p-6 sm:p-8">
          <h1 className="heading-3 text-2xl">Admin log in</h1>
          <p className="mt-1.5 text-[15px] text-muted">Manage leads and website content.</p>
          <LoginForm next={next} />
        </div>
      </div>
    </main>
  );
}
