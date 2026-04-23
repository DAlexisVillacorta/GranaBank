# GranaBank

Web app del challenge técnico que simula una aplicación bancaria para el Club Atlético Lanús. Permite iniciar sesión, ver el balance de la tarjeta, los últimos movimientos y listar/filtrar/buscar el historial completo.

## Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Inter (`next/font`) + lucide-react.
- **Backend**: Route Handlers de Next.js + TypeScript con arquitectura por capas (handlers → services → repositories → Prisma).
- **Base de datos**: PostgreSQL (Supabase) vía Prisma 7 con el driver adapter `@prisma/adapter-pg`.
- **Auth**: JWT firmado con `jose` + cookie `httpOnly`; bcryptjs para password hashing.
- **Validación**: Zod como fuente única de verdad para los contratos de API (schemas compartidos front/back).
- **Tests**: Vitest sobre los servicios y el rate limiter.
- **Deploy**: Vercel.

## Cómo correr el proyecto

### Pre-requisitos

- Node.js 20+
- Una cuenta en Supabase (free tier alcanza).

### 1. Cloná e instalá

```bash
git clone <repo-url>
cd GranaBank
npm install
```

### 2. Configurá variables de entorno

Copiá `.env.example` a `.env` y completá los valores:

```bash
cp .env.example .env
```

- `DATABASE_URL`: connection string del pooler de Supabase (Session mode, puerto 5432). Lo encontrás en **Project Settings → Database → Connection string → URI** (después de elegir modo "Session").
- `JWT_SECRET`: cualquier string aleatorio de 32+ caracteres. Podés generarlo con `openssl rand -base64 48`.
- `NODE_ENV`: `development` en local.

### 3. Aplicá la migración y corré el seed

```bash
npm run db:migrate   # crea las tablas en Supabase
npm run db:seed      # carga el usuario fijo y movimientos de ejemplo
```

El seed carga:
- Usuario: `soygranate@clublanus.com` / `GRANATE1@`
- Tarjeta Mastercard con balance USD 978.85
- 18 movimientos distribuidos entre suscripciones, pagos recibidos y enviados

### 4. Levantá la app

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

### Otros scripts útiles

| Script | Qué hace |
| --- | --- |
| `npm run build` | Build de producción |
| `npm run start` | Servir el build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run test` | Corre Vitest una vez |
| `npm run test:watch` | Vitest en modo watch |
| `npm run db:generate` | Regenera el Prisma Client |
| `npm run db:studio` | Abre Prisma Studio |

## Estructura del proyecto

```
src/
├── app/
│   ├── (app)/                       # Grupo de rutas autenticadas
│   │   ├── layout.tsx               # Enforces sesión + bottom nav
│   │   ├── home/page.tsx            # Greeting + card + últimos 4 movimientos
│   │   └── movimientos/
│   │       ├── page.tsx
│   │       ├── movements-view.tsx   # Client: search + filtros
│   │       └── [id]/page.tsx        # Detalle del movimiento
│   ├── login/                       # Login (público)
│   │   ├── page.tsx
│   │   └── login-form.tsx           # Client: form con Zod
│   ├── api/
│   │   ├── auth/{login,logout}/route.ts
│   │   ├── me/route.ts
│   │   └── movements/{route.ts,[id]/route.ts}
│   └── page.tsx                     # Redirect a /home o /login según sesión
├── components/
│   ├── ui/                          # Primitivos: Button, TextField, Checkbox, etc.
│   ├── layout/bottom-nav.tsx
│   └── movement/                    # MovementIcon, MovementItem, BalanceCard
├── lib/
│   ├── env.ts                       # Validación Zod de las env vars al arranque
│   ├── db.ts                        # Singleton de PrismaClient (+ adapter-pg)
│   ├── jwt.ts                       # Firma/verificación con jose (Edge-compatible)
│   ├── password.ts                  # bcryptjs con 12 rounds
│   ├── session.ts                   # getSession / requireSession
│   ├── logger.ts                    # Logger estructurado sin deps
│   ├── cn.ts                        # clsx + tailwind-merge
│   └── format.ts                    # formatAmount, formatBalance, formatDate
├── schemas/
│   ├── auth.schema.ts               # LoginSchema + tipos inferidos
│   └── movement.schema.ts           # Query + DTOs compartidos
├── server/
│   ├── errors/                      # AppError hierarchy + handleError
│   ├── repositories/                # Acceso a DB (aísla Prisma)
│   ├── services/                    # Lógica de negocio (pura, testeable)
│   └── rate-limit.ts                # In-memory rate limiter
├── proxy.ts                         # Ex-middleware: protege rutas privadas
prisma/
├── schema.prisma
├── migrations/
└── seed.ts
```

## Decisiones técnicas

### API routes de Next.js en vez de un backend separado
La consigna lo permite explícitamente y elimina complejidad (un único deploy, sin CORS, sin duplicar tooling). La **estructura por capas** (route handler → service → repository → Prisma) mantiene el código tan prolijo como un Express separado: las rutas solo parsean input y serializan output, la lógica vive en los services.

### Prisma 7 con driver adapter
Prisma 7 removió `directUrl` del schema y exige un driver adapter explícito (`@prisma/adapter-pg`) en lugar de la conexión interna legacy. Hay solo un `DATABASE_URL` que es la connection string del pooler de Supabase en modo Session.

### JWT en cookie `httpOnly` + `jose`
Elegí `jose` sobre `jsonwebtoken` porque funciona en el runtime Edge de Next (donde corre el proxy/middleware). La cookie es `httpOnly`, `SameSite=Lax`, `Secure` en producción y duración configurable vía "Recordarme" (1 día vs 30 días).

### Zod como fuente única de verdad
Los schemas (`src/schemas/`) son importados tanto por el backend (validación de input) como por el frontend (validación en el form del login + tipos de respuestas). Cero duplicación de interfaces entre front y back.

### Manejo de errores centralizado
Una jerarquía `AppError → {Validation, Unauthorized, NotFound, RateLimit}` más un `handleError()` único que mapea cualquier excepción a una respuesta JSON consistente (`{ error: { code, message } }`). Ninguna ruta tiene `try/catch` ad-hoc.

### Rate limiting en `/api/auth/login`
In-memory, 5 intentos cada 15 minutos por IP. Es intencionalmente simple; en un deploy serverless real se reemplaza por `@upstash/ratelimit` (el contrato de `checkRateLimit()` queda igual, solo cambia la implementación).

### Prevención de user enumeration
Cuando el email no existe o la password es incorrecta, la API devuelve el **mismo mensaje** (`"Email o contraseña incorrectos"`), así no se puede saber qué emails están registrados.

### Anti-IDOR en el detalle de movimiento
`movementService.getByIdForUser(id, userId)` filtra en la query por ambas claves; si el movimiento pertenece a otro usuario, la respuesta es 404, no 403 (tampoco filtra la existencia).

### Validación de env vars al arranque
`src/lib/env.ts` corre Zod sobre `process.env` al importar y tira un error descriptivo si falta algo. Mejor fallar en `next dev` que descubrir en runtime que `JWT_SECRET` estaba vacío.

### Arquitectura de páginas
- El layout de las rutas autenticadas (`(app)/layout.tsx`) hace doble check de sesión: el proxy ya redirige si no hay cookie, pero el layout sirve de defensa en profundidad ante CDN caching o bypasses inesperados.
- El Home y el detalle fetchean datos en **Server Components** directamente vía los services (sin pasar por HTTP). Movimientos es client porque la búsqueda y filtros son interactivos; usa `fetch('/api/movements')` con debounce de 300 ms.

## Qué mejoraría con más tiempo

- **Tests e2e** con Playwright del flujo login → home → movimientos (hoy hay solo unit tests de services).
- **Refresh tokens** — actualmente el JWT dura 1/30 días, sin rotación.
- **Paginación real** en `/api/movements` (cursor-based) con infinite scroll o "cargar más".
- **Detalle enriquecido** — hoy el detalle muestra todos los campos del movimiento; podría traer metadata extra (ej. merchant category, geo, comprobante descargable).
- **Dark mode** — Tailwind v4 lo soporta con `@custom-variant dark`; el brand color ya está definido en la paleta `brand-*`.
- **Rate limit en Redis/Upstash** — el in-memory no sirve en serverless multi-instancia.
- **OpenAPI autogenerado** — los schemas Zod permiten generar `openapi.json` con `zod-to-openapi` y servirlo en `/api/docs`.
- **CI en GitHub Actions** — lint + typecheck + test en cada PR.
- **Logs en prod** — hoy `logger` escribe a stdout (Vercel los captura), pero sin request id. Sumar `AsyncLocalStorage` para correlacionar por request.
- **Notificaciones / iconito de campana** — está en el Figma pero no se activó por scope.

## Credenciales del challenge

Email: `soygranate@clublanus.com` · Password: `GRANATE1@`
