import { Suspense } from "react";

import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-between bg-background px-6 py-8">
      <header className="flex flex-col items-center gap-3 pt-8">
        <div
          aria-hidden
          className="flex size-16 items-center justify-center rounded-2xl bg-brand-700 text-3xl font-bold text-white"
        >
          G
        </div>
        <h1 className="text-3xl font-bold text-brand-700">GranaBank</h1>
        <p className="text-center text-sm text-muted-foreground">
          Con cada compra, sumás orgullo granate
        </p>
      </header>

      {/* Suspense es requerido por Next para que useSearchParams pueda
          salirse del pre-render estático sin romper la build. */}
      <Suspense fallback={<div className="h-64" />}>
        <LoginForm />
      </Suspense>

      <footer className="pt-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} GranaBank · Club Atlético Lanús
      </footer>
    </main>
  );
}
