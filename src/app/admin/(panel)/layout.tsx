import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/AdminShell";

/** Every page in this group requires a logged-in admin (checked here and in src/proxy.ts). */
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  return <AdminShell userEmail={session.user.email ?? ""}>{children}</AdminShell>;
}
