import { beforeEach, describe, expect, it, vi } from "vitest";

// Todos los mocks deben declararse ANTES de importar el service bajo test,
// para que vi.mock aplique antes de resolver las dependencias.
vi.mock("@/server/repositories/user.repository", () => ({
  userRepository: {
    findByEmail: vi.fn(),
  },
}));
vi.mock("@/lib/password", () => ({
  verifyPassword: vi.fn(),
}));
vi.mock("@/lib/jwt", () => ({
  signToken: vi.fn(),
}));
vi.mock("@/lib/logger", () => ({
  logger: { warn: vi.fn(), info: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import { signToken } from "@/lib/jwt";
import { verifyPassword } from "@/lib/password";
import { UnauthorizedError } from "@/server/errors/app-error";
import { userRepository } from "@/server/repositories/user.repository";
import { authService } from "@/server/services/auth.service";

const userFixture = {
  id: "user_1",
  email: "user@test.com",
  passwordHash: "hash",
  name: "Test User",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("authService.login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lanza UnauthorizedError cuando el email no existe", async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

    await expect(
      authService.login({
        email: "unknown@test.com",
        password: "irrelevant",
        remember: false,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("lanza UnauthorizedError con el mismo mensaje cuando la password es incorrecta", async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(userFixture);
    vi.mocked(verifyPassword).mockResolvedValue(false);

    await expect(
      authService.login({
        email: userFixture.email,
        password: "wrong",
        remember: false,
      }),
    ).rejects.toMatchObject({
      code: "unauthorized",
      message: "Email o contraseña incorrectos",
    });
  });

  it("devuelve token y usuario cuando las credenciales son válidas", async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(userFixture);
    vi.mocked(verifyPassword).mockResolvedValue(true);
    vi.mocked(signToken).mockResolvedValue("signed.jwt.token");

    const result = await authService.login({
      email: userFixture.email,
      password: "ok",
      remember: false,
    });

    expect(result.token).toBe("signed.jwt.token");
    expect(result.user).toEqual({
      id: userFixture.id,
      email: userFixture.email,
      name: userFixture.name,
    });
    // No filtra el password hash en la respuesta.
    expect(result).not.toHaveProperty("passwordHash");
  });

  it("firma el token con 1d por defecto y 30d cuando remember=true", async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(userFixture);
    vi.mocked(verifyPassword).mockResolvedValue(true);
    vi.mocked(signToken).mockResolvedValue("t");

    await authService.login({
      email: userFixture.email,
      password: "ok",
      remember: false,
    });
    expect(signToken).toHaveBeenLastCalledWith(
      expect.objectContaining({ sub: userFixture.id }),
      "1d",
    );

    await authService.login({
      email: userFixture.email,
      password: "ok",
      remember: true,
    });
    expect(signToken).toHaveBeenLastCalledWith(
      expect.objectContaining({ sub: userFixture.id }),
      "30d",
    );
  });
});
