# Supabase Setup Guide

This guide will walk you through setting up Supabase for your QN monorepo with Auth0 integration.

## Prerequisites

- ✅ Auth package integration complete
- ✅ Database utilities configured
- ✅ Migration files ready
- 🔄 Supabase project (to be created)
- 🔄 Environment variables (to be configured)

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login to your account
3. Click "New Project"
4. Fill in project details:
   - **Organization**: Select or create your organization
   - **Project Name**: `quality-neighbor-monorepo`
   - **Database Password**: Generate a secure password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Start with Free tier
5. Click "Create new project"
6. Wait for project to be provisioned (2-3 minutes)

## Step 2: Get Your Supabase Credentials

Once your project is ready:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **URL**: Your project URL
   - **anon public**: Your anonymous/public key
   - **service_role**: Your service role key (keep this secret!)

## Step 3: Configure Environment Variables

### For Development (.env.local)

Create or update `apps/qn-dashboard/.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Auth0 Configuration (if not already set)
AUTH0_DOMAIN=your_auth0_domain
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
AUTH0_BASE_URL=http://localhost:3002
AUTH0_SECRET=your_auth0_secret
AUTH0_AUDIENCE=your_auth0_audience

# Next.js Auth0 Configuration
NEXT_PUBLIC_AUTH0_DOMAIN=your_auth0_domain
NEXT_PUBLIC_AUTH0_CLIENT_ID=your_auth0_client_id
NEXT_PUBLIC_AUTH0_AUDIENCE=your_auth0_audience
```

### For Production

Add the same variables to your production environment (Vercel, Netlify, etc.).

## Step 4: Run Database Migrations

Navigate to the database package and run migrations:

```bash
cd packages/database
npm run migrate
```

This will:
- Create all necessary tables
- Set up indexes
- Configure Row Level Security (RLS)
- Create triggers for updated_at columns
- Set up the meta schema for migrations tracking

## Step 5: Verify Database Setup

### Check Tables in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Table Editor**
3. Verify these tables exist:
   - `qn_users`
   - `qn_businesses`
   - `qn_advertisements`
   - `rltr_mktg_agents`
   - `rltr_mktg_listings`
   - `rltr_mktg_content_pieces`
   - And all other tables from the schema

### Test Database Connection

```bash
cd apps/qn-dashboard
npx tsx -e "
import { db } from './lib/database.ts';
console.log('Testing database connection...');
db.from('qn_users').select('count').then(result => {
  console.log('✅ Database connection successful');
  console.log('Users count:', result);
}).catch(err => {
  console.error('❌ Database connection failed:', err);
});
"
```

## Step 6: Configure Auth0 Integration

### Update Auth0 Settings

1. Go to your Auth0 dashboard
2. Navigate to **Applications** → Your App
3. Update **Allowed Callback URLs**:
   ```
   http://localhost:3002/api/auth/callback
   https://your-domain.com/api/auth/callback
   ```
4. Update **Allowed Logout URLs**:
   ```
   http://localhost:3002
   https://your-domain.com
   ```

### Set Up Auth0 Actions (Optional)

Create an Auth0 Action to sync users with Supabase:

1. Go to **Actions** → **Flows** → **Login**
2. Click **Custom** → **Build Custom**
3. Create action with this code:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://your-app.com/';
  
  // Set custom claims
  api.idToken.setCustomClaim(`${namespace}roles`, event.user.app_metadata?.roles || []);
  api.idToken.setCustomClaim(`${namespace}projects`, event.user.app_metadata?.projects || []);
  
  // Sync with Supabase (optional)
  // You can add API call here to sync user data
};
```

## Step 7: Test the Integration

### Test Auth Package

```bash
cd packages/auth
npm run type-check
```

### Test Database Utilities

```bash
cd apps/qn-dashboard
npx tsx -e "
import { dbUtils } from './lib/database.ts';
import { ProjectNamespace } from '@qn/auth';

const testUser = {
  sub: 'auth0|test123',
  email: 'test@example.com',
  name: 'Test User',
  given_name: 'Test',
  family_name: 'User'
};

dbUtils.syncAuth0User(testUser, ProjectNamespace.QN)
  .then(() => console.log('✅ User sync successful'))
  .catch(err => console.error('❌ User sync failed:', err));
"
```

### Test API Routes

Start your development server:

```bash
npm run dev
```

Test authentication:
1. Go to `http://localhost:3002`
2. Try logging in with Auth0
3. Check if user data is synced to Supabase

## Step 8: Set Up Development Workflow

### Package Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "db:migrate": "cd packages/database && npm run migrate",
    "db:reset": "cd packages/database && npm run reset",
    "db:seed": "cd packages/database && npm run seed",
    "auth:test": "cd packages/auth && npm run type-check"
  }
}
```

### Development Commands

```bash
# Run migrations
npm run db:migrate

# Reset database (development only!)
npm run db:reset

# Seed database with test data
npm run db:seed

# Test auth package
npm run auth:test
```

## Step 9: Row Level Security (RLS) Setup

The initial schema includes basic RLS policies. To enhance security:

### Update RLS Policies

1. Go to **Authentication** → **Policies** in Supabase
2. Review and update policies based on your requirements
3. Test policies with different user roles

### Example: Enhanced QN Users Policy

```sql
-- Allow users to view their own data
CREATE POLICY "Users can view their own data" ON public.qn_users
    FOR SELECT USING (
        auth.jwt() ->> 'sub' = user_id::text
        OR auth.jwt() ->> 'https://your-app.com/roles' ? 'qn:internal_admin'
    );
```

## Step 10: Production Deployment

### Environment Variables

Set up production environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
```

### Database Migrations

Run migrations in production:

```bash
# Set production environment variables first
npm run db:migrate
```

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Check that all environment variables are set
   - Restart your development server after adding variables

2. **"Failed to get Auth0 management token"**
   - Verify Auth0 credentials are correct
   - Check Auth0 API permissions

3. **"Database connection failed"**
   - Verify Supabase URL and keys
   - Check if your IP is whitelisted (if using restrictions)

4. **"Migration failed"**
   - Check database logs in Supabase dashboard
   - Verify service role key has sufficient permissions

### Debug Database Connection

```bash
cd apps/qn-dashboard
npx tsx -e "
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

supabase.from('qn_users').select('count').then(result => {
  console.log('Connection successful:', result);
}).catch(err => {
  console.error('Connection failed:', err);
});
"
```

### Check Migration Status

```bash
cd packages/database
npx tsx -e "
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

supabase.from('meta.migrations').select('*').then(result => {
  console.log('Applied migrations:', result.data);
}).catch(err => {
  console.error('Error checking migrations:', err);
});
"
```

## Next Steps

After completing this setup:

1. **Generate TypeScript Types**: Use Supabase CLI to generate types
2. **Set Up Realtime**: Configure realtime subscriptions if needed
3. **Add Seeding**: Create seed data for development
4. **Set Up Monitoring**: Configure logging and monitoring
5. **Add Backups**: Set up automated backups
6. **Performance**: Add database indexes as needed

## Support

If you encounter issues:

1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Review [Auth0 Documentation](https://auth0.com/docs)
3. Check project logs in both Supabase and Auth0 dashboards
4. Test individual components (auth, database, API) separately

---

**Status**: 🚀 Ready for Supabase setup!