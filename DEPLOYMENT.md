# Vilanow Platform Deployment Guide

## Vercel Deployment

### Prerequisites
- Vercel account (sign up at https://vercel.com)
- Vercel CLI installed: `npm i -g vercel`
- Git repository set up

### Quick Deploy

1. **Install dependencies:**
```bash
npm install
```

2. **Build the project:**
```bash
npm run build
```

3. **Deploy to Vercel:**
```bash
vercel
```

Follow the prompts:
- Link to existing project or create new
- Set project name
- Confirm settings

4. **Deploy to production:**
```bash
vercel --prod
```

### Environment Variables

Set these in Vercel dashboard under Project Settings > Environment Variables:

**For current implementation (in-memory store):**
```env
# Optional - no env vars needed for basic setup
```

**For Supabase (when ready):**
```env
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key
USE_SUPABASE=true
JWT_SECRET=your-jwt-secret-key
```

### Project Configuration

The `vercel.json` file is already configured with:
- Build command: `npm run build`
- Output directory: `dist`
- API routes rewrites
- Edge runtime for API functions

### API Routes

All API routes are in `/api` directory and will be automatically deployed as serverless functions.

Available endpoints:
- `/api/health` - Health check
- `/api/auth/*` - Authentication endpoints
- `/api/users/*` - User management
- `/api/properties/*` - Property CRUD
- `/api/interests/*` - Interest management
- `/api/chats/*` - Chat functionality
- `/api/credits/*` - Credits and transactions
- `/api/kyc/*` - KYC submission
- `/api/watchlist/*` - Watchlist management
- `/api/search` - Search functionality
- `/api/property-requests/*` - Property requests

### Testing Deployment

1. **Test health endpoint:**
```bash
curl https://your-app.vercel.app/api/health
```

2. **Test API registration:**
```bash
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "phone": "+1234567890",
    "role": "seeker"
  }'
```

### Local Development

1. **Run development server:**
```bash
npm run dev
```

2. **API will be available at:**
- Frontend: `http://localhost:5173`
- API: `http://localhost:5173/api/*`

### Troubleshooting

**API routes not working:**
- Ensure `vercel.json` is in root directory
- Check that API files export `config` with `runtime: 'edge'`
- Verify file structure matches Vercel's expectations

**CORS errors:**
- CORS headers are already included in response utils
- Check if requests include proper headers

**Environment variables:**
- Ensure variables are set in Vercel dashboard
- Redeploy after adding new variables
- Use Vercel CLI to set: `vercel env add VARIABLE_NAME`

### Production Checklist

- [ ] Set all environment variables
- [ ] Configure custom domain (optional)
- [ ] Enable Vercel Analytics
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure API rate limiting
- [ ] Set up database (Supabase when ready)
- [ ] Configure authentication (Supabase Auth when ready)
- [ ] Test all API endpoints
- [ ] Set up CI/CD pipeline
- [ ] Configure backup strategy

### Migration to Supabase

When ready to use Supabase:
1. Follow `SUPABASE_MIGRATION.md`
2. Create database schema
3. Update environment variables
4. Deploy updated code
5. Migrate existing data (if any)

### Support

For issues:
- Check Vercel logs in dashboard
- Review API route logs
- Test endpoints with curl/Postman
- Check browser console for frontend errors

