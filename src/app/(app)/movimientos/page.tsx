import { MovementsView } from "./movements-view";

export default function MovimientosPage() {
  return (
    <div className="flex flex-col gap-4 px-5 pt-6">
      <h1 className="text-2xl font-bold text-foreground">Movimientos</h1>
      <MovementsView />
    </div>
  );
}
