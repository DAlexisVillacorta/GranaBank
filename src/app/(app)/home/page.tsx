import { Bell, Search } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { BalanceCard } from "@/components/movement/balance-card";
import { MovementItem } from "@/components/movement/movement-item";
import { getSession } from "@/lib/session";
import { meService } from "@/server/services/me.service";
import { movementService } from "@/server/services/movement.service";

// Re-fetch on each request (el balance y los movimientos son datos vivos).
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Cargas en paralelo para reducir el TTFB.
  const [profile, latestMovements] = await Promise.all([
    meService.getProfile(session.sub),
    movementService.getLatest(session.sub, 4),
  ]);

  return (
    <div className="flex flex-col gap-6 px-5 pt-6">
      <header className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm text-muted">Hola</span>
          <h1 className="text-2xl font-bold text-foreground">
            {profile.user.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {/*
            La spec pide que el ícono de lupa redirija a /movimientos.
            Lo implementamos como un Link accesible en el header del Home.
          */}
          <Link
            href="/movimientos"
            aria-label="Ir a movimientos"
            className="flex size-10 items-center justify-center rounded-full text-foreground hover:bg-brand-50 dark:hover:bg-brand-900"
          >
            <Search className="size-5" strokeWidth={2} />
          </Link>
          <button
            type="button"
            aria-label="Notificaciones"
            className="flex size-10 items-center justify-center rounded-full text-foreground hover:bg-brand-50 dark:hover:bg-brand-900"
          >
            <Bell className="size-5" strokeWidth={2} />
          </button>
        </div>
      </header>

      {profile.card ? <BalanceCard card={profile.card} /> : null}

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-foreground">
          Últimos movimientos
        </h2>
        {latestMovements.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Todavía no tenés movimientos.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {latestMovements.map((m, i) => (
              <li
                key={m.id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <MovementItem movement={m} href={`/movimientos/${m.id}`} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
