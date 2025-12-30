# Staging Environment Setup

This guide explains how to set up and manage a staging environment for the Vilanow platform.

---

## Overview

A staging environment is a near-production copy of your application used for:
- Testing new features before production
- QA and user acceptance testing
- Performance testing
- Security testing
- Client demonstrations

---

## Architecture

### Recommended Setup

```
Production
├── Supabase Project: vilanow-prod
├── Vercel Project: vilanow-prod
└── Domain: app.vilanow.com

Staging
├── Supabase Project: vilanow-staging
├── Vercel Project: vilanow-staging
└── Domain: staging.vilanow.com
```

---

## Step 1: Create Staging Supabase Project

### 1.1 Create New Project

1. Go to https://supabase.com
2. Click **New Project**
3. Name: `vilanow-staging`
4. Database Password: Choose strong password
5. Region: Same as production (for consistency)
6. Wait for project creation

### 1.2 Apply Schema

1. Copy `database/schema.sql`
2. Paste into staging project SQL Editor
3. Run the schema
4. Verify all tables created

### 1.3 Seed Data (Optional)

1. Copy `database/seed.sql`
2. Paste into staging SQL Editor
3. Run the seed script
4. Add test data as needed

### 1.4 Enable Realtime

1. Copy `database/enable_realtime.sql`
2. Paste into staging SQL Editor
3. Run the script

### 1.5 Get Credentials

Copy from **Settings** → **API**:
- Project URL
- Anon Key
- Service Role Key

---

## Step 2: Set Up Staging Vercel Project

### 2.1 Create New Project

```bash
# Clone repository
git clone your-repo-url
cd vilanow

# Create staging branch
git checkout -b staging

# Install dependencies
npm install
```

### 2.2 Configure Environment Variables

In Vercel Dashboard → **Settings** → **Environment Variables**:

```env
# Environment
NODE_ENV=staging

# Supabase (Staging)
USE_SUPABASE=true
SUPABASE_URL=https://vilanow-staging.supabase.co
SUPABASE_ANON_KEY=staging-anon-key
SUPABASE_SERVICE_KEY=staging-service-key

# JWT
JWT_SECRET=staging-jwt-secret-different-from-prod

# CORS
CORS_ORIGIN=https://staging.vilanow.com

# Feature Flags
ENABLE_REAL_TIME=true
```

**⚠️ Important**: Use different secrets than production!

### 2.3 Deploy to Vercel

```bash
# Link to staging project
vercel link --project vilanow-staging

# Deploy to staging
vercel --target staging

# Or deploy from staging branch
git push origin staging
# Vercel will auto-deploy
```

---

## Step 3: Configure Custom Domain (Optional)

### 3.1 Add Domain in Vercel

1. Go to **Settings** → **Domains**
2. Add `staging.vilanow.com`
3. Follow DNS configuration instructions

### 3.2 Update CORS

Update `CORS_ORIGIN` environment variable:
```env
CORS_ORIGIN=https://staging.vilanow.com
```

---

## Step 4: Data Management

### 4.1 Initial Data

**Option 1: Fresh Start**
- Start with empty database
- Use seed script for default data
- Create test users manually

**Option 2: Production Copy**
- Copy production database to staging
- Sanitize sensitive data
- Reset user passwords

### 4.2 Test Data

Create test users:
```sql
-- Test Admin
INSERT INTO users (email, password_hash, name, phone, role)
VALUES ('admin@staging.test', 'hashed_password', 'Test Admin', '+1234567890', 'admin');

-- Test Agent
INSERT INTO users (email, password_hash, name, phone, role, agent_type)
VALUES ('agent@staging.test', 'hashed_password', 'Test Agent', '+1234567891', 'agent', 'direct');

-- Test Seeker
INSERT INTO users (email, password_hash, name, phone, role)
VALUES ('seeker@staging.test', 'hashed_password', 'Test Seeker', '+1234567892', 'seeker');
```

### 4.3 Data Refresh Strategy

**Daily Refresh** (Recommended for active development):
- Copy production data daily
- Sanitize sensitive information
- Reset test accounts

**On-Demand Refresh**:
- Refresh when needed for testing
- Manual process
- More control over timing

---

## Step 5: Environment-Specific Configuration

### 5.1 Frontend Configuration

Create `src/config/env.ts`:

```typescript
export const config = {
  env: import.meta.env.NODE_ENV || 'development',
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  
  // Feature flags
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableDebug: import.meta.env.NODE_ENV === 'development',
  },
  
  // Staging-specific
  isStaging: import.meta.env.VITE_ENV === 'staging',
  isProduction: import.meta.env.VITE_ENV === 'production',
};
```

### 5.2 API Configuration

Update `api/_lib/config.ts` to handle staging:

```typescript
export const config = {
  env: process.env.NODE_ENV || 'development',
  isStaging: process.env.NODE_ENV === 'staging',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Different JWT secrets per environment
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  
  // Environment-specific settings
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceKey: process.env.SUPABASE_SERVICE_KEY || '',
  },
};
```

---

## Step 6: CI/CD Configuration

### 6.1 GitHub Actions

Create `.github/workflows/staging.yml`:

```yaml
name: Deploy to Staging

on:
  push:
    branches: [staging]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.STAGING_API_URL }}
          VITE_SUPABASE_URL: ${{ secrets.STAGING_SUPABASE_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_STAGING_PROJECT_ID }}
          vercel-args: '--prod'
```

### 6.2 Vercel Configuration

`vercel.json`:

```json
{
  "version": 2,
  "env": {
    "NODE_ENV": "staging"
  },
  "build": {
    "env": {
      "NODE_ENV": "staging"
    }
  }
}
```

---

## Step 7: Testing Checklist

Before promoting to production:

- [ ] All tests pass in staging
- [ ] Database migrations work
- [ ] Authentication works
- [ ] API endpoints respond correctly
- [ ] Real-time features work
- [ ] Payment flows work (test mode)
- [ ] Error handling works
- [ ] Performance is acceptable
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Browser compatibility
- [ ] Security checks pass

---

## Step 8: Monitoring Staging

### 8.1 Set Up Alerts

Configure alerts in Supabase for:
- High error rates
- Slow queries
- Connection pool exhaustion
- Storage limits

### 8.2 Logging

Enable logging for:
- API errors
- Database errors
- Authentication failures
- Performance metrics

---

## Step 9: Access Control

### 9.1 Restrict Access

- Use authentication for staging URL
- Limit to team members only
- Add IP whitelist if needed

### 9.2 Test Accounts

- Create dedicated test accounts
- Use clearly identifiable emails (e.g., `test-agent@staging.vilanow.com`)
- Document test account credentials securely

---

## Best Practices

1. **Keep Staging Updated**
   - Regularly sync with production schema
   - Apply migrations to staging first
   - Test all changes in staging

2. **Data Privacy**
   - Sanitize production data before copying
   - Remove PII (Personally Identifiable Information)
   - Use test data where possible

3. **Documentation**
   - Document staging URL and access
   - Keep test credentials secure
   - Update environment variables list

4. **Regular Maintenance**
   - Clean up test data periodically
   - Monitor staging costs
   - Review staging usage

5. **Security**
   - Use different secrets than production
   - Enable all security features
   - Regular security audits

---

## Troubleshooting

### Issue: Staging database connection fails

**Solution**:
- Verify environment variables are set
- Check Supabase project status
- Verify service role key is correct

### Issue: Staging site shows production data

**Solution**:
- Check environment variables point to staging
- Verify Supabase URLs are different
- Clear browser cache

### Issue: Features not working in staging

**Solution**:
- Check feature flags
- Verify environment-specific config
- Check browser console for errors

---

## Cost Management

### Supabase Free Tier
- Staging can use free tier for small teams
- Separate project = separate quota

### Cost Optimization
- Use smaller instance sizes
- Limit test data volume
- Disable unused features
- Monitor usage regularly

---

## Resources

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Environment Management**: See `.env.example`

---

**Your staging environment is ready! Use it to test all changes before production deployment.**

