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
- **Responsive Design**: Implemented a fully responsive layout that works seamlessly across all device sizes
- **Performance Optimization**: 
  - Implemented dynamic imports for code splitting
  - Optimized images using Next.js Image component
  - Reduced bundle size through proper code organization
- **State Management**: Built a robust cart management system using React Context API
- **Type Safety**: Comprehensive TypeScript implementation ensuring type safety across the application
- **Modern Architecture**: 
  - Implemented App Router for better routing and performance
  - Used Server Components where appropriate
  - Implemented proper error boundaries and loading states
- **CI/CD Pipeline**: Set up automated deployment pipeline using GitHub Actions and Vercel

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

## Future Improvements
- Implement user authentication
- Add payment gateway integration
- Implement product search and filtering
- Add product reviews and ratings
- Implement wishlist functionality
- Add admin dashboard
- Implement analytics tracking

## Contributing
Feel free to submit issues and enhancement requests!
