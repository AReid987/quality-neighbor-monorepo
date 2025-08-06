# Supabase Setup for Quality Neighbor

## Current Status
- ✅ Supabase CLI installed (v2.26.9)
- ✅ Project initialized locally
- 🔄 Need to link to existing AIGENCY project

## Steps to Complete Setup

### 1. Login to Supabase CLI
```bash
supabase login
```
This will open a browser to authenticate with your Supabase account.

### 2. List Your Projects
```bash
supabase projects list
```
This will show all projects you have access to, including AIGENCY org projects.

### 3. Link to Your Project
```bash
cd apps/qn-platform
supabase link --project-ref YOUR_PROJECT_REF
```
Replace `YOUR_PROJECT_REF` with the actual project reference from step 2.

### 4. Set Up Environment Variables
After linking, get your project details:
```bash
supabase status
```

Then create `.env.local` in `apps/qn-platform/`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 5. Apply Database Schema
```bash
supabase db push
```
This will apply our QN database schema to your remote project.

### 6. Test Authentication
```bash
cd apps/qn-platform
npm run dev
```
Then test the signup/login flow on the landing page.

## Database Schema Ready
Our schema includes:
- `qn_users` table for residents and business owners
- `qn_businesses` table for business profiles
- `qn_service_listings` table for resident exchanges
- Proper relationships and constraints

## Next Steps After Setup
1. Test user registration
2. Verify database records
3. Continue with Epic 1 implementation