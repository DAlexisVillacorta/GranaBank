import type { MeResponse } from "@/schemas/movement.schema";

import { NotFoundError } from "../errors/app-error";
import { userRepository } from "../repositories/user.repository";

export const meService = {
  /**
   * Devuelve el perfil del usuario actual + su primera tarjeta (la que
   * se muestra en el Home). El modelo soporta múltiples tarjetas por
   * usuario, pero la UI solo renderiza una.
   */
  async getProfile(userId: string): Promise<MeResponse> {
    const user = await userRepository.findByIdWithCard(userId);
    if (!user) throw new NotFoundError("Usuario no encontrado");

    const card = user.cards[0];

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      card: card
        ? {
            balance: card.balance.toString(),
            currency: card.currency,
            last4: card.last4,
            holder: card.holder,
            expDate: card.expDate,
            issuer: card.issuer,
          }
        : null,
    };
  },
};
