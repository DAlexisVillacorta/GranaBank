import { redirect } from "next/navigation";

import { BottomNav } from "@/components/layout/bottom-nav";
import { getSession } from "@/lib/session";

/**
 * Layout del grupo autenticado. Además de la UI (container + bottom nav),
 * actúa como segunda línea de defensa: si por algún motivo el proxy no
 * redirige a /login (ej: caché de CDN, test manual), acá también forzamos
 * el redirect.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col bg-background">
      <main className="flex-1 pb-4">{children}</main>
      <BottomNav />
    </div>
  );
}
