# Null Chat

> **Status: Under active development** — features, APIs, and setup steps may change. Not recommended for production use yet.

A secure messaging app built with **Next.js**, featuring end-to-end encrypted (E2EE) messages, email/password authentication, real-time messaging via **Ably**, and Web Push notifications.

Package name: `aegis-chat`

## About

Null Chat is a self-hosted chat platform focused on privacy. Messages are encrypted client-side before being stored or delivered. The server handles authentication, conversation metadata, and real-time delivery — but cannot read message contents without the user's private key.

## Features

- End-to-end message encryption (ECDH + AES-GCM)
- Private key encrypted with the user's password and stored server-side
- Direct and group conversations
- Real-time messaging via Ably
- Browser push notifications (PWA)
- Invite-code registration
- Light/dark theme (Tailwind CSS + shadcn/ui)

## Requirements

Before running locally, you need:

| Tool | Version | Purpose |
|------|---------|---------|
| [Node.js](https://nodejs.org/) | 20+ | Runtime |
| [pnpm](https://pnpm.io/) | 9+ | Package manager |
| PostgreSQL | Any hosted instance | Database ([Neon](https://neon.tech) recommended) |
| [Ably](https://ably.com) account | — | Real-time messaging |
| VAPID keys | — | Web Push notifications (optional for basic dev) |

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/aegis-chat.git
cd aegis-chat
```

### 2. Install dependencies

```bash
pnpm install
```

> Uses `pnpm-lock.yaml`. `npm` or `yarn` work too, but pnpm is recommended.

Native dependency build scripts (`esbuild`, `sharp`, etc.) are pre-approved in `pnpm-workspace.yaml` — no need to run `pnpm approve-builds` after cloning.

### 3. Set up environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Required | What to set |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Yes | Random secret — `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Yes | App URL — `http://localhost:3000` locally |
| `NEXT_PUBLIC_ABLY_KEY` | Yes | Ably API key |
| `VAPID_EMAIL` | For push | `mailto:you@example.com` |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | For push | VAPID public key |
| `VAPID_PRIVATE_KEY` | For push | VAPID private key |

Generate VAPID keys:

```bash
npx web-push generate-vapid-keys
```

### 4. Set up the database

Push the Drizzle schema to your PostgreSQL database:

```bash
pnpm db:push
```

To generate migration files instead: `pnpm db:generate`

### 5. Add an invite code

Registration requires a valid invite code. Insert one into the `invite_codes` table:

```sql
INSERT INTO invite_codes (id, code, is_used, created_at, updated_at)
VALUES ('inv_001', 'WELCOME2026', false, NOW(), NOW());
```

Or use Drizzle Studio: `pnpm db:studio`

### 6. Run the development server

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
| `pnpm db:studio` | Open Drizzle Studio (database GUI) |

## Production

```bash
pnpm build
pnpm start
```

Set `BETTER_AUTH_URL` to your production domain (e.g. `https://chat.example.com`).

## Project structure

```
├── app/              # Next.js App Router pages and API routes
├── components/       # React components and UI
├── db/               # Drizzle ORM schema and database client
├── lib/              # Auth, encryption, Web Push helpers
├── realtime/         # Ably client and channel helpers
├── store/            # Zustand stores
└── public/           # Static assets, Service Worker, PWA manifest
```

## Tech stack

- **Next.js 16** · **React 19** · **TypeScript**
- **Better Auth** — authentication
- **Drizzle ORM** + **Neon PostgreSQL** — database
- **Ably** — real-time messaging
- **Web Push (VAPID)** — push notifications
- **Tailwind CSS 4** · **shadcn/ui** · **Zustand**

## Notes

- **Under development** — expect breaking changes, incomplete features, and missing documentation.
- Never commit `.env.local` — it is excluded by `.gitignore` (`.env.example` is the template).
- The encryption private key is generated in the browser and never stored in plain text on the server.
- **Ably** is required for real-time chat.
- **Push notifications** need all three VAPID variables; other features work without them.

## Publishing to GitHub

The repo is ready to push. Make sure `.env.local` is not tracked:

```bash
git status          # confirm no .env.local
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/aegis-chat.git
git push -u origin main
```

## License

Private project. Add a license file if you plan to open-source it.
