import "dotenv/config";

import { defineConfig } from "prisma/config";

/**
 * Configuración de Prisma CLI.
 *
 * A partir de Prisma 7 las URLs de datasource se declaran acá en vez
 * de en schema.prisma. Un solo `url` cubre runtime y migraciones; para
 * Supabase usamos la connection string del pooler en sesión (puerto 5432).
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
