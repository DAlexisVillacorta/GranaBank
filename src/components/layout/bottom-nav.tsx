"use client";

import { Home, LogOut, ReceiptText } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/ui/theme-toggle";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
};

const ITEMS: NavItem[] = [
  { href: "/home", label: "Inicio", icon: Home },
  { href: "/movimientos", label: "Movimientos", icon: ReceiptText },
];

/**
 * Bottom nav del diseño: Inicio, Movimientos, Salir. El logout dispara
 * POST /api/auth/logout y redirige al login.
 */
export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  };

  return (
    <nav
      aria-label="Navegación principal"
      className="sticky bottom-0 z-10 border-t border-border bg-card/90 backdrop-blur"
    >
      <ul className="mx-auto flex max-w-lg items-center justify-around px-4 py-3">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex size-11 items-center justify-center rounded-xl transition-colors",
                  active
                    ? "bg-brand-50 dark:bg-brand-900 text-brand-700 dark:text-brand-300"
                    : "text-muted hover:text-foreground",
                )}
              >
                <Icon className="size-6" strokeWidth={2} />
              </Link>
            </li>
          );
        })}
        <li>
          <ThemeToggle />
        </li>
        <li>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            aria-label="Cerrar sesión"
            className="flex size-11 items-center justify-center rounded-xl text-muted transition-colors hover:text-cash-in disabled:opacity-50"
          >
            <LogOut className="size-6" strokeWidth={2} />
          </button>
        </li>
      </ul>
    </nav>
  );
}
