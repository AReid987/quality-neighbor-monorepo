# QN Dashboard Deployment Guide

This guide explains how to deploy the `qn-dashboard` project to Vercel.

## Overview

The `qn-dashboard` is a Next.js application configured for static export that gets deployed to Vercel under the `aigency0` organization. The deployment process involves building the application and deploying the static files to Vercel.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [pnpm](https://pnpm.io/) package manager
- [Vercel CLI](https://vercel.com/cli) installed globally
- Access to the `aigency0` Vercel organization

## Quick Start

### Automated Deployment (Recommended)

Use the provided deployment script:

```bash
# From the root of the monorepo
pnpm run deploy:dashboard
```

Or run the script directly:

```bash
./scripts/deploy-dashboard.sh
```

### Manual Deployment

If you prefer to deploy manually:

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Build the dashboard**:
   ```bash
   pnpm build --filter=@qn/dashboard
   ```

3. **Prepare deployment directory**:
   ```bash
   rm -rf qn-dashboard-static
   mkdir -p qn-dashboard-static
   cp -r apps/qn-dashboard/out/* qn-dashboard-static/
   ```

4. **Create vercel.json** (if not exists):
   ```bash
   cat > qn-dashboard-static/vercel.json << 'EOF'
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   EOF
   ```

5. **Deploy to Vercel**:
   ```bash
   cd qn-dashboard-static
   vercel --scope=aigency0 --prod --yes
   ```

## Project Structure

```
qn-monorepo/
├── apps/
│   └── qn-dashboard/           # Next.js dashboard application
│       ├── app/                # Next.js app router pages
│       ├── components/         # React components
│       ├── out/               # Built static files (generated)
│       ├── next.config.js     # Next.js configuration
│       └── package.json       # Dashboard dependencies
├── qn-dashboard-static/       # Deployment directory (generated)
├── scripts/
│   └── deploy-dashboard.sh    # Automated deployment script
└── package.json               # Root package.json with deploy script
```

## Deployment URLs

- **Production**: https://qn-dashboard.vercel.app
- **Vercel Project**: https://vercel.com/aigency0/qn-dashboard-static

## Configuration

### Next.js Configuration

The dashboard is configured for static export in `apps/qn-dashboard/next.config.js`:

```javascript
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};
```

### Vercel Configuration

The deployment uses a simple `vercel.json` configuration for SPA routing:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Ensure all dependencies are installed: `pnpm install`
   - Check for TypeScript errors: `pnpm run check-types`
   - Verify workspace dependencies are properly linked

2. **Deployment Failures**:
   - Ensure you're logged into Vercel CLI: `vercel login`
   - Verify access to `aigency0` organization: `vercel teams list`
   - Check if the build output directory exists: `ls -la apps/qn-dashboard/out/`

3. **Permission Issues**:
   - Make sure the deployment script is executable: `chmod +x scripts/deploy-dashboard.sh`
   - Verify Vercel CLI has proper permissions for the organization

### Logs and Debugging

- **View deployment logs**: `vercel logs <deployment-url>`
- **Check build output**: Inspect the `apps/qn-dashboard/out/` directory
- **Debug locally**: Run `pnpm dev` from the dashboard directory

## CI/CD Integration

For automated deployments, you can integrate the deployment script into your CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Deploy Dashboard
  run: |
    npm install -g vercel
    vercel login --token ${{ secrets.VERCEL_TOKEN }}
    ./scripts/deploy-dashboard.sh
```

## Environment Variables

The dashboard currently doesn't require any environment variables for deployment. All configuration is handled through the Next.js configuration files.

## Support

If you encounter issues:

1. Check the Vercel dashboard for deployment logs
2. Verify the build process completes successfully locally
3. Ensure all dependencies are properly installed in the monorepo
4. Contact the development team for assistance

---

**Last Updated**: December 2024