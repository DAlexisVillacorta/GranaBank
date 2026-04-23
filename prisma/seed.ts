import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

import { PrismaClient, type Prisma } from "@prisma/client";

/**
 * Seed idempotente.
 *
 * Borra todo el dominio y lo recrea desde cero. Es seguro correrlo
 * varias veces en desarrollo. No usar en producción contra datos reales.
 */

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

// Credenciales fijas del challenge.
const SEED_EMAIL = "soygranate@clublanus.com";
const SEED_PASSWORD = "GRANATE1@";
const SEED_NAME = "Granate";

// Devuelve una fecha N días atrás respecto a hoy.
const daysAgo = (n: number): Date => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(12, 0, 0, 0);
  return d;
};

async function main() {
  console.log("🌱 Limpiando dominio...");
  await db.$transaction([
    db.movement.deleteMany(),
    db.card.deleteMany(),
    db.user.deleteMany(),
  ]);

  console.log("🌱 Creando usuario de prueba...");
  const passwordHash = await hash(SEED_PASSWORD, 12);
  const user = await db.user.create({
    data: {
      email: SEED_EMAIL,
      passwordHash,
      name: SEED_NAME,
    },
  });

  console.log("🌱 Creando tarjeta...");
  await db.card.create({
    data: {
      userId: user.id,
      balance: "978.85",
      currency: "USD",
      last4: "1234",
      holder: "Soy Granate",
      expDate: "02/30",
      issuer: "MASTERCARD",
    },
  });

  console.log("🌱 Creando movimientos...");
  const movements: Prisma.MovementCreateManyInput[] = [
    // Suscripciones (violeta en el diseño).
    { userId: user.id, type: "SUS", counterparty: "Adobe", description: "Pago de suscripción", amount: "125.00", date: daysAgo(1) },
    { userId: user.id, type: "SUS", counterparty: "Figma", description: "Pago de suscripción", amount: "125.00", date: daysAgo(3) },
    { userId: user.id, type: "SUS", counterparty: "Netflix", description: "Pago de suscripción", amount: "15.99", date: daysAgo(5) },
    { userId: user.id, type: "SUS", counterparty: "Spotify", description: "Pago de suscripción", amount: "9.99", date: daysAgo(8) },
    { userId: user.id, type: "SUS", counterparty: "Amazon Prime", description: "Pago de suscripción", amount: "14.99", date: daysAgo(12) },
    { userId: user.id, type: "SUS", counterparty: "iCloud+", description: "Pago de suscripción", amount: "2.99", date: daysAgo(20) },

    // Pagos recibidos (rojo en el diseño).
    { userId: user.id, type: "CASH_IN", counterparty: "Ronaldo", description: "Pago recibido", amount: "95.00", date: daysAgo(2) },
    { userId: user.id, type: "CASH_IN", counterparty: "José Suárez", description: "Pago recibido", amount: "95.00", date: daysAgo(4) },
    { userId: user.id, type: "CASH_IN", counterparty: "Julio César", description: "Pago recibido", amount: "95.00", date: daysAgo(7) },
    { userId: user.id, type: "CASH_IN", counterparty: "Mariano Martínez", description: "Pago recibido", amount: "150.00", date: daysAgo(10) },
    { userId: user.id, type: "CASH_IN", counterparty: "Lucas Gómez", description: "Pago recibido", amount: "200.00", date: daysAgo(15) },
    { userId: user.id, type: "CASH_IN", counterparty: "Club Atlético Lanús", description: "Pago recibido", amount: "1200.00", date: daysAgo(25) },

    // Pagos enviados (naranja en el diseño).
    { userId: user.id, type: "CASH_OUT", counterparty: "Juan Perez", description: "Pago enviado", amount: "95.00", date: daysAgo(2) },
    { userId: user.id, type: "CASH_OUT", counterparty: "Juan Rodríguez", description: "Pago enviado", amount: "95.00", date: daysAgo(6) },
    { userId: user.id, type: "CASH_OUT", counterparty: "Jorge Álvarez", description: "Pago enviado", amount: "95.00", date: daysAgo(9) },
    { userId: user.id, type: "CASH_OUT", counterparty: "Supermercado Coto", description: "Pago enviado", amount: "145.50", date: daysAgo(11) },
    { userId: user.id, type: "CASH_OUT", counterparty: "Uber", description: "Pago enviado", amount: "12.30", date: daysAgo(14) },
    { userId: user.id, type: "CASH_OUT", counterparty: "Farmacia Social", description: "Pago enviado", amount: "45.00", date: daysAgo(18) },
  ];

  await db.movement.createMany({ data: movements });

  console.log(`✅ Seed completado: 1 usuario, 1 tarjeta, ${movements.length} movimientos.`);
}

main()
  .catch((error) => {
    console.error("❌ Error ejecutando seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
