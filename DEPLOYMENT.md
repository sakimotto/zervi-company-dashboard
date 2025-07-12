# Zervi Dashboard Deployment Guide

This guide provides step-by-step instructions for deploying the Zervi Company Dashboard to various hosting platforms. The dashboard consists of a React frontend and Express.js backend that can be deployed separately or together.

## 📋 Pre-deployment Checklist

Before deploying, ensure you have completed the following:

- [ ] Tested the application locally
- [ ] Built the production version (`pnpm run build`)
- [ ] Configured environment variables
- [ ] Verified all API endpoints are working
- [ ] Tested admin authentication
- [ ] Confirmed responsive design on mobile devices

## 🌐 Frontend Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides excellent React deployment with automatic builds and global CDN.

#### Steps:
1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   ```
   Framework Preset: Vite
   Build Command: pnpm run build
   Output Directory: dist
   Install Command: pnpm install
   ```

3. **Environment Variables**
   ```
   VITE_API_BASE_URL=https://your-backend-url.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - Get your deployment URL (e.g., `https://zervi-dashboard.vercel.app`)

#### Custom Domain (Optional):
- Go to Project Settings → Domains
- Add your custom domain (e.g., `dashboard.zervi.com`)
- Configure DNS records as instructed

### Option 2: Netlify

Netlify offers simple drag-and-drop deployment with form handling.

#### Steps:
1. **Build Locally**
   ```bash
   pnpm run build
   ```

2. **Deploy via Drag & Drop**
   - Go to [netlify.com](https://netlify.com)
   - Drag the `dist/` folder to the deployment area

3. **Configure Environment**
   - Go to Site Settings → Environment Variables
   - Add: `VITE_API_BASE_URL=https://your-backend-url.com`

4. **Continuous Deployment (Optional)**
   - Connect GitHub repository
   - Set build command: `pnpm run build`
   - Set publish directory: `dist`

### Option 3: GitHub Pages

Free hosting directly from your GitHub repository.

#### Steps:
1. **Create GitHub Actions Workflow**
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
             cache: 'npm'
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

2. **Configure Repository**
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages

3. **Update Base URL**
   In `vite.config.js`:
   ```javascript
   export default defineConfig({
     base: '/repository-name/',
     // ... other config
   })
   ```

## 🖥️ Backend Deployment Options

### Option 1: Railway (Recommended)

Railway provides excellent Node.js hosting with automatic deployments.

#### Steps:
1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Configure Service**
   ```
   Start Command: node src/server/index.js
   Port: 3001
   ```

3. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=3001
   ADMIN_PASSWORD=your_secure_password
   CORS_ORIGIN=https://your-frontend-url.com
   ```

4. **Deploy**
   - Railway automatically detects Node.js and deploys
   - Get your service URL (e.g., `https://zervi-dashboard-production.up.railway.app`)

### Option 2: Render

Render offers free Node.js hosting with automatic SSL.

#### Steps:
1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect GitHub repository

2. **Configure Service**
   ```
   Name: zervi-dashboard-api
   Environment: Node
   Build Command: npm install
   Start Command: node src/server/index.js
   ```

3. **Environment Variables**
   ```
   NODE_ENV=production
   ADMIN_PASSWORD=your_secure_password
   CORS_ORIGIN=https://your-frontend-url.com
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render builds and deploys automatically

### Option 3: Heroku

Traditional platform with extensive add-on ecosystem.

#### Steps:
1. **Install Heroku CLI**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Windows
   # Download from heroku.com
   ```

2. **Create Heroku App**
   ```bash
   heroku create zervi-dashboard-api
   ```

3. **Configure Environment**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set ADMIN_PASSWORD=your_secure_password
   heroku config:set CORS_ORIGIN=https://your-frontend-url.com
   ```

4. **Create Procfile**
   ```
   web: node src/server/index.js
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

## 🔗 Full-Stack Deployment

### Option 1: Single Platform (Railway)

Deploy both frontend and backend on Railway.

#### Backend Service:
- Follow Railway backend deployment steps above

#### Frontend Service:
1. **Create Static Site Service**
   - Add new service to same project
   - Select "Deploy from GitHub repo"

2. **Configure Build**
   ```
   Build Command: pnpm run build
   Publish Directory: dist
   ```

3. **Environment Variables**
   ```
   VITE_API_BASE_URL=https://your-backend-service.railway.app
   ```

### Option 2: Hybrid Deployment

Combine different platforms for optimal performance.

#### Recommended Combination:
- **Frontend**: Vercel (fast global CDN)
- **Backend**: Railway (excellent Node.js support)

#### Configuration:
1. Deploy backend to Railway first
2. Get backend URL
3. Deploy frontend to Vercel with backend URL in environment variables

## 🔧 Environment Configuration

### Production Environment Variables

#### Frontend (.env.production):
```env
VITE_API_BASE_URL=https://your-backend-url.com
VITE_APP_NAME=Zervi Dashboard
VITE_COMPANY_NAME=Zervi Pty Ltd
```

#### Backend (Production):
```env
NODE_ENV=production
PORT=3001
ADMIN_PASSWORD=your_secure_password_here
CORS_ORIGIN=https://your-frontend-url.com
SESSION_SECRET=your_session_secret_here
```

### Security Considerations

1. **Password Security**
   - Use a strong admin password
   - Consider implementing password rotation

2. **CORS Configuration**
   - Set specific frontend URL in CORS_ORIGIN
   - Avoid using wildcards in production

3. **Session Security**
   - Use a strong session secret
   - Configure appropriate session timeout

4. **HTTPS**
   - Ensure both frontend and backend use HTTPS
   - Most platforms provide automatic SSL certificates

## 📊 Monitoring and Maintenance

### Health Checks

Both platforms should monitor the health endpoint:
```
GET /api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-07-12T06:00:00.000Z"
}
```

### Logging

Enable appropriate logging levels:
- **Development**: `LOG_LEVEL=debug`
- **Production**: `LOG_LEVEL=info`

### Performance Monitoring

Consider adding monitoring services:
- **Frontend**: Vercel Analytics, Google Analytics
- **Backend**: Railway Metrics, New Relic, DataDog

### Backup Strategy

Since the current implementation uses in-memory storage:
1. **Data Export**: Implement regular data exports via admin panel
2. **Configuration Backup**: Keep environment variables documented
3. **Code Backup**: Ensure repository is properly backed up

### Updates and Maintenance

1. **Automated Deployments**
   - Configure automatic deployments from main branch
   - Use staging environments for testing

2. **Dependency Updates**
   ```bash
   # Check for updates
   pnpm outdated
   
   # Update dependencies
   pnpm update
   ```

3. **Security Updates**
   - Monitor for security advisories
   - Update dependencies regularly
   - Review and rotate passwords periodically

## 🚨 Troubleshooting

### Common Deployment Issues

#### Frontend Issues:

**Build Failures:**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
pnpm install
pnpm run build
```

**API Connection Issues:**
- Verify VITE_API_BASE_URL is correct
- Check CORS configuration on backend
- Ensure backend is deployed and accessible

#### Backend Issues:

**Port Binding:**
- Ensure PORT environment variable is set
- Use `0.0.0.0` as host for cloud deployments

**CORS Errors:**
- Verify CORS_ORIGIN matches frontend URL exactly
- Check for trailing slashes in URLs

**Authentication Issues:**
- Verify ADMIN_PASSWORD is set correctly
- Check session configuration

### Performance Optimization

#### Frontend:
1. **Bundle Analysis**
   ```bash
   pnpm run build --analyze
   ```

2. **Code Splitting**
   - Implement lazy loading for admin components
   - Split vendor bundles

3. **Asset Optimization**
   - Optimize images and icons
   - Use appropriate image formats

#### Backend:
1. **Response Caching**
   - Cache static data responses
   - Implement appropriate cache headers

2. **Database Optimization**
   - When migrating from in-memory storage
   - Implement proper indexing

3. **Rate Limiting**
   - Implement rate limiting for API endpoints
   - Protect against abuse

## 📈 Scaling Considerations

### Horizontal Scaling

When the dashboard grows:

1. **Database Migration**
   - Move from in-memory to persistent database
   - Consider PostgreSQL or MongoDB

2. **Session Storage**
   - Implement Redis for session storage
   - Enable multi-instance deployments

3. **API Optimization**
   - Implement caching layers
   - Consider API rate limiting

4. **CDN Integration**
   - Use CDN for static assets
   - Implement edge caching

### Monitoring and Analytics

1. **Application Monitoring**
   - Implement error tracking (Sentry)
   - Monitor performance metrics

2. **User Analytics**
   - Track dashboard usage patterns
   - Monitor admin actions

3. **Infrastructure Monitoring**
   - Monitor server resources
   - Set up alerting for downtime

---

This deployment guide ensures the Zervi Dashboard can be successfully deployed to production environments with proper security, performance, and monitoring considerations. Choose the deployment options that best fit your organization's needs and infrastructure requirements.

