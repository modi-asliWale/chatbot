# Deployment Guide

This guide covers deploying the Sarvam AI Chatbot to various platforms.

## Prerequisites

Before deploying, ensure you have:
- A valid Sarvam.ai API key
- Node.js 18+ installed locally
- Git repository set up

## Vercel Deployment (Recommended)

Vercel is the easiest and recommended platform for deploying Next.js applications.

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Sarvam AI Chatbot"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: **Next.js**
   - Root Directory: **.**
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 3: Set Environment Variables

In the Vercel project settings, add these environment variables:

```
SARVAM_API_KEY=your_api_key_here
SARVAM_API_URL=https://api.sarvam.ai/v1
```

Optional variables:
```
SARVAM_MODEL=chat-saarthi
SARVAM_TIMEOUT_MS=20000
MAX_CONTEXT_MESSAGES=12
```

### Step 4: Deploy

Click "Deploy" and Vercel will build and deploy your application.

Your chatbot will be live at: `https://your-project.vercel.app`

## Docker Deployment

### Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Update next.config.js

Add output configuration:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    SARVAM_API_KEY: process.env.SARVAM_API_KEY,
  },
}

module.exports = nextConfig
```

### Build and Run

```bash
# Build the Docker image
docker build -t sarvam-chatbot .

# Run the container
docker run -p 3000:3000 \
  -e SARVAM_API_KEY=your_api_key_here \
  -e SARVAM_API_URL=https://api.sarvam.ai/v1 \
  sarvam-chatbot
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  chatbot:
    build: .
    ports:
      - "3000:3000"
    environment:
      - SARVAM_API_KEY=${SARVAM_API_KEY}
      - SARVAM_API_URL=${SARVAM_API_URL}
      - NODE_ENV=production
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

## AWS Deployment

### AWS Amplify

1. Go to AWS Amplify Console
2. Choose "Host web app"
3. Connect your GitHub repository
4. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
5. Add environment variables in Amplify settings
6. Deploy

### AWS EC2

1. Launch an EC2 instance (Ubuntu 22.04 LTS)
2. SSH into the instance
3. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
4. Clone your repository
5. Install dependencies and build:
   ```bash
   npm ci
   npm run build
   ```
6. Use PM2 to run the app:
   ```bash
   sudo npm install -g pm2
   pm2 start npm --name "sarvam-chatbot" -- start
   pm2 save
   pm2 startup
   ```
7. Configure Nginx as reverse proxy (optional)

## Netlify Deployment

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Choose your repository
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variables
7. Deploy

## Railway Deployment

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables
6. Railway will auto-detect Next.js and deploy

## DigitalOcean App Platform

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Choose your GitHub repository
4. Configure:
   - Type: Web Service
   - Build command: `npm run build`
   - Run command: `npm start`
5. Add environment variables
6. Deploy

## Environment Variables Reference

Required for all platforms:

| Variable | Description | Example |
|----------|-------------|---------|
| `SARVAM_API_KEY` | Your Sarvam.ai API key | `sk_xxx...` |

Optional:

| Variable | Default | Description |
|----------|---------|-------------|
| `SARVAM_API_URL` | `https://api.sarvam.ai/v1` | API base URL |
| `SARVAM_MODEL` | `chat-saarthi` | Model identifier |
| `SARVAM_TIMEOUT_MS` | `20000` | Request timeout |
| `MAX_CONTEXT_MESSAGES` | `12` | Conversation history size |
| `NEXT_PUBLIC_MAX_CONTEXT_MESSAGES` | `12` | Client-side history size |

## Post-Deployment

### 1. Test the Deployment

- Open your deployed URL
- Try conversations in multiple languages
- Test error handling by disconnecting network
- Verify responsive design on mobile

### 2. Monitor

- Set up error tracking (Sentry, LogRocket)
- Monitor API usage and costs
- Check response times

### 3. Custom Domain (Optional)

Most platforms support custom domains:
- Vercel: Project Settings → Domains
- Netlify: Site Settings → Domain Management
- AWS Amplify: App Settings → Domain Management

### 4. SSL Certificate

All recommended platforms provide automatic SSL certificates.

## Scaling Considerations

### Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
// src/app/api/chat/route.ts
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

const rateLimitMap = new Map()

function rateLimit(ip: string, limit = 10, windowMs = 60000) {
  const now = Date.now()
  const record = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs }
  
  if (now > record.resetTime) {
    record.count = 1
    record.resetTime = now + windowMs
  } else {
    record.count++
  }
  
  rateLimitMap.set(ip, record)
  return record.count <= limit
}
```

### Caching

Implement caching for common queries to reduce API calls.

### CDN

Use a CDN (Cloudflare, AWS CloudFront) for static assets.

## Troubleshooting

### Build Failures

1. Check Node.js version (must be 18+)
2. Verify all dependencies are in `package.json`
3. Check build logs for specific errors

### Runtime Errors

1. Verify environment variables are set correctly
2. Check API key has sufficient permissions
3. Review application logs

### Performance Issues

1. Enable Next.js caching
2. Optimize image loading
3. Implement lazy loading for components
4. Use CDN for static assets

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Implement rate limiting** to prevent abuse
4. **Enable CORS** only for trusted domains
5. **Keep dependencies updated** regularly
6. **Use HTTPS** for all deployments
7. **Sanitize user inputs** to prevent XSS attacks
8. **Monitor API usage** for unusual patterns

## Cost Optimization

1. Set up billing alerts for Sarvam.ai API
2. Implement caching for repeated queries
3. Use serverless platforms (Vercel, Netlify) for automatic scaling
4. Monitor and optimize API calls

## Support

For deployment issues:
- Check platform-specific documentation
- Review application logs
- Contact Sarvam.ai support for API issues
- Open an issue in the GitHub repository

---

**Quick Deploy Links:**
- [Deploy to Vercel](https://vercel.com/new)
- [Deploy to Netlify](https://app.netlify.com/start)
- [Deploy to Railway](https://railway.app/new)
