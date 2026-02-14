# Production Deployment Guide

## Overview

This guide covers productionizing and running the Primary School Microfrontend application in production environments. The application uses a microfrontend architecture with Module Federation for modular deployments.

## Production Architecture

```
┌─────────────────────────────────────────────────┐
│          Nginx Reverse Proxy (SSL/TLS)          │
├─────────────────────────────────────────────────┤
│              Load Balancer / Router              │
├──────────────┬──────────────┬──────────────────┤
│  Container   │ Maths-Science│    Exam          │
│  (Port 3000) │ (Port 3001)  │   (Port 3002)    │
├──────────────┴──────────────┴──────────────────┤
│          Student Records                        │
│          (Port 3003)                            │
└─────────────────────────────────────────────────┘
```

## Prerequisites

- **Node.js** v18 or higher
- **npm** v8 or higher
- **nginx** (for reverse proxy)
- **Docker & Docker Compose** (optional, for containerized deployment)
- **SSL/TLS certificates** (for HTTPS)

## Method 1: Traditional Server Deployment

### Step 1: Build Production Artifacts

```bash
# Navigate to project root
cd /path/to/primary-school

# Make build script executable
chmod +x scripts/build-prod.sh

# Build all modules
bash scripts/build-prod.sh
```

This creates optimized, minified production builds in each module's `dist/` folder.

### Step 2: Copy Artifacts to Server

```bash
# From your development machine
scp -r container/dist/ user@your-server:/var/www/primary-school/container/
scp -r maths-science/dist/ user@your-server:/var/www/primary-school/maths-science/
scp -r exam/dist/ user@your-server:/var/www/primary-school/exam/
scp -r student-records/dist/ user@your-server:/var/www/primary-school/student-records/
```

### Step 3: Install Production Dependencies

```bash
# SSH into your server
ssh user@your-server

# Navigate to project root
cd /var/www/primary-school

# Install dependencies in each module
for module in container maths-science exam student-records; do
  cd $module
  npm ci --only=production
  cd ..
done
```

### Step 4: Configure Nginx

```bash
# Copy nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/primary-school

# Update domain names in the config
sudo nano /etc/nginx/sites-available/primary-school

# Create symbolic link
sudo ln -s /etc/nginx/sites-available/primary-school /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

### Step 5: Set Up SSL Certificates

Using Let's Encrypt with Certbot:

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal is automatically configured
sudo systemctl status certbot.timer
```

### Step 6: Start Production Services

Make the start script executable:

```bash
chmod +x scripts/start-prod.sh
```

Start services:

```bash
# Option A: Run in background using nohup
nohup bash scripts/start-prod.sh > /var/log/primary-school/production.log 2>&1 &

# Option B: Use systemd service (recommended)
sudo cp systemd/primary-school.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl start primary-school
sudo systemctl enable primary-school
```

### Step 7: Verify Deployment

```bash
# Check if services are running
bash scripts/check-status.sh

# Check logs
tail -f /var/log/primary-school/production.log

# Test endpoints
curl -I http://localhost:3000
curl -I http://localhost:3001/remoteEntry.js
curl -I http://localhost:3002/remoteEntry.js
curl -I http://localhost:3003/remoteEntry.js
```

## Method 2: Docker Deployment (Recommended)

### Step 1: Build Docker Images

```bash
# Build the Docker image
docker build -t primary-school:latest .

# Or use Docker Compose for all services
docker-compose build
```

### Step 2: Run with Docker Compose

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f container
```

### Step 3: Verify Services

```bash
# Test container application
curl -I http://localhost:3000

# Test remote entry files
curl -I http://localhost:3001/remoteEntry.js
curl -I http://localhost:3002/remoteEntry.js
curl -I http://localhost:3003/remoteEntry.js
```

## Environment Variables

Configure these environment variables for your deployment:

### Container Module

```bash
MATHS_SCIENCE_URL=http://your-domain.com/maths-science/remoteEntry.js
EXAM_URL=http://your-domain.com/exam/remoteEntry.js
STUDENT_RECORDS_URL=http://your-domain.com/student-records/remoteEntry.js
NODE_ENV=production
```

### All Modules

```bash
NODE_ENV=production
PORT=3000  # or 3001, 3002, 3003 for respective modules
```

### Example .env file

```bash
# Server configuration
NODE_ENV=production
CONTAINER_PORT=3000
MATHS_SCIENCE_PORT=3001
EXAM_PORT=3002
STUDENT_RECORDS_PORT=3003

# Domain configuration
MATHS_SCIENCE_HOST=localhost
EXAM_HOST=localhost
STUDENT_RECORDS_HOST=localhost

# Remote URLs
MATHS_SCIENCE_URL=http://localhost:3001/remoteEntry.js
EXAM_URL=http://localhost:3002/remoteEntry.js
STUDENT_RECORDS_URL=http://localhost:3003/remoteEntry.js
```

## Production Build Optimization

### Webpack Optimizations

The webpack configs now include:

- **Minification**: Production code is minified for smaller bundle sizes
- **Code Splitting**: Automatic chunking of common dependencies
- **Hash-based Filenames**: Cache-busting with content hashes
- **Tree Shaking**: Unused code removal
- **Module Federation**: Shared dependencies to reduce redundancy

### Bundle Size Analysis

```bash
# Analyze bundle sizes
npm install -g webpack-bundle-analyzer

# Run analysis
webpack-bundle-analyzer container/dist/main.*.js
```

## Monitoring & Logging

### Set Up Log Rotation

```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/primary-school
```

Content:

```
/var/log/primary-school/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0644 www-data www-data
    sharedscripts
    postrotate
        systemctl reload primary-school > /dev/null 2>&1 || true
    endscript
}
```

### Monitor Service Health

```bash
# Check service status
systemctl status primary-school

# View real-time logs
journalctl -u primary-school -f

# Check resource usage
top -p $(pgrep -f "node.*serve" | tr '\n' ',')
```

## Performance Tips

1. **Enable Gzip Compression**: Already configured in nginx.conf
2. **Use HTTP/2**: Nginx configured for HTTP/2
3. **Cache Static Assets**: Set appropriate cache headers
4. **Content Delivery Network (CDN)**: Consider CloudFlare, AWS CloudFront
5. **Database Caching**: If needed, use Redis for session management
6. **Load Balancing**: Use nginx upstream blocks for multiple server instances

## Security Checklist

- ✅ SSL/TLS certificates configured
- ✅ HTTP to HTTPS redirect enabled
- ✅ Security headers configured (HSTS, CSP, X-Frame-Options, etc.)
- ✅ Cross-Origin Resource Sharing (CORS) properly configured
- ✅ Input validation and sanitization
- ✅ Regular security updates for Node.js and dependencies
- ✅ Firewall rules restrict access to internal ports
- ✅ Regular backups of configuration and database

## Rollback Procedure

```bash
# Keep previous build artifacts
cd /var/www/primary-school
mkdir -p backups/$(date +%Y%m%d-%H%M%S)
cp -r */dist backups/$(date +%Y%m%d-%H%M%S)/

# If rollback needed
cp backups/TIMESTAMP/dist/* ./dist/
systemctl restart primary-school
```

## Troubleshooting

### Services Won't Start

```bash
# Check if ports are in use
lsof -i :3000
lsof -i :3001
lsof -i :3002
lsof -i :3003

# Kill process on port
kill -9 <PID>
```

### Module Federation Not Loading

```bash
# Verify remoteEntry.js files are accessible
curl -v http://localhost:3001/remoteEntry.js
curl -v http://localhost:3002/remoteEntry.js
curl -v http://localhost:3003/remoteEntry.js

# Check CORS headers
curl -I http://localhost:3001/remoteEntry.js | grep Access-Control
```

### High Memory Usage

```bash
# Check Node.js memory usage
ps aux | grep node

# Adjust Node.js memory limit if needed
NODE_OPTIONS=--max-old-space-size=2048 npm run serve
```

### 404 Errors on Routes

Ensure nginx.conf has `error_page 404 =200 /;` for SPA routing.

## Performance Metrics

Monitor these metrics in production:

- **Page Load Time**: Target < 2 seconds
- **Bundle Size**: Aim for < 500KB (gzipped)
- **Core Web Vitals**:
  - Largest Contentful Paint (LCP): < 2.5s
  - First Input Delay (FID): < 100ms
  - Cumulative Layout Shift (CLS): < 0.1

## Support & Resources

- **Nginx Docs**: https://nginx.org/en/docs/
- **React Documentation**: https://react.dev
- **Webpack Module Federation**: https://webpack.js.org/concepts/module-federation/
- **Docker Documentation**: https://docs.docker.com/

