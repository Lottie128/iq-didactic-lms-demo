# 🚀 IQ Didactic LMS - Production Deployment Guide

## Overview

This guide covers production deployment for:
- **Backend**: Railway or Render (with PostgreSQL)
- **Frontend**: Vercel or Netlify
- **Database**: PostgreSQL (managed service)

---

## 📋 Pre-Deployment Checklist

### Before You Start
- [ ] All tests passing locally
- [ ] Pull request reviewed and approved
- [ ] Branch merged to `main`
- [ ] Database backup created
- [ ] Strong JWT secret generated
- [ ] Production URLs decided

---

## 🔐 Step 1: Generate Secrets

### JWT Secret

**Option 1: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Option 2: Using OpenSSL**
```bash
openssl rand -hex 64
```

**Option 3: Online Generator**
- Visit: https://generate-secret.vercel.app/64
- Copy the generated secret

**Save this secret** - you'll need it for backend deployment!

---

## 🗄️ Step 2: Database Setup

### Option A: Railway PostgreSQL

1. **Create New Project** on Railway
2. **Add PostgreSQL** from template
3. **Copy Database URL**:
   - Go to PostgreSQL service
   - Click "Connect"
   - Copy `DATABASE_URL` (starts with `postgresql://`)

### Option B: Render PostgreSQL

1. **Create New PostgreSQL**
2. **Select Free Plan** (or paid)
3. **Copy Internal Database URL**:
   - Format: `postgresql://user:pass@host/db?sslmode=require`

### Option C: Supabase

1. **Create New Project**
2. **Go to Database Settings**
3. **Copy Connection String**:
   - Use "Connection Pooling" URL for production
   - Format: `postgresql://postgres:[password]@[host]:6543/postgres`

### Option D: Neon.tech

1. **Create New Project**
2. **Copy Connection String**
3. **Enable Connection Pooling**

**📝 Save your DATABASE_URL**

---

## 🖥️ Step 3: Backend Deployment

### Option A: Railway (Recommended)

#### 1. Create New Project
- Go to [railway.app](https://railway.app)
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose `iq-didactic-lms-demo`

#### 2. Configure Service
- **Root Directory**: Leave empty (or set to `/` if needed)
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`

#### 3. Set Environment Variables

Go to **Variables** tab and add:

```bash
# Required
JWT_SECRET=<your-64-char-secret-from-step-1>
DATABASE_URL=<postgres-url-from-step-2>
NODE_ENV=production
PORT=5000

# CORS - Add after frontend is deployed
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

#### 4. Get Backend URL
- Click "Settings" → "Domains"
- Railway provides: `your-app.up.railway.app`
- Or add custom domain

#### 5. Deploy
- Railway auto-deploys on push to main
- Migrations run automatically on startup
- Check logs for any errors

---

### Option B: Render

#### 1. Create New Web Service
- Go to [render.com](https://render.com)
- Click "New +" → "Web Service"
- Connect your GitHub repo

#### 2. Configure Service
- **Name**: `iq-didactic-api`
- **Region**: Choose closest to users
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (or paid)

#### 3. Add Environment Variables

In **Environment** section:

```bash
JWT_SECRET=<your-64-char-secret>
DATABASE_URL=<postgres-internal-url>
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend.vercel.app
```

#### 4. Deploy
- Click "Create Web Service"
- Render auto-deploys
- Get URL: `your-app.onrender.com`

---

## 🌐 Step 4: Frontend Deployment

### Option A: Vercel (Recommended)

#### 1. Import Project
- Go to [vercel.com](https://vercel.com)
- Click "Add New" → "Project"
- Import `iq-didactic-lms-demo` from GitHub

#### 2. Configure Project
- **Framework Preset**: Create React App
- **Root Directory**: `./` (leave default)
- **Build Command**: `npm run build`
- **Output Directory**: `build`

#### 3. Add Environment Variable

In **Environment Variables** section:

```bash
# Production
REACT_APP_API_URL=https://your-backend.railway.app/api

# Or if using Render
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

**Important**: Make sure to include `/api` at the end!

#### 4. Deploy
- Click "Deploy"
- Get URL: `your-app.vercel.app`
- Add custom domain (optional)

---

### Option B: Netlify

#### 1. Create New Site
- Go to [netlify.com](https://netlify.com)
- Click "Add new site" → "Import from Git"
- Choose your repo

#### 2. Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `build`

#### 3. Environment Variables

In **Site settings** → **Environment variables**:

```bash
REACT_APP_API_URL=https://your-backend.railway.app/api
```

#### 4. Deploy
- Click "Deploy site"
- Get URL: `your-app.netlify.app`

---

## 🔄 Step 5: Update CORS Settings

**After frontend is deployed**, update backend CORS:

### Railway/Render Dashboard

1. Go to backend service
2. Add/Update environment variable:

```bash
FRONTEND_URL=https://your-actual-frontend.vercel.app
```

3. **Redeploy** backend (Railway/Render will auto-restart)

### Or Update in Code (Alternative)

Edit `backend/server.js`:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://your-frontend.vercel.app',  // Add your actual URL
  process.env.FRONTEND_URL
].filter(Boolean);
```

---

## ✅ Step 6: Verify Deployment

### Test Backend

**Health Check:**
```bash
curl https://your-backend.railway.app/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "uptime": 123.45,
  "database": "connected",
  "timestamp": "2025-12-17T08:00:00.000Z"
}
```

**Test API Root:**
```bash
curl https://your-backend.railway.app/
```

**Expected Response:**
```json
{
  "success": true,
  "message": "IQ Didactic API Server",
  "version": "1.0.0",
  "environment": "production"
}
```

### Test Frontend

1. **Visit**: `https://your-frontend.vercel.app`
2. **Check Console**: No errors
3. **Test Signup**:
   - Try weak password → Should fail ✅
   - Try strong password → Should succeed ✅
4. **Test Login**: Should work ✅
5. **Refresh Page**: Should stay logged in ✅

### Test Integration

1. **Login** on frontend
2. **Open DevTools** → Network tab
3. **Check requests** go to backend URL
4. **Verify** 200 status codes

---

## 🐛 Troubleshooting

### Backend Won't Start

**Issue**: Server crashes on startup

**Check:**
```bash
# Railway/Render logs
- Look for "JWT_SECRET is not defined"
- Look for database connection errors
- Check migrations ran successfully
```

**Fix:**
1. Verify all environment variables are set
2. Check `DATABASE_URL` format
3. Ensure PostgreSQL is running

---

### Frontend Can't Connect to Backend

**Issue**: API requests fail with CORS error

**Check Browser Console:**
```
Access to fetch at 'https://backend.railway.app/api/auth/login' 
from origin 'https://frontend.vercel.app' has been blocked by CORS
```

**Fix:**
1. Add frontend URL to `FRONTEND_URL` env variable
2. Redeploy backend
3. Clear browser cache
4. Hard refresh (Ctrl+Shift+R)

---

### Database Migrations Failed

**Issue**: Tables not created

**Check Backend Logs:**
```bash
❌ Migration failed: [error message]
```

**Fix:**
1. Check database URL is correct
2. Verify database is accessible
3. Check SSL mode in connection string
4. Manually run migrations:

```bash
# SSH into Railway/Render
cd backend
DATABASE_URL=<your-url> npm run migrate
```

---

### Rate Limiting Too Strict

**Issue**: Users getting rate limited too quickly

**Fix**: Update `backend/middleware/rateLimiter.js`

```javascript
// Increase limits for production
exports.standardRateLimiter = exports.createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 500, // Increase from 100 to 500
  message: 'Too many requests'
});
```

Commit and push to trigger redeploy.

---

## 🔒 Security Checklist

### Post-Deployment

- [ ] JWT_SECRET is strong (64 chars) and unique
- [ ] DATABASE_URL uses SSL (`?sslmode=require`)
- [ ] FRONTEND_URL matches actual domain
- [ ] NODE_ENV=production is set
- [ ] No `.env` files in repository
- [ ] CORS allows only your domains
- [ ] HTTPS enabled on all services
- [ ] Rate limiting is active
- [ ] Password validation works
- [ ] Expired tokens are rejected

---

## 📊 Monitoring Setup

### Railway

1. **Metrics Dashboard**:
   - CPU, Memory, Network usage
   - Request rates
   - Response times

2. **Logs**:
   - Click service → "Logs" tab
   - Search for errors
   - Set up log alerts (paid plan)

### Render

1. **Metrics**:
   - Dashboard shows CPU, memory
   - Request/response metrics

2. **Log Streams**:
   - Real-time logs
   - Filter by severity

### Vercel

1. **Analytics**:
   - Page views
   - Core Web Vitals
   - Real User Monitoring

2. **Logs**:
   - Function logs
   - Edge logs
   - Build logs

---

## 🔄 CI/CD Setup

### Automatic Deployments

**Railway/Render/Vercel** auto-deploy on push to `main`:

```bash
# Make changes
git add .
git commit -m "feat: new feature"
git push origin main

# Automatic deployment triggered:
# 1. Railway redeploys backend
# 2. Vercel redeploys frontend
# 3. Migrations run automatically
```

### Branch Previews

**Vercel** creates preview for each PR:
- Unique URL for testing
- Automatic on PR creation
- Use for staging/testing

---

## 💰 Cost Estimates

### Free Tier (Development/Small Scale)

- **Railway**: $5 free credit/month
  - Backend + PostgreSQL
  - ~500 hours runtime
  
- **Render**: Free tier
  - 750 hours/month
  - 512 MB RAM
  - Sleeps after 15min inactivity
  
- **Vercel**: Free tier
  - Unlimited deployments
  - 100 GB bandwidth
  - Serverless functions

**Total Free**: $0/month (within limits)

### Production (Paid Plans)

- **Railway Pro**: $20/month
  - More resources
  - No sleep mode
  - Custom domains
  
- **Render Starter**: $7/month
  - Always-on
  - 512 MB RAM
  
- **Vercel Pro**: $20/month
  - Analytics
  - Password protection
  - More bandwidth

**Total Production**: ~$27-50/month

---

## 📈 Scaling Recommendations

### When to Scale

**Scale Backend** when:
- Response times > 500ms
- CPU usage > 80%
- Memory usage > 80%
- > 1,000 daily active users

**Scale Database** when:
- Query times > 200ms
- Connection pool maxed out
- > 10,000 records

### How to Scale

1. **Vertical Scaling** (Railway/Render):
   - Upgrade plan
   - More CPU/RAM
   - Faster database

2. **Horizontal Scaling**:
   - Multiple backend instances
   - Load balancer
   - Redis for sessions
   - Database read replicas

3. **Optimize First**:
   - Enable Redis caching
   - Add more database indexes
   - Optimize slow queries
   - Implement pagination

---

## 🆘 Emergency Procedures

### Site Down

1. **Check Status**:
   - Railway/Render status page
   - Database status
   - Network issues

2. **Rollback**:
   ```bash
   # Railway/Render
   - Go to deployments
   - Click previous successful deployment
   - Click "Redeploy"
   ```

3. **Hotfix**:
   ```bash
   # Fix issue locally
   git add .
   git commit -m "hotfix: critical bug"
   git push origin main
   # Auto-deploys
   ```

### Database Issues

1. **Restore from Backup**:
   ```bash
   # Railway/Render console
   psql $DATABASE_URL < backup.sql
   ```

2. **Check Connections**:
   ```sql
   SELECT count(*) FROM pg_stat_activity;
   ```

3. **Kill Long Queries**:
   ```sql
   SELECT pg_terminate_backend(pid) 
   FROM pg_stat_activity 
   WHERE state = 'active' 
   AND query_start < now() - interval '5 minutes';
   ```

---

## 📞 Support Resources

### Documentation
- Railway: https://docs.railway.app
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs

### Community
- Railway Discord: https://discord.gg/railway
- Render Community: https://community.render.com
- Vercel Discord: https://vercel.com/discord

### Your Project
- FIXES_SUMMARY.md
- PERFORMANCE_GUIDE.md
- GitHub Issues

---

## ✅ Deployment Complete!

**Congratulations!** 🎉 Your IQ Didactic LMS is now live!

### Post-Deployment Tasks

- [ ] Share URLs with team
- [ ] Set up monitoring alerts
- [ ] Schedule database backups
- [ ] Document any custom configurations
- [ ] Plan first feature release

### Production URLs

**Backend**: `https://_____.railway.app`  
**Frontend**: `https://_____.vercel.app`  
**Status**: 🟢 Live

---

**Last Updated**: December 17, 2025  
**Version**: 1.0.0  
**Status**: Production Ready 🚀
