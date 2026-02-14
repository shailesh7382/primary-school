# Quick Production Start Guide

## 🚀 Quick Start (5 minutes)

### Option 1: Local Testing (Recommended First)

```bash
# 1. Build all modules
bash scripts/build-prod.sh

# 2. Start all services with production serving
bash scripts/start-prod.sh

# 3. Open in browser
# Container: http://localhost:3000
# Maths-Science: http://localhost:3001
# Exam: http://localhost:3002
# Student Records: http://localhost:3003

# 4. Stop services
bash scripts/stop-prod.sh
```

### Option 2: Docker (Quickest)

```bash
# 1. Build and start all services
docker-compose up -d

# 2. Check services are running
docker-compose ps

# 3. Open http://localhost:3000 in browser

# 4. Stop services
docker-compose down
```

### Option 3: Server Deployment

```bash
# 1. Build on your local machine
bash scripts/build-prod.sh

# 2. Copy to server
scp -r container/dist user@your-server:/var/www/primary-school/container/
scp -r maths-science/dist user@your-server:/var/www/primary-school/maths-science/
scp -r exam/dist user@your-server:/var/www/primary-school/exam/
scp -r student-records/dist user@your-server:/var/www/primary-school/student-records/

# 3. On server - install and start
ssh user@your-server
cd /var/www/primary-school

# Install dependencies
for dir in container maths-science exam student-records; do
  cd $dir && npm ci --only=production && cd ..
done

# Start services
nohup bash scripts/start-prod.sh > production.log 2>&1 &
```

## 📋 Production Checklist

Before going live:

- [ ] All modules built with `npm run build`
- [ ] Environment variables configured
- [ ] SSL/TLS certificates installed
- [ ] Nginx/reverse proxy configured
- [ ] Services verified with `check-status.sh`
- [ ] Firewall rules configured
- [ ] Monitoring/logging set up
- [ ] Backup procedure tested
- [ ] Load testing completed
- [ ] Database backups configured

## 🔧 Common Commands

```bash
# Build production artifacts
npm run build:all

# Start production services
bash scripts/start-prod.sh

# Stop all services
bash scripts/stop-prod.sh

# Check service status
bash scripts/check-status.sh

# View logs
tail -f /var/log/primary-school/production.log

# Clean all builds
npm run clean
```

## 🌐 Environment Variables

Set these when running in production:

```bash
export NODE_ENV=production
export MATHS_SCIENCE_URL=https://your-domain.com/maths-science/remoteEntry.js
export EXAM_URL=https://your-domain.com/exam/remoteEntry.js
export STUDENT_RECORDS_URL=https://your-domain.com/student-records/remoteEntry.js
```

## 📊 Bundle Sizes (Production)

After `npm run build`:

```
container/dist/
  ├── main.[hash].js         (~ 50-100 KB gzipped)
  └── [other chunks]         

maths-science/dist/
  ├── remoteEntry.js         (~ 5-10 KB gzipped)
  └── [module chunks]

exam/dist/
  ├── remoteEntry.js         (~ 5-10 KB gzipped)
  └── [module chunks]

student-records/dist/
  ├── remoteEntry.js         (~ 5-10 KB gzipped)
  └── [module chunks]
```

## 🔍 Monitoring

Monitor these in production:

```bash
# CPU and Memory
ps aux | grep "node.*serve"
top -p $(pgrep -f "node.*serve" | tr '\n' ',')

# Port availability
netstat -tulpn | grep -E ':(3000|3001|3002|3003)'
```

## 🆘 Troubleshooting

**Services won't start?**
```bash
# Check if ports are in use
lsof -i :3000

# Kill the process
kill -9 <PID>

# Check logs
tail -100 /var/log/primary-school/production.log
```

**Module not loading?**
```bash
# Verify remoteEntry.js is accessible
curl -I http://localhost:3001/remoteEntry.js
```

**High memory usage?**
```bash
# Increase Node.js memory limit
NODE_OPTIONS=--max-old-space-size=2048 npm run serve
```

## 📚 Full Documentation

For detailed production deployment guide, see: [PRODUCTION.md](./PRODUCTION.md)

## 📞 Support

For issues:
1. Check logs: `tail -f /var/log/primary-school/production.log`
2. Check port status: `lsof -i :3000`
3. Verify module URLs are correct
4. Review PRODUCTION.md for detailed troubleshooting

