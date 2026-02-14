# Production Deployment Checklist

Complete this checklist before deploying to production.

## Pre-Deployment Preparation

### Code & Build
- [ ] All code committed to version control
- [ ] Production build tested locally: `bash scripts/build-prod.sh`
- [ ] All modules build successfully without errors
- [ ] Bundle sizes are reasonable (< 500KB gzipped)
- [ ] No console errors or warnings in builds
- [ ] Dependencies are up to date and audited
- [ ] All tests pass (if applicable)

### Configuration
- [ ] `.env` file created from `.env.example`
- [ ] Environment variables configured for your domain
- [ ] Remote module URLs correctly set
- [ ] Database credentials configured (if applicable)
- [ ] API endpoints configured (if applicable)
- [ ] Logging paths configured

### Security
- [ ] SSL/TLS certificates obtained (Let's Encrypt or provider)
- [ ] Security headers configured in nginx.conf
- [ ] CORS settings appropriate for your domain
- [ ] Firewall rules configured
- [ ] SSH keys set up for server access
- [ ] Database passwords are strong and secure
- [ ] No sensitive data in version control
- [ ] All dependencies scanned for vulnerabilities

## Server Preparation

### System Requirements
- [ ] Server runs Node.js 18 or higher
- [ ] Server has sufficient disk space (at least 5GB)
- [ ] Server has sufficient RAM (at least 2GB)
- [ ] Server has stable internet connection
- [ ] Server OS is up to date with security patches
- [ ] Timezone is correctly set

### Software Installation
- [ ] Node.js and npm installed
- [ ] Nginx installed (or reverse proxy of choice)
- [ ] Git installed (for pulling repository)
- [ ] Docker and Docker Compose installed (if using containers)
- [ ] Let's Encrypt certbot installed (if using Let's Encrypt)

### User & Permissions
- [ ] Create dedicated user for application (e.g., `www-data`)
- [ ] Create application directory: `/var/www/primary-school`
- [ ] Create log directory: `/var/log/primary-school`
- [ ] Set appropriate permissions on directories
- [ ] Create systemd service file if using systemd

### Monitoring & Logging
- [ ] Create log rotation configuration
- [ ] Set up monitoring tool (New Relic, DataDog, etc.) - optional
- [ ] Configure log aggregation (ELK, CloudWatch, etc.) - optional
- [ ] Set up alerting for service failures
- [ ] Set up backup procedure
- [ ] Test backup restoration

## Deployment Method Selection

Choose one and complete its checklist:

### Option A: Traditional Server Deployment

- [ ] Copy dist folders to server: `scp -r container/dist user@server:/var/www/primary-school/container/`
- [ ] Copy maths-science dist: `scp -r maths-science/dist user@server:/var/www/primary-school/maths-science/`
- [ ] Copy exam dist: `scp -r exam/dist user@server:/var/www/primary-school/exam/`
- [ ] Copy student-records dist: `scp -r student-records/dist user@server:/var/www/primary-school/student-records/`
- [ ] Copy package.json files
- [ ] Copy scripts directory
- [ ] Install dependencies on server: `npm ci --only=production` in each module
- [ ] Copy nginx.conf to server: `sudo cp nginx.conf /etc/nginx/sites-available/primary-school`
- [ ] Update domain names in nginx.conf
- [ ] Test nginx configuration: `sudo nginx -t`
- [ ] Reload nginx: `sudo systemctl reload nginx`
- [ ] Copy systemd service file: `sudo cp systemd/primary-school.service /etc/systemd/system/`
- [ ] Enable systemd service: `sudo systemctl enable primary-school`
- [ ] Start service: `sudo systemctl start primary-school`

### Option B: Docker Deployment

- [ ] Copy entire project to server
- [ ] Update docker-compose.yml environment variables
- [ ] Copy nginx.conf to server for reverse proxy container
- [ ] Build Docker image: `docker build -t primary-school:latest .`
- [ ] Or use docker-compose build: `docker-compose build`
- [ ] Start services: `docker-compose up -d`
- [ ] Verify all containers are running: `docker-compose ps`
- [ ] Check container logs: `docker-compose logs`
- [ ] Set up Docker restart policy (already in docker-compose.yml)
- [ ] Configure Docker to start on system boot

### Option C: Cloud Deployment

- [ ] Choose cloud provider (AWS, GCP, Azure, Heroku, etc.)
- [ ] Set up cloud provider account and project
- [ ] Configure container registry (ECR, GCR, ACR, etc.)
- [ ] Build and push Docker image to registry
- [ ] Configure cloud deployment (ECS, GKE, AKS, etc.)
- [ ] Set environment variables in cloud dashboard
- [ ] Configure load balancer/API gateway
- [ ] Set up SSL certificates
- [ ] Configure cloud storage for logs and backups
- [ ] Set up monitoring in cloud dashboard
- [ ] Configure auto-scaling (if needed)

## SSL/TLS Certificate Setup

- [ ] Obtain SSL certificate (Let's Encrypt, commercial, or self-signed)
- [ ] Place certificate files in correct location: `/etc/letsencrypt/live/your-domain.com/`
- [ ] Set certificate paths in nginx.conf
- [ ] Test SSL: `openssl s_client -connect your-domain.com:443`
- [ ] Verify certificate with SSL Labs: https://www.ssllabs.com/ssltest/
- [ ] Set up auto-renewal for certificates (Let's Encrypt)
- [ ] Test certificate renewal: `certbot renew --dry-run`

## Service Verification

### Local Testing (Before Deployment)
- [ ] Build all modules: `bash scripts/build-prod.sh`
- [ ] Start services: `bash scripts/start-prod.sh`
- [ ] Access container app: http://localhost:3000
- [ ] Verify all modules load
- [ ] Check module federation is working
- [ ] Test all application features
- [ ] Check console for errors
- [ ] Stop services: `bash scripts/stop-prod.sh`

### Post-Deployment Verification
- [ ] SSH to server and start services
- [ ] Verify ports are listening: `netstat -tulpn | grep -E ':3000|:3001|:3002|:3003'`
- [ ] Test container app: `curl -I http://localhost:3000`
- [ ] Test module endpoints: `curl -I http://localhost:3001/remoteEntry.js`
- [ ] Test nginx reverse proxy: `curl -I http://your-domain.com`
- [ ] Check service status: `systemctl status primary-school` (if using systemd)
- [ ] Review service logs: `journalctl -u primary-school -f`
- [ ] Verify HTTPS works: `curl -I https://your-domain.com`
- [ ] Test from different network (verify no firewall issues)
- [ ] Run performance test (load testing)

## Database & Data

- [ ] Database is backed up before deployment
- [ ] Database migration scripts run successfully
- [ ] Data validation checks passed
- [ ] Test data seeding completed (if needed)
- [ ] Backup schedule configured
- [ ] Backup restoration tested

## Documentation

- [ ] README.md is up to date
- [ ] PRODUCTION.md reviewed and relevant
- [ ] DEPLOYMENT_SUMMARY.md reviewed
- [ ] Team has access to deployment documentation
- [ ] Runbook created for common issues
- [ ] Incident response plan documented

## Team & Training

- [ ] Team trained on new deployment process
- [ ] Team has access to monitoring dashboards
- [ ] On-call person assigned
- [ ] Escalation procedure documented
- [ ] Support contacts documented
- [ ] Maintenance windows scheduled and communicated

## Monitoring & Alerts

- [ ] Monitoring dashboards set up and accessible
- [ ] Alerts configured for:
  - [ ] High CPU usage
  - [ ] High memory usage
  - [ ] Service down/unreachable
  - [ ] Error rate high
  - [ ] Response time slow
- [ ] Log aggregation working
- [ ] Test alert by simulating issue

## Backup & Disaster Recovery

- [ ] Full backup of application data taken
- [ ] Backup stored in secure location (separate from production server)
- [ ] Backup restoration procedure documented
- [ ] Backup restoration tested successfully
- [ ] Backup schedule set up (daily recommended)
- [ ] Database backup configured
- [ ] Configuration backup configured

## Performance Testing

- [ ] Load testing completed with expected traffic volume
- [ ] Performance metrics documented:
  - [ ] Page load time < 2 seconds
  - [ ] API response time < 1 second
  - [ ] CPU usage < 80% under normal load
  - [ ] Memory usage stable
- [ ] Bottlenecks identified and addressed
- [ ] Cache strategy working as intended
- [ ] CDN configured (if using)

## Security Final Check

- [ ] OWASP Top 10 vulnerabilities reviewed
- [ ] Input validation implemented
- [ ] Output encoding implemented
- [ ] Authentication working correctly
- [ ] Authorization rules enforced
- [ ] Sensitive data properly encrypted
- [ ] API rate limiting configured
- [ ] DDoS protection enabled (if available)
- [ ] Security headers present and correct:
  - [ ] Strict-Transport-Security
  - [ ] X-Content-Type-Options
  - [ ] X-Frame-Options
  - [ ] X-XSS-Protection
  - [ ] Content-Security-Policy

## Post-Deployment Tasks

- [ ] Monitor application for 24-48 hours
- [ ] Check error logs for issues
- [ ] Monitor performance metrics
- [ ] Gather user feedback
- [ ] Document any issues encountered
- [ ] Create post-deployment report
- [ ] Schedule retrospective meeting
- [ ] Update status page (if applicable)
- [ ] Notify stakeholders of successful deployment

## Rollback Procedure (If Needed)

- [ ] Previous version backed up
- [ ] Rollback procedure tested
- [ ] Rollback time < 30 minutes
- [ ] Data migration reversible
- [ ] Communication plan for rollback
- [ ] All team members know rollback procedure

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| DevOps Lead | | | |
| Tech Lead | | | |
| QA Lead | | | |
| Manager | | | |

---

## Notes & Issues Encountered

(Document any issues and how they were resolved)

```
[Space for notes]
```

---

## Related Documents

- PRODUCTION.md - Detailed deployment guide
- PRODUCTION_QUICK_START.md - Quick reference
- DEPLOYMENT_SUMMARY.md - Overview and summary
- .env.example - Environment configuration template

---

**Last Updated**: February 14, 2026

**Version**: 1.0

**Status**: Ready for Production Deployment ✅

