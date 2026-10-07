"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BriefcaseBusiness,
  ExternalLink,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  UserRound,
  Settings,
  Users,
  X,
} from "lucide-react";
import { logoutAction } from "@/app/admin/actions/auth";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/portfolio", label: "Portfolio", icon: BriefcaseBusiness },
  { href: "/admin/team", label: "Team", icon: UserRound },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ userEmail, children }: { userEmail: string; children: React.ReactNode }) {
  const pathname = usePathname();
  // Remember which page the menu was opened on, so it closes on navigation
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;
  const setOpen = (value: boolean) => setOpenFor(value ? pathname : null);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-5">
        <Logo />
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="grid size-11 place-items-center rounded-lg lg:hidden"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </div>
      <nav aria-label="Admin" className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-btn px-3 text-[15px] font-medium transition-colors",
                    active ? "bg-ink text-white" : "text-ink hover:bg-canvas",
                  )}
                >
                  <item.icon aria-hidden="true" className="size-[18px]" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="space-y-1 border-t border-line p-3">
        <Link
          href="/"
          target="_blank"
          className="flex min-h-11 items-center gap-3 rounded-btn px-3 text-[15px] text-ink hover:bg-canvas"
        >
          <ExternalLink aria-hidden="true" className="size-[18px]" /> View website
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex min-h-11 w-full items-center gap-3 rounded-btn px-3 text-[15px] text-ink hover:bg-canvas"
          >
            <LogOut aria-hidden="true" className="size-[18px]" /> Log out
          </button>
        </form>
        <p className="truncate px-3 pt-2 text-xs text-muted">{userEmail}</p>
      </div>
    </div>
  );

  return (
    <div className="lg:pl-64">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-card lg:block">
        {sidebar}
      </aside>

      {/* Mobile */}
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-card px-4 lg:hidden">
        <Logo />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="grid size-11 place-items-center rounded-lg"
        >
          <Menu aria-hidden="true" className="size-6" />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-card shadow-float">{sidebar}</aside>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:py-10">{children}</main>
    </div>
  );
}
