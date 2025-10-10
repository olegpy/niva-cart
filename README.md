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
- **Testing**: Jest and React Testing Library
- **Code Quality**: ESLint, Prettier
- **Performance**: Implemented image optimization, lazy loading, and code splitting

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

# Run tests
npm test
```

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
