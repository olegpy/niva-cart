# Niva Cart

## Project Overview

Small storefront built with Next.js (App Router): product listing, product detail, and a client-side cart. Unit tests use Jest; browser flows use Playwright.

## Technical Stack
- **Frontend Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context API
- **API Integration**: RESTful API consumption
- **Deployment**: Vercel with CI/CD pipeline
- **Version Control**: Git with GitHub
- **Testing**: Jest and React Testing Library (unit), Playwright (end-to-end)
- **Code Quality**: ESLint, Prettier
- **Performance**: Implemented image optimization, lazy loading, and code splitting
- **Performance Testing**: Lighthouse CI with 95%+ score requirements

## Key Features & Technical Achievements

### Completed Features
- **Responsive Design**: Fully responsive layout for all device sizes
- **Performance Optimization**: 
  - Dynamic imports for code splitting
  - Optimized images using Next.js Image component
  - Reduced bundle size through code organization
- **State Management**: Robust cart management system using React Context API
- **Type Safety**: Comprehensive TypeScript implementation
- **Modern Architecture**: 
  - App Router for routing and performance
  - Server Components where appropriate
  - Error boundaries and loading states
  - Separated layouts for main store and admin sections
  - Route groups for organized layout management
- **CI/CD Pipeline**: Automated deployment with GitHub Actions and Vercel
- **API Integration**: Consumes Fake Store API for product data
- **Code Quality**: ESLint, Prettier, and thorough testing with Jest/React Testing Library
- **Accessibility**: ARIA labels and semantic HTML
- **Documentation**: Inline code documentation and clear component structure
- **Admin Dashboard**: Complete admin interface with analytics and store management
- **Performance Monitoring**: Automated Lighthouse testing with 95%+ score enforcement

### Future Improvements
- Implement user authentication
- Add payment gateway integration
- Implement product search and filtering
- Add product reviews and ratings
- Implement wishlist functionality
- Implement analytics tracking
- Add real-time features to admin dashboard

## Application Architecture

### Layout Structure
The application uses Next.js App Router with a sophisticated layout system:

- **Root Layout** (`/src/app/layout.tsx`): Provides basic HTML structure and fonts
- **Main Store Layout** (`/src/app/(main)/layout.tsx`): Customer-facing interface with cart functionality and navigation
- **Admin Layout** (`/src/app/admin/layout.tsx`): Separate admin interface with analytics and management tools

### Route Organization
- **Route Groups**: `(main)` folder groups main store pages while keeping clean URLs
- **Main Store Routes**: `/`, `/cart`, `/product/[id]` - all use main layout with cart
- **Admin Routes**: `/admin` - uses separate admin layout without cart functionality

### Key Benefits
- **Complete Separation**: Admin and customer interfaces are completely isolated
- **Clean URLs**: Route groups provide organization without affecting URL structure
- **Layout Inheritance**: Each section has its own optimized layout and functionality

## API Integration
The application integrates with the Fake Store API for demonstration purposes:
https://fakestoreapi.com/products

## Getting Started
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run unit tests
npm test

# E2E tests (Playwright starts the app + mock API; see below)
npm run test:e2e

# Run Lighthouse performance check
npm run lighthouse:full
```

## End-to-end tests (Playwright)

Tests are under `e2e/`. They open the real UI (home, cart, etc.) in a browser.

Products are fetched during SSR, so stubbing the API only in the browser isn’t enough. When you run `npm run test:e2e`, Playwright starts `e2e/run-dev-with-mock.mjs`: a small mock serves `e2e/fixtures/mock-products.json` at `/products` and `/products/:id`, and Next dev listens on port 3100 with `NEXT_PUBLIC_API_BASE_URL` pointed at that mock. You normally don’t start the mock yourself.

Ports 4000 (mock) and 3100 (app) are the defaults. If something else is bound there, use `npm run test:e2e:alt` (uses 4001 and 3110), or set `MOCK_API_PORT` / `E2E_APP_PORT` — `playwright.config.ts` forwards them to `run-dev-with-mock.mjs`.

If E2E fails with “another dev server is already running,” stop your regular `npm run dev` first; Next 16 expects a single `next dev` per repo. If Playwright says the browser is missing, run `npm run test:e2e:install` once (or after upgrading `@playwright/test`).

CI runs this via `.github/workflows/playwright.yml` with `playwright install --with-deps`. Jest does not run files in `e2e/`, so `npm test` stays unit-only.

```bash
npm run test:e2e              # headless
npm run test:e2e:alt          # alternate ports if 3100/4000 are taken
npm run test:e2e:ui           # UI mode
npm run test:e2e:headed
npm run test:e2e:install      # Chromium (local)
npm run test:e2e:install:ci     # Chromium + OS deps (closer to CI)
```

## Performance Testing with Lighthouse

This project includes comprehensive performance testing using Google Lighthouse to ensure optimal user experience and Core Web Vitals compliance.

### Lighthouse Setup
- **Automated Testing**: Full CI/CD integration with score validation
- **Score Requirements**: All categories must score 95% or higher
- **Mobile-First**: Tests on mobile devices (375x667) with 3G simulation
- **Categories Tested**: Performance, Accessibility, Best Practices, SEO

### Available Commands
```bash
# Complete automated check (recommended)
npm run lighthouse:full

# Generate HTML report
npm run lighthouse

# Generate JSON report for CI
npm run lighthouse:ci

# Check scores against 95% threshold
npm run lighthouse:check
```

### Current Performance Scores
- **Performance**: 100/100 🏆
- **Accessibility**: 98/100 🏆
- **Best Practices**: 96/100 🏆
- **SEO**: 100/100 🏆

### Performance Features
- **Image Optimization**: Next.js Image component with automatic optimization
- **Code Splitting**: Dynamic imports and automatic bundle splitting
- **Lazy Loading**: Images and components loaded on demand
- **Caching**: Optimized caching strategies for static assets
- **Bundle Size**: Minimized JavaScript and CSS bundles

### CI/CD Integration
The Lighthouse tests are integrated into the CI/CD pipeline to ensure performance standards are maintained:
- Automated testing on every build
- Score validation prevents deployment if scores drop below 95%
- Performance regression detection
- Detailed reporting for optimization insights

For detailed Lighthouse setup instructions, see [LIGHTHOUSE_SETUP.md](./LIGHTHOUSE_SETUP.md).

## Development Practices
- **Code Organization**: Modular architecture with clear separation of concerns
- **Component Design**: Reusable components with proper prop typing
- **Error Handling**: Comprehensive error handling and user feedback
- **Accessibility**: Implemented ARIA labels and semantic HTML
- **Documentation**: Inline code documentation and clear component structure

## Deployment
The application is deployed on Vercel with automated CI/CD pipeline. The deployment process includes:
- Automated testing
- Build verification
- Production deployment
- Environment variable management

### CI/CD Setup
The project uses GitHub Actions for CI/CD and deploys to Vercel. Required secrets for deployment:

1. **VERCEL_TOKEN**: Authentication token for Vercel API
2. **VERCEL_ORG_ID**: Organization identifier
3. **VERCEL_PROJECT_ID**: Project identifier

For detailed setup instructions, refer to the [Vercel Deployment Documentation](https://vercel.com/docs).

## Admin authentication

Admin login uses **next-auth v4** with **Credentials** (email + password). Only users with `role: admin` and a `passwordHash` in the database can sign in. Customer accounts have no password.

### Demo admin login

This project is a demo — the seeded admin credentials are intentional:

| | |
|---|---|
| **URL** | `/admin/login` |
| **Email** | `admin@niva-cart.local` |
| **Password** | `admin123` |

Works after `npm run db:seed` (local, preview, or prod). Same seed on every environment.

### Local setup

Add to `.env` (see `.env.example`):

```bash
DATABASE_URL=postgresql://niva:niva@localhost:5432/niva_cart
NEXTAUTH_SECRET=...          # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
```

Seed the dev admin user:

```bash
npm run db:seed
```

See **Demo admin login** above for credentials.

### Vercel environment variables

| Variable | Production | Preview | Notes |
|----------|------------|---------|-------|
| `NEXTAUTH_SECRET` | ✅ | ✅ | Required. Same name exactly — not `NEXT_AUTH_SECRET`. |
| `NEXTAUTH_URL` | ✅ | ❌ | Production: `https://your-prod-domain.vercel.app`. Preview uses `VERCEL_URL` automatically. |
| `DATABASE_URL` | ✅ | ✅ | See Supabase notes below. |

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


## Contributing
Feel free to submit issues and enhancement requests!
