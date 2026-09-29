"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { services } from "@/content/services";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { CalendlyButton } from "@/components/ui/CalendlyButton";
import { IconBadge } from "@/components/ui/IconBadge";
import { buttonClasses } from "@/components/ui/button-styles";
import { cn } from "@/lib/utils";

const links = [
  { href: "/portfolio", label: "Our Work" },
  { href: "/#process", label: "Process" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation
  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Close dropdown on outside click / Escape
  useEffect(() => {
    if (!dropdownOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setDropdownOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [dropdownOpen]);

  const isActive = (href: string) =>
    href.startsWith("/#") ? false : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-200",
        scrolled ? "border-line bg-canvas/95 backdrop-blur" : "border-transparent bg-canvas",
      )}
    >
      <Container className="flex h-[72px] items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1 text-[15px] font-medium text-ink">
            <li>
              <div
                ref={dropdownRef}
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button
                  type="button"
                  aria-expanded={dropdownOpen}
                  aria-controls={dropdownId}
                  onClick={() => setDropdownOpen((o) => !o)}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-1 rounded-lg px-3 hover:text-accent",
                    pathname.startsWith("/services") && "text-accent",
                  )}
                >
                  Services
                  <ChevronDown
                    aria-hidden="true"
                    className={cn("size-4 transition-transform", dropdownOpen && "rotate-180")}
                  />
                </button>
                <div
                  id={dropdownId}
                  hidden={!dropdownOpen}
                  className="absolute top-full left-1/2 w-[640px] -translate-x-1/2 pt-2"
                >
                  <div className="card grid grid-cols-2 gap-1 p-3 shadow-float">
                    {services.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className="flex items-start gap-3 rounded-xl p-3 hover:bg-canvas"
                      >
                        <IconBadge icon={s.icon} tint={s.tint} size="sm" />
                        <span>
                          <span className="block font-semibold text-ink">{s.title}</span>
                          <span className="mt-0.5 block text-sm leading-snug font-normal text-muted">
                            {s.benefit}
                          </span>
                        </span>
                      </Link>
                    ))}
                    <Link
                      href="/services"
                      className="flex items-center gap-2 rounded-xl p-3 font-semibold text-accent hover:bg-canvas"
                    >
                      View all services <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </li>
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-lg px-3 hover:text-accent",
                    isActive(l.href) && "text-accent",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <CalendlyButton className={buttonClasses("outline", "sm")}>Book a call</CalendlyButton>
          <Link href="/contact#quote" className={buttonClasses("primary", "sm")}>
            Get a free quote
          </Link>
        </div>

        <button
          type="button"
          className="-mr-2 grid size-11 place-items-center rounded-lg text-ink lg:hidden"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
        >
          <Menu aria-hidden="true" className="size-6" />
        </button>
      </Container>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [servicesOpen, setServicesOpen] = useState(false);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Keep focus inside the panel
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);
    panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
      previous?.focus();
    };
  }, [open, handleKey]);

  return (
    <div className={cn("fixed inset-0 z-[60] lg:hidden", !open && "pointer-events-none")} aria-hidden={!open}>
      <div
        className={cn(
          "absolute inset-0 bg-ink/40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className={cn(
          "absolute top-0 right-0 flex h-full w-full max-w-sm flex-col bg-canvas shadow-float transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-[72px] items-center justify-between border-b border-line px-4 md:px-6">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="-mr-2 grid size-11 place-items-center rounded-lg text-ink"
          >
            <X aria-hidden="true" className="size-6" />
          </button>
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 py-4 md:px-6">
          <ul className="space-y-1 text-lg font-medium text-ink">
            <li>
              <button
                type="button"
                aria-expanded={servicesOpen}
                onClick={() => setServicesOpen((o) => !o)}
                className="flex min-h-12 w-full items-center justify-between rounded-lg"
              >
                Services
                <ChevronDown
                  aria-hidden="true"
                  className={cn("size-5 transition-transform", servicesOpen && "rotate-180")}
                />
              </button>
              {servicesOpen && (
                <ul className="mb-2 space-y-0.5 border-l border-line pl-4 text-base">
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link href={`/services/${s.slug}`} className="flex min-h-11 items-center text-body">
                        {s.title}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/services" className="flex min-h-11 items-center font-semibold text-accent">
                      All services
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            {[...links, { href: "/pricing", label: "Pricing" }, { href: "/contact", label: "Contact" }].map(
              (l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={onClose} className="flex min-h-12 items-center rounded-lg">
                    {l.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>
        <div className="space-y-3 border-t border-line p-4 md:p-6">
          <Link href="/contact#quote" onClick={onClose} className={buttonClasses("primary", "md", "w-full")}>
            Get a free quote
          </Link>
          <CalendlyButton className={buttonClasses("outline", "md", "w-full")}>Book a call</CalendlyButton>
        </div>
      </div>
    </div>
  );
}
