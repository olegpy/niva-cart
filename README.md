# Niva Cart

## Project Overview
A modern e-commerce application built with Next.js 15, showcasing frontend development practices and real-world implementation of e-commerce features. This project demonstrates expertise in building scalable, performant web applications with a focus on user experience and code quality.

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

Specs are in `e2e/`. They hit the real Next app (catalog, cart, etc.).

The product list and detail pages fetch data during SSR. That happens on the server, not in the browser, so Playwright can’t fake the API with `page.route` alone. Instead, `playwright.config.ts` runs `e2e/run-dev-with-mock.mjs` before tests: it brings up `mock-api-server.mjs` (serves `fixtures/mock-products.json` on `/api/v1/...`) and `npm run dev` on port 3100 with `NEXT_PUBLIC_API_BASE_URL` aimed at that server. You don’t need to start the mock yourself for `npm run test:e2e`.

```bash
npm run test:e2e              # headless, usual run
npm run test:e2e:ui           # interactive runner
npm run test:e2e:headed       # watch the browser
npm run test:e2e:install      # download Chromium (first clone or after bumping @playwright/test)
npm run test:e2e:install:ci   # Chromium + OS deps; GitHub Actions uses the same idea
```

If Playwright complains the browser binary is missing, run `test:e2e:install` once.

CI: `.github/workflows/playwright.yml` runs `npx playwright test` after installing browsers with `--with-deps`.

Jest ignores `e2e/`, so `npm test` won’t try to execute Playwright files.

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


## Contributing
Feel free to submit issues and enhancement requests!
