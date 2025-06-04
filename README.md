This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## CI/CD with GitHub Actions and Vercel

This project uses GitHub Actions for CI/CD and deploys to Vercel. To set up the required secrets for deployment:

### Getting Vercel Secrets

1. **VERCEL_TOKEN**:
   - Go to your [Vercel account settings](https://vercel.com/account/tokens)
   - Create a new token with an appropriate name (e.g., "GitHub Actions")
   - Copy the generated token

2. **VERCEL_ORG_ID**:
   - Go to your Vercel dashboard
   - Navigate to Settings > General
   - Copy your Organization ID

3. **VERCEL_PROJECT_ID**:
   - Go to your project in Vercel
   - Navigate to Settings > General
   - Copy your Project ID

### Setting up GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click on "New repository secret"
4. Add each of the following secrets:
   - Name: `VERCEL_TOKEN`, Value: (paste your token)
   - Name: `VERCEL_ORG_ID`, Value: (paste your org ID)
   - Name: `VERCEL_PROJECT_ID`, Value: (paste your project ID)

Once these secrets are set up, the GitHub Actions workflow will be able to deploy your application to Vercel automatically when changes are pushed to the main branch.
