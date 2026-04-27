"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

type Props = {
  className?: string;
};

export function ThemeToggle({ className }: Props) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
      className={cn(
        "flex size-11 items-center justify-center rounded-xl text-muted transition-colors hover:text-foreground",
        className,
      )}
    >
      {dark ? (
        <Sun className="size-6" strokeWidth={2} />
      ) : (
        <Moon className="size-6" strokeWidth={2} />
      )}
    </button>
  );
}
