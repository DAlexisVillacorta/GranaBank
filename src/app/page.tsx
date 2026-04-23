import Link from "next/link";

export default function RootPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-2">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-brand-700 text-white">
          <span className="text-2xl font-bold">G</span>
        </div>
        <h1 className="text-3xl font-bold text-brand-700">GranaBank</h1>
        <p className="text-muted">Con cada compra, sumás orgullo granate</p>
      </div>

      <Link
        href="/login"
        className="rounded-full bg-brand-700 px-8 py-3 font-medium text-white transition hover:bg-brand-800"
      >
        Ingresar
      </Link>
    </main>
  );
}
