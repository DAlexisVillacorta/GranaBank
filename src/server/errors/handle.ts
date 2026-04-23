import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { logger } from "@/lib/logger";

import { AppError } from "./app-error";

export type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
    issues?: unknown;
  };
};

/**
 * Convierte cualquier error lanzado dentro de un route handler en una
 * respuesta JSON consistente. Centralizar esto evita try/catch repetidos
 * y garantiza que los errores no previstos no filtren stack traces.
 */
export function handleError(error: unknown): NextResponse<ApiErrorResponse> {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status },
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: "validation_error",
          message: "Datos inválidos",
          issues: error.issues,
        },
      },
      { status: 400 },
    );
  }

  // Fallback: loguear el error real y devolver un mensaje genérico.
  logger.error({ err: error }, "Unhandled error in route handler");
  return NextResponse.json(
    {
      error: {
        code: "internal_error",
        message: "Error interno del servidor",
      },
    },
    { status: 500 },
  );
}
