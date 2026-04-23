import { env } from "./env";

/**
 * Logger estructurado minimalista.
 *
 * En producción emite JSON por línea (fácil de parsear en Vercel/Datadog).
 * En desarrollo formatea legible para la consola. En tests silencioso.
 *
 * Evita una dependencia extra como pino para mantener el bundle chico; el
 * contrato es el mismo (level, fields, message) por si queremos migrar.
 */
type LogLevel = "debug" | "info" | "warn" | "error";
type LogFields = Record<string, unknown>;

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const MIN_LEVEL: LogLevel =
  env.NODE_ENV === "production" ? "info" : "debug";

function shouldLog(level: LogLevel): boolean {
  if (env.NODE_ENV === "test") return false;
  return LEVEL_ORDER[level] >= LEVEL_ORDER[MIN_LEVEL];
}

function write(level: LogLevel, fields: LogFields | string, message?: string) {
  if (!shouldLog(level)) return;

  const [extra, msg] =
    typeof fields === "string" ? [{}, fields] : [fields, message ?? ""];

  if (env.NODE_ENV === "production") {
    console.log(
      JSON.stringify({
        level,
        ts: new Date().toISOString(),
        message: msg,
        ...extra,
      }),
    );
    return;
  }

  const prefix = `[${level.toUpperCase()}]`;
  if (Object.keys(extra).length > 0) {
    console.log(prefix, msg, extra);
  } else {
    console.log(prefix, msg);
  }
}

export const logger = {
  debug: (fields: LogFields | string, message?: string) =>
    write("debug", fields, message),
  info: (fields: LogFields | string, message?: string) =>
    write("info", fields, message),
  warn: (fields: LogFields | string, message?: string) =>
    write("warn", fields, message),
  error: (fields: LogFields | string, message?: string) =>
    write("error", fields, message),
};
