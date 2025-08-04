# Database and Authentication Setup Guide

This guide walks you through setting up Supabase (database) and Auth0 (authentication) for the QN monorepo project.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Auth0 Setup](#auth0-setup)
4. [Environment Configuration](#environment-configuration)
5. [Database Migration](#database-migration)
6. [Testing the Setup](#testing-the-setup)
7. [Troubleshooting](#troubleshooting)
8. [Development Workflow](#development-workflow)

## Prerequisites

- Node.js 18+ installed
- pnpm package manager
- A Supabase account (free tier available)
- An Auth0 account (free tier available)
- Git and access to this repository

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization (or create one)
4. Fill in project details:
   - **Name**: `qn-monorepo` (or your preferred name)
   - **Database Password**: Use a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free (for development)
5. Click "Create new project"
6. Wait for the project to be created (2-3 minutes)

### 2. Get Supabase Credentials

Once your project is ready:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **URL**: `https://your-project-ref.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role secret key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

⚠️ **Important**: Keep the service_role key secret! Never expose it in client-side code.

### 3. Configure Supabase Settings

1. **Authentication Settings**:
   - Go to **Authentication** → **Settings**
   - Set **Site URL** to: `http://localhost:3001` (for development)
   - Add **Redirect URLs**: `http://localhost:3001/api/auth/callback`

2. **Database Settings**:
   - Go to **Settings** → **Database**
   - Note the **Connection string** (you might need this later)

## Auth0 Setup

### 1. Create Auth0 Application

1. Go to [https://auth0.com/dashboard](https://auth0.com/dashboard)
2. Click "Create Application"
3. Choose:
   - **Name**: `QN Dashboard`
   - **Type**: Single Page Applications
4. Click "Create"

### 2. Configure Auth0 Application

1. In your application settings, configure:

   **Basic Information**:
   - **Domain**: `your-tenant.auth0.com`
   - **Client ID**: Copy this value
   - **Client Secret**: Copy this value

   **Application URIs**:
   - **Allowed Callback URLs**: `http://localhost:3001/api/auth/callback`
   - **Allowed Logout URLs**: `http://localhost:3001`
   - **Allowed Web Origins**: `http://localhost:3001`

2. **Advanced Settings**:
   - Go to **Advanced Settings** → **Grant Types**
   - Ensure these are enabled:
     - ✅ Authorization Code
     - ✅ Refresh Token
     - ✅ Client Credentials

### 3. Configure Auth0 API

1. Go to **Applications** → **APIs**
2. Click "Create API"
3. Fill in:
   - **Name**: `QN API`
   - **Identifier**: `https://your-tenant.auth0.com/api/v2/`
   - **Signing Algorithm**: RS256
4. Click "Create"

### 4. Set Up Auth0 Rules (Optional)

For advanced user management, you can create Auth0 Rules:

1. Go to **Auth Pipeline** → **Rules**
2. Click "Create Rule"
3. Choose "Empty Rule"
4. Use this example rule to add user metadata:

```javascript
function addUserMetadata(user, context, callback) {
  const namespace = 'https://qn-app.com/';
  
  // Add default project based on email domain
  let defaultProject = 'qn';
  if (user.email && user.email.includes('realestate')) {
    defaultProject = 'rltr_mktg';
  }
  
  // Add user metadata to token
  context.idToken[namespace + 'projects'] = user.app_metadata?.projects || [defaultProject];
  context.idToken[namespace + 'roles'] = user.app_metadata?.roles || ['user'];
  
  callback(null, user, context);
}
```

## Environment Configuration

### 1. Create Environment Files

Copy the example environment files:

```bash
# Root environment
cp .env.example .env.local

# Dashboard environment
cp apps/qn-dashboard/.env.local.example apps/qn-dashboard/.env.local
```

### 2. Configure Dashboard Environment

Edit `apps/qn-dashboard/.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Auth0 Configuration
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_BASE_URL=http://localhost:3001
AUTH0_SECRET=your-generated-secret-key
AUTH0_AUDIENCE=https://your-tenant.auth0.com/api/v2/

# Next.js Configuration
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3001

# Feature Flags
NEXT_PUBLIC_ENABLE_RLTR_FEATURES=true
NEXT_PUBLIC_ENABLE_QN_FEATURES=true
NEXT_PUBLIC_ENABLE_DEV_TOOLS=true
```

### 3. Generate Auth0 Secret

Generate a secure secret for Auth0:

```bash
openssl rand -hex 32
```

Use this value for `AUTH0_SECRET` in your environment file.

## Database Migration

### 1. Install Dependencies

```bash
# Install root dependencies
pnpm install

# Install database package dependencies
pnpm install --filter=@qn/database
```

### 2. Run Database Migration

Apply the initial schema to your Supabase database:

```bash
# From the root directory
cd packages/database

# Create tables and initial data
pnpm run migrate
```

### 3. Verify Database Setup

1. Go to your Supabase dashboard
2. Navigate to **Database** → **Tables**
3. You should see tables like:
   - `qn_users`
   - `qn_businesses`
   - `qn_advertisements`
   - `rltr_mktg_agents`
   - `rltr_mktg_listings`
   - `rltr_mktg_content_pieces`

## Testing the Setup

### 1. Start the Development Server

```bash
# From the root directory
pnpm run dev
```

### 2. Test Database Connection

Create a test API endpoint to verify database connectivity:

```bash
# Create test file
touch apps/qn-dashboard/pages/api/test-db.ts
```

Add this content:

```typescript
import { NextApiRequest, NextApiResponse } from 'next'
import { dbUtils } from '@/lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const qnStats = await dbUtils.getQNDashboardStats()
    const rltrStats = await dbUtils.getRLTRDashboardStats()
    
    res.status(200).json({
      success: true,
      data: {
        qn: qnStats,
        rltr: rltrStats,
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
```

Visit `http://localhost:3001/api/test-db` to test the connection.

### 3. Test Auth0 Integration

1. Navigate to `http://localhost:3001/dashboard`
2. Click "Log In"
3. You should be redirected to Auth0
4. Create an account or log in
5. You should be redirected back to the dashboard

### 4. Test User Synchronization

After logging in:

1. Check the Supabase dashboard
2. Go to **Database** → **Table Editor**
3. Check the `qn_users` or `rltr_mktg_agents` table
4. You should see your user record

## Troubleshooting

### Common Issues

#### 1. "Missing Supabase environment variables"

**Error**: `Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_ANON_KEY`

**Solution**:
- Verify environment variables are set correctly
- Restart the development server
- Check for typos in variable names

#### 2. Auth0 Callback Error

**Error**: `Callback URL mismatch`

**Solution**:
- Verify callback URLs in Auth0 dashboard match your local setup
- Check that `AUTH0_BASE_URL` matches your local server URL
- Ensure you're using the correct port (3001)

#### 3. Database Connection Issues

**Error**: `Failed to connect to database`

**Solution**:
- Check Supabase project is running
- Verify database credentials
- Check network connectivity
- Ensure RLS policies allow your operations

#### 4. Auth0 Domain Issues

**Error**: `Invalid domain`

**Solution**:
- Use the full domain including `.auth0.com`
- Don't include `https://` in the domain
- Check for trailing slashes

### Debugging Steps

1. **Check Environment Variables**:
   ```bash
   # In your terminal
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $AUTH0_DOMAIN
   ```

2. **Check Database Connection**:
   ```bash
   # Test database connection
   curl http://localhost:3001/api/test-db
   ```

3. **Check Auth0 Configuration**:
   - Review Auth0 dashboard settings
   - Verify callback URLs
   - Check application type (SPA)

4. **Check Browser Console**:
   - Open browser dev tools
   - Look for authentication errors
   - Check network requests

## Development Workflow

### 1. Adding New Users

Users are automatically created when they first log in through Auth0. The system will:

1. Create Auth0 user record
2. Sync to appropriate database table (`qn_users` or `rltr_mktg_agents`)
3. Set default project permissions

### 2. Managing User Roles

Update user roles through Auth0:

1. Go to **User Management** → **Users**
2. Select a user
3. Edit **app_metadata**:
   ```json
   {
     "projects": ["qn", "rltr_mktg"],
     "roles": ["qn:resident", "rltr:agent"]
   }
   ```

### 3. Database Changes

When updating the database schema:

1. Create a new migration file in `packages/database/src/migrations/`
2. Run the migration: `pnpm run migrate`
3. Update TypeScript types in `packages/database/src/types.ts`

### 4. Adding New Projects

To add a new project namespace:

1. Add to `ProjectNamespace` enum in `packages/auth/src/auth0.ts`
2. Create corresponding database tables with `project_` prefix
3. Update RLS policies
4. Add project-specific components to dashboard

## Security Considerations

### 1. Environment Variables

- Never commit `.env.local` files
- Use different credentials for each environment
- Rotate secrets regularly

### 2. Row Level Security (RLS)

All database tables have RLS enabled. Users can only access their own data unless they have admin permissions.

### 3. Auth0 Security

- Use strong passwords
- Enable MFA for Auth0 dashboard
- Regularly review user access
- Monitor Auth0 logs for suspicious activity

### 4. API Security

- All API endpoints require authentication
- Use proper error handling
- Validate all inputs
- Implement rate limiting

## Production Deployment

### 1. Environment Variables

Update production environment variables:

```env
# Production Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-prod-service-role-key

# Production Auth0
AUTH0_DOMAIN=your-prod-tenant.auth0.com
AUTH0_BASE_URL=https://your-domain.com
AUTH0_SECRET=your-prod-secret-key

# Production URLs
NEXTAUTH_URL=https://your-domain.com
```

### 2. Auth0 Production Setup

1. Create production Auth0 application
2. Update callback URLs to production domains
3. Configure production API audience

### 3. Supabase Production Setup

1. Create production Supabase project
2. Run migrations on production database
3. Configure production RLS policies
4. Set up database backups

---

**Need Help?**

If you encounter issues not covered in this guide:

1. Check the [Supabase documentation](https://supabase.com/docs)
2. Check the [Auth0 documentation](https://auth0.com/docs)
3. Review the project's GitHub issues
4. Contact the development team

**Last Updated**: December 2024