# Null Chat

A secure messaging app built with **Next.js**, featuring end-to-end encrypted (E2EE) messages, email/password authentication, real-time messaging via **Ably**, and Web Push notifications.

> Package name in `package.json`: `aegis-chat`

## Features

- Message encryption using ECDH + AES-GCM (private key stored encrypted with the user's password)
- Direct and group conversations
- Real-time messaging via Ably
- Browser push notifications (PWA)
- New account registration requires an **invite code**
- Modern UI (Tailwind CSS + shadcn/ui) with light/dark theme support

## Requirements

| Tool | Recommended version |
|------|---------------------|
| [Node.js](https://nodejs.org/) | 20 or later |
| [pnpm](https://pnpm.io/) | 9 or later |
| PostgreSQL | Database ( [Neon](https://neon.tech) recommended ) |
| [Ably](https://ably.com) | Account + API key |
| VAPID keys | For Web Push notifications |

## Local setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/aegis-chat.git
cd aegis-chat
```

### 2. Install dependencies

```bash
pnpm install
```

> The project uses `pnpm-lock.yaml`. `npm` or `yarn` also work, but pnpm is recommended.

Build scripts for native dependencies (`esbuild`, `sharp`, etc.) are pre-approved in `pnpm-workspace.yaml`, so you do **not** need to run `pnpm approve-builds` after cloning.

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in the values below:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Random auth secret — generate with `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | App URL — use `http://localhost:3000` locally |
| `NEXT_PUBLIC_ABLY_KEY` | Ably API key |
| `VAPID_EMAIL` | Your email as `mailto:you@example.com` |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | VAPID public key |
| `VAPID_PRIVATE_KEY` | VAPID private key |

**Generate VAPID keys:**

```bash
npx web-push generate-vapid-keys
```

### 4. Create database tables

```bash
pnpm db:push
```

> Pushes the Drizzle schema directly to the database. To generate migration files instead: `pnpm db:generate`

### 5. Add invite codes

Registration requires a valid invite code in the `invite_codes` table. Add one manually:

```sql
INSERT INTO invite_codes (id, code, is_used, created_at, updated_at)
VALUES ('inv_001', 'WELCOME2026', false, NOW(), NOW());
```

> You can manage data visually with Drizzle Studio: `pnpm db:studio`

### 6. Run the app

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to the sign-in page.

## CLI commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the development server |
| `pnpm build` | Build for production |
| `pnpm start` | Run the production server (after `build`) |
| `pnpm lint` | Run ESLint |
| `pnpm db:push` | Sync the database schema |
| `pnpm db:generate` | Generate migration files |
| `pnpm db:studio` | Open Drizzle Studio |

## Production

```bash
pnpm build
pnpm start
```

When deploying, set `BETTER_AUTH_URL` to your production URL (e.g. `https://chat.example.com`).

## Project structure

```
├── app/              # Next.js pages (App Router) and API routes
├── components/       # React components and UI
├── db/               # Drizzle ORM schema and database connection
├── lib/              # Auth, encryption, Web Push
├── realtime/         # Ably client and channels
├── store/            # Zustand state
└── public/           # Static assets, Service Worker, PWA manifest
```

## Tech stack

- **Next.js 16** · **React 19** · **TypeScript**
- **Better Auth** — authentication
- **Drizzle ORM** + **Neon PostgreSQL** — database
- **Ably** — real-time messaging
- **Web Push (VAPID)** — notifications
- **Tailwind CSS 4** · **shadcn/ui** · **Zustand**

## Important notes

- **Do not commit** `.env.local` to GitHub — `.env*` files are excluded in `.gitignore` (except `.env.example`).
- The encryption **private key** is generated in the browser and never stored in plain text on the server.
- **Ably** is required for real-time chat; without it, messaging will not work correctly.
- **Push notifications** are optional during development, but VAPID variables are required if you want to enable them.

## License

Private project (`private: true`). Add a license file if you plan to open-source it.
