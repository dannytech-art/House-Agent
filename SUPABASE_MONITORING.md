# Supabase Monitoring & Alerts Guide

## Overview

Monitor your Supabase project to ensure optimal performance, catch issues early, and maintain system health.

---

## Built-in Monitoring (Supabase Dashboard)

### 1. Database Performance

**Location**: Dashboard → Database → Performance

**Metrics Available**:
- Query Performance
- Slow Queries
- Connection Pool Usage
- Database Size
- Table Sizes
- Index Usage

**Action Items**:
- Monitor slow queries (>100ms)
- Check connection pool usage (should be <80%)
- Watch for unusual size growth

### 2. API Usage

**Location**: Dashboard → API → Usage

**Metrics Available**:
- API Requests (per day/hour)
- Bandwidth Usage
- Storage Usage
- Edge Function Invocations
- Error Rates

**Action Items**:
- Monitor request patterns
- Watch for sudden spikes
- Check error rates (should be <1%)

### 3. Auth Metrics

**Location**: Dashboard → Authentication → Usage

**Metrics Available**:
- Active Users
- Sign-ups per day
- Logins per day
- Failed Login Attempts
- Password Resets

**Action Items**:
- Monitor for suspicious login patterns
- Track user growth
- Watch for unusual password reset requests

---

## Setting Up Alerts

### 1. Database Alerts

#### Alert: High Database Usage

**Trigger**: Database size > 80% of plan limit

**Setup**:
1. Go to **Settings** → **Database**
2. Configure usage alerts
3. Set threshold at 80%
4. Add email notification

#### Alert: Slow Queries

**Trigger**: Query takes > 1 second

**Setup**:
1. Enable query logging
2. Set up log monitoring
3. Configure alerts via external service (DataDog, New Relic, etc.)

#### Alert: Connection Pool Exhaustion

**Trigger**: Connection pool usage > 90%

**Setup**:
1. Monitor connection pool metrics
2. Set up alerts in monitoring tool
3. Configure auto-scaling if needed

### 2. API Alerts

#### Alert: High Error Rate

**Trigger**: Error rate > 5%

**Setup**:
1. Go to **Settings** → **API**
2. Enable error tracking
3. Configure alert thresholds
4. Set up notifications

#### Alert: Rate Limit Approached

**Trigger**: API requests > 80% of limit

**Setup**:
1. Monitor API usage dashboard
2. Set up threshold alerts
3. Configure upgrade notifications

### 3. Auth Alerts

#### Alert: Suspicious Login Activity

**Trigger**: Multiple failed logins from same IP

**Setup**:
1. Go to **Authentication** → **Policies**
2. Enable rate limiting
3. Set up anomaly detection
4. Configure security alerts

---

## Custom Monitoring Solutions

### Option 1: Supabase + External Monitoring

#### Using Datadog

```typescript
// Install Datadog SDK
import { StatsD } from 'node-statsd';

const statsd = new StatsD({
  host: 'datadog-agent',
  port: 8125,
});

// Track API calls
statsd.increment('api.requests');
statsd.timing('api.response_time', responseTime);

// Track database queries
statsd.timing('db.query_time', queryTime);
statsd.increment('db.queries');
```

#### Using New Relic

```typescript
import newrelic from 'newrelic';

// Track transactions
newrelic.startWebTransaction('/api/properties', () => {
  // Your code here
  newrelic.endTransaction();
});

// Record metrics
newrelic.recordMetric('Custom/Properties/Created', 1);
```

### Option 2: Custom Monitoring API

Create monitoring endpoints:

```typescript
// api/monitoring/health.ts
import { getSupabase } from '../_lib/data-store';
import { success, errorResponse } from '../_lib/utils';

export default async function handler(request: Request) {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      return errorResponse('Supabase not configured', 503);
    }

    // Check database connection
    const { error: dbError } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (dbError) {
      return errorResponse('Database connection failed', 503);
    }

    // Check disk space (via query)
    const { error: spaceError } = await supabase
      .rpc('check_disk_space');

    const health = {
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };

    return success(health);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
```

### Option 3: Logging with LogRocket/Sentry

```typescript
// Install Sentry
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// Track errors
try {
  // Your code
} catch (error) {
  Sentry.captureException(error);
}

// Track performance
const transaction = Sentry.startTransaction({
  op: 'api',
  name: 'create_property',
});

// Your code

transaction.finish();
```

---

## Key Metrics to Monitor

### Database Metrics

1. **Query Performance**
   - Average query time
   - P95/P99 query times
   - Slow query count

2. **Connection Pool**
   - Active connections
   - Idle connections
   - Connection wait time

3. **Storage**
   - Database size
   - Table sizes
   - Growth rate

4. **Indexes**
   - Index usage
   - Missing indexes
   - Unused indexes

### API Metrics

1. **Request Volume**
   - Requests per minute/hour/day
   - Peak traffic times
   - Growth trends

2. **Response Times**
   - Average response time
   - P95/P99 response times
   - Error rates

3. **Error Tracking**
   - Error count by type
   - Error rate percentage
   - Failed request patterns

### Application Metrics

1. **User Activity**
   - Active users
   - New sign-ups
   - User retention

2. **Business Metrics**
   - Properties created
   - Interests expressed
   - Deals closed
   - Revenue (if applicable)

---

## Monitoring Dashboard

### Create Custom Dashboard

```typescript
// api/analytics/dashboard.ts
import { getSupabase } from '../../_lib/data-store';

export default async function handler(request: Request) {
  const supabase = getSupabase();
  if (!supabase) return errorResponse('Supabase not configured', 503);

  // Get key metrics
  const [
    usersCount,
    propertiesCount,
    interestsCount,
    transactionsCount,
  ] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('properties').select('id', { count: 'exact', head: true }),
    supabase.from('interests').select('id', { count: 'exact', head: true }),
    supabase.from('transactions').select('id', { count: 'exact', head: true }),
  ]);

  return success({
    users: usersCount.count || 0,
    properties: propertiesCount.count || 0,
    interests: interestsCount.count || 0,
    transactions: transactionsCount.count || 0,
    timestamp: new Date().toISOString(),
  });
}
```

---

## Alert Configuration Examples

### Email Alerts

```typescript
// utils/alerts.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  // Configure email service
});

export async function sendAlert(subject: string, message: string) {
  await transporter.sendMail({
    from: process.env.ALERT_EMAIL,
    to: process.env.ALERT_RECIPIENTS,
    subject: `[Vilanow Alert] ${subject}`,
    text: message,
  });
}
```

### Slack Alerts

```typescript
// utils/alerts.ts
export async function sendSlackAlert(message: string) {
  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message }),
  });
}
```

---

## Monitoring Best Practices

1. **Set Appropriate Thresholds**
   - Don't alert on every minor issue
   - Use progressive alerting (warning → critical)

2. **Monitor Trends**
   - Look for patterns over time
   - Set up trend-based alerts

3. **Regular Reviews**
   - Review metrics weekly
   - Adjust thresholds based on patterns
   - Remove unnecessary alerts

4. **Documentation**
   - Document all alerts
   - Keep runbooks for common issues
   - Maintain escalation procedures

5. **Test Alerts**
   - Test alert mechanisms regularly
   - Verify notification channels work
   - Ensure on-call rotation is current

---

## Recommended Monitoring Stack

### Free/Startup
- Supabase Dashboard (built-in)
- Sentry (error tracking)
- Uptime Robot (uptime monitoring)

### Growing Business
- Supabase Dashboard
- Datadog or New Relic
- Sentry
- PagerDuty (alerting)

### Enterprise
- Full observability stack
- Custom dashboards
- 24/7 monitoring team
- Advanced analytics

---

## Resources

- **Supabase Status**: https://status.supabase.com
- **Supabase Docs**: https://supabase.com/docs/guides/platform/metrics
- **Sentry**: https://sentry.io
- **Datadog**: https://www.datadoghq.com

---

**Proper monitoring ensures your Vilanow platform runs smoothly and issues are caught early.**

