"use client";

import { Inbox } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBanner } from "@/components/ui/error-banner";
import { FilterChip } from "@/components/ui/filter-chip";
import { SearchInput } from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { MovementItem } from "@/components/movement/movement-item";
import type {
  MovementDTO,
  MovementsResponse,
  MovementType,
} from "@/schemas/movement.schema";

type Filter = "ALL" | MovementType;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "ALL", label: "Todos" },
  { value: "SUS", label: "Débito Aut." },
  { value: "CASH_IN", label: "Recibido" },
  { value: "CASH_OUT", label: "Enviado" },
];

/**
 * Debounce simple: devuelve el valor `value` con un delay de `ms`, lo
 * que evita disparar una request por cada tecla en la búsqueda.
 */
function useDebouncedValue<T>(value: T, ms = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

export function MovementsView() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");
  const [data, setData] = useState<MovementDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebouncedValue(search, 300);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    if (filter !== "ALL") params.set("type", filter);
    return params.toString();
  }, [debouncedSearch, filter]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/movements${queryString ? `?${queryString}` : ""}`,
        { cache: "no-store" },
      );
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: { message?: string };
        } | null;
        throw new Error(body?.error?.message ?? "No se pudo cargar la lista");
      }
      const json = (await res.json()) as MovementsResponse;
      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="flex flex-col gap-4">
      <SearchInput
        placeholder="Ingresa un nombre o servicio"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Buscar movimientos"
      />

      <div
        role="tablist"
        aria-label="Filtros rápidos"
        className="flex gap-2 overflow-x-auto pb-1"
      >
        {FILTERS.map((f) => (
          <FilterChip
            key={f.value}
            active={filter === f.value}
            onClick={() => setFilter(f.value)}
            role="tab"
            aria-selected={filter === f.value}
          >
            {f.label}
          </FilterChip>
        ))}
      </div>

      {error ? (
        <ErrorBanner message={error} onRetry={load} />
      ) : loading ? (
        <ul className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i}>
              <Skeleton className="h-16 rounded-2xl" />
            </li>
          ))}
        </ul>
      ) : data && data.length === 0 ? (
        <EmptyState
          icon={<Inbox className="size-6" />}
          title="Sin resultados"
          description={
            debouncedSearch || filter !== "ALL"
              ? "Probá ajustando la búsqueda o los filtros."
              : "Todavía no tenés movimientos."
          }
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {data?.map((m) => (
            <li key={m.id}>
              <MovementItem movement={m} href={`/movimientos/${m.id}`} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
