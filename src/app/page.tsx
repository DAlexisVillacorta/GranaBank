import { redirect } from "next/navigation";

import { getSession } from "@/lib/session";

/** La ruta raíz redirige según haya o no sesión activa. */
export default async function RootPage() {
  const session = await getSession();
  redirect(session ? "/home" : "/login");
}
