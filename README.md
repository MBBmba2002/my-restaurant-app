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

## Deployment

### GitHub Pages

This project is configured for GitHub Pages deployment at the path `/my-restaurant-app`.

#### Online Routes

When deployed to GitHub Pages, access routes with the base path and trailing slash:

- **Homepage**: `https://[你的GitHub用户名].github.io/my-restaurant-app/`
- **Login Page**: `https://[你的GitHub用户名].github.io/my-restaurant-app/login/` ⚠️ **Note: URL must end with `/`**
- **Test Page**: `https://[你的GitHub用户名].github.io/my-restaurant-app/test/`

#### Important Notes

1. **Trailing Slash Required**: All routes must end with `/` when accessing via GitHub Pages
   - ✅ Correct: `/my-restaurant-app/login/`
   - ❌ Wrong: `/my-restaurant-app/login`

2. **Build Output**: Static files are exported to the `out/` directory after running `npm run build`

3. **Auto Deployment**: Pushing to the `main` branch triggers automatic deployment via GitHub Actions

### Local Development

Local development runs at `http://localhost:3000` without the base path prefix.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
