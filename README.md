# Niva Cart

Demo e-commerce storefront built with **Next.js**, **TypeScript**, and **Tailwind CSS** — product catalog, cart, and a protected admin panel.

## Demo admin login

| | |
|---|---|
| **URL** | [`/admin/login`](https://niva-cart.vercel.app/admin/login) |
| **Email** | `admin@niva-cart.local` |
| **Password** | `admin123` |

Protected routes: `/admin`, `/admin/users`, `/admin/support`. Auth via **next-auth** (email + password, admin role only).

## What this project includes

- **Storefront** — product listing, product detail, client-side cart
- **Admin dashboard** — analytics, user management, support page
- **Authentication** — credentials login, JWT session, route protection
- **Database** — Postgres (Prisma), seeded demo users
- **Testing** — Jest (unit), Playwright (e2e), Lighthouse CI
- **Deploy** — Vercel + GitHub Actions

## Lighthouse scores

| Category | Score |
|----------|-------|
| Performance | **100**/100 |
| Accessibility | **98**/100 |
| Best Practices | **96**/100 |
| SEO | **100**/100 |

Mobile-first audit (375×667, simulated 3G). CI enforces 95%+ on all categories.

```bash
npm run lighthouse:full   # full check
```

Details: [LIGHTHOUSE_SETUP.md](./LIGHTHOUSE_SETUP.md)

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # unit tests
npm run test:e2e     # Playwright (see e2e/ for setup)
```

For local Postgres: `docker compose up -d`, then `npm run db:migrate`. See **Admin authentication** below for env vars and seed.

## Admin authentication

Admin login uses **next-auth v4** with **Credentials** (email + password). Only users with `role: admin` and a `passwordHash` in the database can sign in. Customer accounts have no password.

Demo credentials are at the top of this README. Works after `npm run db:seed` (local, preview, or prod).

### Local setup

Add to `.env` (see `.env.example`):

```bash
DATABASE_URL=postgresql://niva:niva@localhost:5432/niva_cart
NEXTAUTH_SECRET=...          # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
```

```bash
npm run db:seed
```

### Vercel environment variables

| Variable | Production | Preview | Notes |
|----------|------------|---------|-------|
| `NEXTAUTH_SECRET` | ✅ | ✅ | Required. Exact name — not `NEXT_AUTH_SECRET`. |
| `NEXTAUTH_URL` | ✅ | ❌ | Production: `https://your-prod-domain.vercel.app`. Preview uses `VERCEL_URL` automatically. |
| `DATABASE_URL` | ✅ | ✅ | See Supabase note below. |

After adding or changing env vars, **redeploy** — existing deployments do not pick up new values.

### Supabase `DATABASE_URL` — add `pgbouncer=true`

On Vercel, append this to your Supabase `DATABASE_URL` (default port `5432`):

```
?pgbouncer=true
```

Example:

```
postgresql://postgres.[ref]:[password]@aws-0-[region].supabase.co:5432/postgres?pgbouncer=true
```

Without it, Prisma may fail with `prepared statement "s0" already exists`.

Run migrations and seed from your machine (do not commit prod URLs):

```bash
DATABASE_URL="postgresql://...:5432/postgres" npm run db:deploy
DATABASE_URL="postgresql://...:5432/postgres" npm run db:seed
```

### Routes

| URL | Access |
|-----|--------|
| `/admin/login` | Public |
| `/admin`, `/admin/users`, etc. | Admin session required (`proxy.ts`) |

Logout is in the admin dashboard header. Login uses a separate layout under `src/app/admin/(auth)/`.

## Stack

Next.js 16 · TypeScript · Tailwind CSS · Prisma · Postgres · next-auth · Jest · Playwright · Lighthouse · Vercel

## Contributing

Feel free to submit issues and enhancement requests!
