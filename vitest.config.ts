import { defineConfig } from "vitest/config";

export default defineConfig({
  // Vite 7+ resuelve los aliases de tsconfig.json de forma nativa.
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    globals: false,
    include: ["src/**/*.test.ts"],
  },
});
