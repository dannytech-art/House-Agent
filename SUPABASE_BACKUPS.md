# Supabase Database Backups Guide

## Overview

Supabase provides automatic daily backups for all projects. This guide covers backup configuration, restoration, and best practices.

---

## Automatic Backups

### Free Tier
- **Backup Frequency**: Daily
- **Retention**: 7 days
- **Storage**: Included
- **Location**: Same region as your project

### Pro Tier ($25/month)
- **Backup Frequency**: Daily
- **Retention**: 7 days (configurable up to 30 days)
- **Point-in-Time Recovery**: Available
- **Storage**: Included

### Team Tier ($599/month)
- **Backup Frequency**: Daily + Point-in-Time Recovery
- **Retention**: Configurable
- **Multiple Regions**: Supported
- **Custom Backup Schedules**: Available

---

## Accessing Backups

### Via Supabase Dashboard

1. **Go to Project Settings**
   - Navigate to your Supabase project
   - Click **Settings** → **Database**

2. **View Backups**
   - Scroll to **Backups** section
   - See list of available backups
   - Each backup shows:
     - Date and time
     - Status (completed/failed)
     - Size
     - Restore option

3. **Manual Backup**
   - Click **Create Backup** (if available on your plan)
   - Name your backup
   - Wait for completion

### Via Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# List backups
supabase backups list --project-ref your-project-ref

# Create backup
supabase backups create --project-ref your-project-ref
```

---

## Restoring from Backup

### Via Dashboard

1. **Go to Database Backups**
   - Settings → Database → Backups

2. **Select Backup**
   - Click on the backup you want to restore
   - Click **Restore**

3. **Confirm Restoration**
   - ⚠️ **Warning**: This will overwrite current database
   - Type project name to confirm
   - Click **Restore Database**

### Via CLI

```bash
# Restore from backup
supabase backups restore \
  --project-ref your-project-ref \
  --backup-id backup-id-here
```

---

## Point-in-Time Recovery (Pro+)

Point-in-Time Recovery (PITR) allows restoration to any specific timestamp.

### Enable PITR

1. Go to **Settings** → **Database**
2. Enable **Point-in-Time Recovery**
3. Configure retention period

### Restore to Point in Time

1. Go to **Database** → **Backups**
2. Click **Restore to Point in Time**
3. Select date and time
4. Confirm restoration

---

## Manual Backup Strategy

### Using pg_dump

For additional backup control, use PostgreSQL's `pg_dump`:

```bash
# Install PostgreSQL client tools
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql-client

# Connect and dump
pg_dump \
  -h db.your-project.supabase.co \
  -U postgres \
  -d postgres \
  -F c \
  -f backup_$(date +%Y%m%d_%H%M%S).dump

# Restore
pg_restore \
  -h db.your-project.supabase.co \
  -U postgres \
  -d postgres \
  backup_file.dump
```

### Automated Script

Create `scripts/backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR

pg_dump \
  -h $SUPABASE_DB_HOST \
  -U $SUPABASE_DB_USER \
  -d postgres \
  -F c \
  -f "$BACKUP_DIR/backup_$DATE.dump"

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.dump" -mtime +30 -delete

echo "Backup completed: backup_$DATE.dump"
```

---

## Backup Best Practices

### 1. Regular Testing
- Test restoration process monthly
- Verify backup integrity
- Document restoration steps

### 2. Multiple Locations
- Store backups in multiple locations
- Use cloud storage (S3, Google Cloud, etc.)
- Keep local copies for critical data

### 3. Backup Before Major Changes
- Always backup before:
  - Schema migrations
  - Data migrations
  - Major updates
  - Bulk data operations

### 4. Monitor Backup Status
- Set up alerts for backup failures
- Check backup logs regularly
- Verify backup sizes (should be consistent)

### 5. Document Procedures
- Document backup/restore procedures
- Keep credentials secure
- Maintain backup schedule documentation

---

## Backup Verification Checklist

- [ ] Backups are running daily
- [ ] Backups complete successfully
- [ ] Backup size is reasonable (not too small/large)
- [ ] Can restore from backup successfully
- [ ] Backup includes all tables
- [ ] Data integrity verified after restore
- [ ] Backup retention period is appropriate
- [ ] Multiple backup locations configured

---

## Disaster Recovery Plan

### Immediate Response (0-1 hour)
1. Assess damage scope
2. Stop any ongoing operations
3. Notify team
4. Access latest backup

### Short Term (1-24 hours)
1. Restore from latest backup
2. Verify data integrity
3. Test critical functionality
4. Monitor system stability

### Long Term (24+ hours)
1. Investigate root cause
2. Implement preventive measures
3. Update backup procedures
4. Document lessons learned

---

## Monitoring Backups

### Supabase Dashboard
- Check **Settings** → **Database** → **Backups** regularly
- Set up email notifications (if available)

### Custom Monitoring

Create a monitoring script:

```typescript
// scripts/check-backups.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function checkBackups() {
  // Query latest backup status
  const { data, error } = await supabase
    .from('backup_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Backup check failed:', error);
    // Send alert
  }

  // Verify backup is recent (within 24 hours)
  const lastBackup = data?.[0];
  if (lastBackup) {
    const hoursSince = (Date.now() - new Date(lastBackup.created_at).getTime()) / (1000 * 60 * 60);
    if (hoursSince > 24) {
      console.warn('Backup is older than 24 hours!');
      // Send alert
    }
  }
}
```

---

## Backup Retention Policy

### Recommended Retention

- **Daily Backups**: Keep 30 days
- **Weekly Backups**: Keep 12 weeks (3 months)
- **Monthly Backups**: Keep 12 months (1 year)
- **Yearly Backups**: Keep indefinitely

### Automatic Cleanup

Configure automatic cleanup in Supabase or use scheduled jobs to delete old backups.

---

## Cost Considerations

### Free Tier
- Included backups (7 days retention)
- No additional cost

### Pro Tier
- Included backups (configurable retention)
- Point-in-Time Recovery included
- Additional storage may incur costs

### Team Tier
- All backup features included
- Custom backup schedules
- Multiple region backups

---

## Support

- **Supabase Docs**: https://supabase.com/docs/guides/platform/backups
- **Support**: support@supabase.com
- **Community**: https://github.com/supabase/supabase/discussions

---

**Regular backups are critical for data safety. Follow this guide to ensure your Vilanow platform data is always protected.**

