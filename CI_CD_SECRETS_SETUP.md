# 🔐 CI/CD Secrets Configuration Guide

## Required GitHub Secrets Setup

To enable the full CI/CD pipeline, configure these secrets in your GitHub repository:

**Repository Settings → Secrets and variables → Actions → New repository secret**

### 🚀 Vercel Deployment Secrets

```bash
# Get these from Vercel Dashboard → Settings → Tokens
VERCEL_TOKEN=your_vercel_token_here

# Get from Vercel Dashboard → Settings → General
VERCEL_ORG_ID=your_vercel_org_id_here

# Create separate Vercel projects for each app, then get project IDs
VERCEL_PROJECT_ID_QN_PLATFORM=qn_platform_project_id
VERCEL_PROJECT_ID_QN_DASHBOARD=qn_dashboard_project_id  
VERCEL_PROJECT_ID_QN_BUSINESS=qn_business_project_id
```

### 🗄️ Supabase Database Secrets

```bash
# Production Supabase project
SUPABASE_ACCESS_TOKEN=your_supabase_access_token
SUPABASE_PROJECT_REF=vezfdsbhmfydqlhgyqul

# Staging Supabase project (optional - can use same as prod for now)
SUPABASE_ACCESS_TOKEN_STAGING=your_staging_token
SUPABASE_PROJECT_REF_STAGING=your_staging_project_ref
```

### 🔒 Security Scanning Secrets

```bash
# Snyk security scanning (sign up at snyk.io)
SNYK_TOKEN=your_snyk_token

# Codecov for test coverage (sign up at codecov.io)
CODECOV_TOKEN=your_codecov_token
```

### 📢 Notification Secrets

```bash
# Slack webhook for notifications
SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK

# Email notifications
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
RELEASE_NOTIFICATION_EMAIL=team@qualityneighbor.com
```

### ⚡ Performance & Optimization (Optional)

```bash
# Turborepo Remote Caching (optional)
TURBO_TOKEN=your_turbo_token
TURBO_TEAM=your_turbo_team
```

## 🛠️ Setup Instructions

### 1. Vercel Setup
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create projects for each app:
   - Import from GitHub: `apps/qn-platform`
   - Import from GitHub: `apps/qn-dashboard` 
   - Import from GitHub: `apps/qn-business`
3. Get tokens from Settings → Tokens
4. Get Org ID from Settings → General

### 2. Supabase Setup
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Your project: `vezfdsbhmfydqlhgyqul` (already configured)
3. Get access token from Account → Access Tokens
4. Project ref is already: `vezfdsbhmfydqlhgyqul`

### 3. Security Tools Setup
1. **Snyk**: Sign up at [snyk.io](https://snyk.io), get API token
2. **Codecov**: Sign up at [codecov.io](https://codecov.io), get upload token

### 4. Slack Notifications (Optional)
1. Create Slack app in your workspace
2. Add incoming webhook
3. Create channels: `#quality-neighbor-deployments`, `#quality-neighbor-alerts`

## 🧪 Testing the Pipeline

Once secrets are configured, test the pipeline:

### 1. Create a Test Branch
```bash
git checkout -b test/ci-cd-pipeline
echo "# Test CI/CD" >> TEST_CICD.md
git add TEST_CICD.md
git commit -m "test: trigger CI/CD pipeline"
git push origin test/ci-cd-pipeline
```

### 2. Create Pull Request
- Go to GitHub → Pull Requests → New
- This will trigger the staging deployment workflow
- Check Actions tab to monitor progress

### 3. Merge to Main
- Once PR tests pass, merge to main
- This will trigger production deployment
- Monitor in Actions tab

## 🔍 Monitoring & Troubleshooting

### Check Workflow Status
- GitHub → Actions tab
- Click on workflow runs to see details
- Check logs for any failures

### Common Issues
1. **Vercel deployment fails**: Check project IDs and tokens
2. **Supabase migration fails**: Verify access token and project ref
3. **Security scans fail**: Check Snyk token validity
4. **Notifications not working**: Verify webhook URLs

### Debugging Commands
```bash
# Test Vercel deployment locally
npx vercel --token YOUR_TOKEN

# Test Supabase connection
npx supabase projects list --token YOUR_TOKEN

# Test build locally
pnpm turbo run build
```

## ✅ Verification Checklist

- [ ] All secrets added to GitHub repository
- [ ] Vercel projects created and linked
- [ ] Supabase access token working
- [ ] Test PR created and pipeline runs
- [ ] Staging deployment successful
- [ ] Production deployment successful
- [ ] Notifications working (if configured)

## 🚀 Ready for Development

Once all secrets are configured and tested:
1. ✅ CI/CD pipeline fully operational
2. ✅ Automated testing and deployment
3. ✅ Security scanning enabled
4. ✅ Performance monitoring active
5. 🎯 **Ready to start Epic 2 development!**

---

**Next**: Configure these secrets, then we'll begin Epic 2: Resident-to-Resident Exchange implementation!