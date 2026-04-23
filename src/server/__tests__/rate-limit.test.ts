import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RateLimitError } from "@/server/errors/app-error";
import { checkRateLimit, resetRateLimit } from "@/server/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    resetRateLimit();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("permite hasta `max` intentos dentro de la ventana", () => {
    expect(() => checkRateLimit("ip:1", 3, 60_000)).not.toThrow();
    expect(() => checkRateLimit("ip:1", 3, 60_000)).not.toThrow();
    expect(() => checkRateLimit("ip:1", 3, 60_000)).not.toThrow();
  });

  it("tira RateLimitError al superar el límite", () => {
    checkRateLimit("ip:2", 2, 60_000);
    checkRateLimit("ip:2", 2, 60_000);

    expect(() => checkRateLimit("ip:2", 2, 60_000)).toThrow(RateLimitError);
  });

  it("resetea el contador cuando pasa la ventana de tiempo", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-22T10:00:00Z"));

    checkRateLimit("ip:3", 1, 60_000);
    expect(() => checkRateLimit("ip:3", 1, 60_000)).toThrow(RateLimitError);

    // Avanzamos 2 minutos (más que la ventana de 60s).
    vi.setSystemTime(new Date("2026-04-22T10:02:00Z"));
    expect(() => checkRateLimit("ip:3", 1, 60_000)).not.toThrow();
  });

  it("aplica el límite por key — keys distintas no comparten contador", () => {
    checkRateLimit("ip:4", 1, 60_000);
    expect(() => checkRateLimit("ip:4", 1, 60_000)).toThrow();
    expect(() => checkRateLimit("ip:5", 1, 60_000)).not.toThrow();
  });
});
