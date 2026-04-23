/**
 * Jerarquía de errores de dominio.
 *
 * Cada error lleva un `code` estable (para que el front pueda reaccionar
 * sin matchear strings) y el `status` HTTP al que mapea.
 *
 * Los handlers de API convierten estos errores en respuestas JSON
 * consistentes vía `handleError`, sin duplicar try/catch en cada route.
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.status = status;
  }
}

export class ValidationError extends AppError {
  constructor(message = "Datos inválidos") {
    super("validation_error", message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "No autorizado") {
    super("unauthorized", message, 401);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Recurso no encontrado") {
    super("not_found", message, 404);
  }
}

export class RateLimitError extends AppError {
  constructor(
    message = "Demasiados intentos. Esperá unos minutos y volvé a probar.",
  ) {
    super("rate_limited", message, 429);
  }
}
