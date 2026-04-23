import { signToken } from "@/lib/jwt";
import { logger } from "@/lib/logger";
import { verifyPassword } from "@/lib/password";
import type { LoginInput } from "@/schemas/auth.schema";

import { UnauthorizedError } from "../errors/app-error";
import { userRepository } from "../repositories/user.repository";

export type LoginResult = {
  token: string;
  expiresIn: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
};

export const authService = {
  /**
   * Autentica un usuario por email + password.
   *
   * Usa el mismo mensaje "Email o contraseña incorrectos" en ambos casos
   * (email inexistente / password inválida) para no filtrar información
   * sobre qué cuentas existen ("user enumeration").
   */
  async login(input: LoginInput): Promise<LoginResult> {
    const user = await userRepository.findByEmail(input.email);

    if (!user) {
      logger.warn(
        { email: input.email },
        "Login attempt with unknown email",
      );
      throw new UnauthorizedError("Email o contraseña incorrectos");
    }

    const isValid = await verifyPassword(input.password, user.passwordHash);
    if (!isValid) {
      logger.warn(
        { userId: user.id },
        "Login attempt with wrong password",
      );
      throw new UnauthorizedError("Email o contraseña incorrectos");
    }

    // 30 días si marcó "Recordarme", 1 día si no.
    const expiresIn = input.remember ? "30d" : "1d";
    const token = await signToken(
      { sub: user.id, email: user.email },
      expiresIn,
    );

    logger.info({ userId: user.id }, "Login successful");

    return {
      token,
      expiresIn,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  },
};
