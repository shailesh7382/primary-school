# Production Deployment Guide - Index

Welcome! This directory contains everything you need to deploy the Primary School Microfrontend application to production.

## 📖 Documentation Map

Start with the guide that matches your situation:

### 🏃 **I Want to Deploy NOW** → Start Here
1. **[PRODUCTION_QUICK_START.md](./PRODUCTION_QUICK_START.md)** ⚡
   - 5-minute quick start guide
   - Three deployment options (Local, Docker, Server)
   - Essential commands and environment variables

### 📚 **I Want Detailed Instructions** → Read This
2. **[PRODUCTION.md](./PRODUCTION.md)** 📖
   - Complete production deployment guide
   - Traditional server deployment method
   - Docker deployment method
   - Security configuration
   - Performance optimization
   - Troubleshooting guide

### ✅ **I Need a Checklist** → Use This
3. **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** ✓
   - Pre-deployment verification
   - Step-by-step checklist for all deployment methods
   - Security checks
   - Post-deployment verification
   - Sign-off section for team

### 🎯 **I Want an Overview** → Check This Out
4. **[DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)** 🎯
   - What has been set up
   - Quick steps for each deployment method
   - New files created
   - Configuration reference
   - Common issues and solutions

---

## 🚀 Three Deployment Methods

### **Method 1: Local Testing** (Best for Testing)
```bash
bash scripts/build-prod.sh
bash scripts/start-prod.sh
# Open http://localhost:3000
bash scripts/stop-prod.sh
```
See: PRODUCTION_QUICK_START.md → Option 1

### **Method 2: Docker** (Best for Cloud)
```bash
docker-compose up -d
# Open http://localhost:3000
docker-compose down
```
See: PRODUCTION_QUICK_START.md → Option 2 or PRODUCTION.md → Method 2

### **Method 3: Server** (Best for Traditional)
```bash
bash scripts/build-prod.sh
# Copy dist folders to server
# Configure nginx with nginx.conf
# Start with scripts/start-prod.sh or systemd
```
See: PRODUCTION_QUICK_START.md → Option 3 or PRODUCTION.md → Method 1

---

## 📁 What's Included

### **Scripts**
- `scripts/build-prod.sh` - Build all modules for production
- `scripts/start-prod.sh` - Start all services in production
- `scripts/stop-prod.sh` - Stop all services
- `scripts/check-status.sh` - Check service status

### **Configuration Files**
- `nginx.conf` - Nginx reverse proxy configuration
- `docker-compose.yml` - Docker multi-container orchestration
- `Dockerfile` - Docker container build (multi-stage)
- `.env.example` - Environment variables template
- `systemd/primary-school.service` - Linux systemd service

### **Documentation**
- `PRODUCTION_QUICK_START.md` - Quick reference guide
- `PRODUCTION.md` - Comprehensive deployment guide
- `DEPLOYMENT_SUMMARY.md` - Overview and summary
- `DEPLOYMENT_CHECKLIST.md` - Pre/post deployment checklist
- `README_PRODUCTION.md` - This file

---

## ⚙️ Quick Configuration

### **Environment Variables**
Copy and configure `.env`:
```bash
cp .env.example .env
nano .env
```

Key variables:
```bash
NODE_ENV=production
MATHS_SCIENCE_URL=http://localhost:3001/remoteEntry.js
EXAM_URL=http://localhost:3002/remoteEntry.js
STUDENT_RECORDS_URL=http://localhost:3003/remoteEntry.js
```

### **Update Domain Names**
In production, update these files with your actual domain:
- `nginx.conf` - Replace `your-domain.com` with your domain
- `.env` - Update remote module URLs if using reverse proxy
- `docker-compose.yml` - If using Docker environment variables

---

## 🔧 Common Commands

```bash
# Development (dev servers with hot reload)
npm run start:all

# Production Build
npm run build:all
# or
bash scripts/build-prod.sh

# Production Running
bash scripts/start-prod.sh     # Start all services
bash scripts/stop-prod.sh      # Stop all services
bash scripts/check-status.sh   # Check service status

# Docker
docker-compose up -d           # Start
docker-compose ps              # Check status
docker-compose logs -f         # View logs
docker-compose down            # Stop
```

---

## 📊 What Was Updated

### **Webpack Configurations**
- ✅ Production mode enabled
- ✅ Minification and code splitting
- ✅ Hash-based filenames for cache busting
- ✅ Environment variable support
- ✅ React 19.2.4 compatibility

### **Package Scripts**
Each module now has:
- `npm run start` - Development server
- `npm run build` - Production build
- `npm run serve` - Production serving (via 'serve' package)

### **React Upgrade**
- ✅ React upgraded from 18.2.0 to 19.2.4
- ✅ All modules verified with React 19.2.4
- ✅ Module Federation configured for React 19.2.4

---

## 🔐 Security Checklist

Before production deployment:
- [ ] Replace placeholder domains in nginx.conf
- [ ] Obtain SSL/TLS certificates (Let's Encrypt recommended)
- [ ] Configure firewall rules
- [ ] Set environment variables securely
- [ ] Review CORS configuration
- [ ] Enable security headers
- [ ] Set up monitoring and alerting

See: DEPLOYMENT_CHECKLIST.md for full security checklist

---

## 📈 Performance Features

- **Code Splitting**: Automatic splitting of shared dependencies
- **Minification**: All code minified in production
- **Tree Shaking**: Unused code removed
- **Gzip Compression**: Enabled in nginx configuration
- **Asset Hashing**: Content-based hashing for cache busting
- **Static Asset Caching**: Long-term caching of versioned assets
- **HTTP/2**: Supported via nginx
- **Module Federation**: Shared dependencies reduce bundle size

---

## 🆘 Troubleshooting

### Port Already in Use
```bash
lsof -i :3000
kill -9 <PID>
```

### Build Fails
```bash
npm run clean
npm run install:all
npm run build:all
```

### Services Won't Start
```bash
# Check logs
tail -f /var/log/primary-school/production.log

# Check ports
netstat -tulpn | grep -E ':3000|:3001|:3002|:3003'
```

### Module Not Loading
```bash
# Verify remote entries are accessible
curl -I http://localhost:3001/remoteEntry.js
curl -I http://localhost:3002/remoteEntry.js
curl -I http://localhost:3003/remoteEntry.js
```

For more troubleshooting: See PRODUCTION.md → Troubleshooting

---

## 📋 Deployment Decision Tree

```
START
  ↓
Quick Test Locally?
  ├─ YES → Use Method 1 (Local) → PRODUCTION_QUICK_START.md
  ↓ NO
Want to Use Docker?
  ├─ YES → Use Method 2 (Docker) → PRODUCTION_QUICK_START.md or PRODUCTION.md
  ↓ NO
Deploy to Server?
  ├─ YES → Use Method 3 (Server) → PRODUCTION.md or PRODUCTION_QUICK_START.md
  ├─ CLOUD → Use Docker + Cloud Platform → PRODUCTION.md
  ↓
Need Help?
  ├─ Quick Questions → PRODUCTION_QUICK_START.md
  ├─ Detailed Info → PRODUCTION.md
  ├─ Full Checklist → DEPLOYMENT_CHECKLIST.md
  ├─ Issues → PRODUCTION.md → Troubleshooting
  ↓
DEPLOY!
```

---

## 📞 Support Resources

### **Documentation Files**
- `PRODUCTION_QUICK_START.md` - Quick commands and options
- `PRODUCTION.md` - Complete guide with all details
- `DEPLOYMENT_CHECKLIST.md` - Verification checklist
- `DEPLOYMENT_SUMMARY.md` - Overview and summary

### **Configuration Templates**
- `nginx.conf` - Update domain and SSL paths
- `docker-compose.yml` - Update environment variables
- `.env.example` - Copy to .env and customize
- `systemd/primary-school.service` - For Linux servers

### **External Resources**
- [Nginx Documentation](https://nginx.org/en/docs/)
- [React Documentation](https://react.dev)
- [Docker Documentation](https://docs.docker.com/)
- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)

---

## ✨ Key Features

✅ **Production Ready**
- Optimized webpack configuration
- Minified and split code
- Asset hashing and caching

✅ **Multiple Deployment Options**
- Local testing with npm
- Docker containerization
- Traditional server deployment

✅ **Well Configured**
- Nginx reverse proxy
- SSL/TLS support
- Security headers

✅ **Fully Documented**
- Quick start guide
- Complete deployment manual
- Troubleshooting guide
- Deployment checklist

✅ **Easy to Maintain**
- Environment variables for configuration
- Systemd service for Linux
- Docker for containerization
- Log rotation configuration

---

## 🎯 Quick Start (Choose One)

### **I have 5 minutes** 
→ Read `PRODUCTION_QUICK_START.md` and run:
```bash
bash scripts/build-prod.sh && bash scripts/start-prod.sh
```

### **I have 15 minutes**
→ Read `PRODUCTION.md` section relevant to your method

### **I have 1 hour**
→ Work through `DEPLOYMENT_CHECKLIST.md` and deploy

### **I have more time**
→ Read `PRODUCTION.md` fully and follow best practices

---

## 📅 Typical Timeline

| Action | Time |
|--------|------|
| Read PRODUCTION_QUICK_START.md | 5 min |
| Test locally with scripts | 10 min |
| Test with Docker (optional) | 5 min |
| Prepare server/cloud env | 30 min |
| Deploy and verify | 15 min |
| Monitor and troubleshoot | 30 min |
| **Total** | **~1.5 hours** |

---

## 🚀 Next Step

**👉 Start with: [PRODUCTION_QUICK_START.md](./PRODUCTION_QUICK_START.md)**

Choose your deployment method and follow the steps. You'll be up and running in minutes!

---

**Version**: 1.0 (February 14, 2026)

**Status**: ✅ Production Ready

**All modules updated to React 19.2.4** ✨

