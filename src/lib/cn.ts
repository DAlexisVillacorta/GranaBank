import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina class names condicionales y resuelve conflictos de Tailwind.
 * Ej: cn("p-4", condition && "p-6") → "p-6" (la última gana).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
