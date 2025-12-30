# Vilanow API - Enhancement Phases (6-10) Implementation

## ✅ Completed: Phases 6-10 API Endpoints

This document summarizes the API implementation for Enhancement Phases 6-10 of the Vilanow platform.

---

## 📊 Phase 6: Gamification System

### Endpoints

#### Challenges
- **GET** `/api/gamification/challenges` - Get challenges (filter by agentId, completed)
- **POST** `/api/gamification/challenges` - Create challenge (admin only)
- **GET** `/api/gamification/challenges/:id` - Get challenge by ID
- **PUT** `/api/gamification/challenges/:id` - Update challenge progress/complete

**Request Example (Create Challenge):**
```json
{
  "title": "Upload 10 Properties",
  "description": "Upload at least 10 properties this month",
  "type": "upload",
  "target": 10,
  "reward": {
    "xp": 500,
    "credits": 100,
    "badge": "upload-master"
  },
  "deadline": "2024-12-31T23:59:59Z",
  "agentId": "agent-123" // Optional, null = available to all
}
```

#### Quests
- **GET** `/api/gamification/quests` - Get quests (filter by userId, type, completed)
- **POST** `/api/gamification/quests` - Create quest (admin only)
- **GET** `/api/gamification/quests/:id` - Get quest by ID
- **PUT** `/api/gamification/quests/:id` - Update quest progress/complete

**Request Example (Create Quest):**
```json
{
  "title": "Daily Login",
  "description": "Log in for 7 consecutive days",
  "type": "daily",
  "target": 7,
  "reward": {
    "xp": 50,
    "credits": 10
  },
  "expiresAt": "2024-12-20T23:59:59Z"
}
```

#### Badges
- **GET** `/api/gamification/badges?agentId=agent-123` - Get agent badges
- **POST** `/api/gamification/badges` - Award badge (admin only)

**Request Example (Award Badge):**
```json
{
  "agentId": "agent-123",
  "badge": "top-seller"
}
```

#### Territories
- **GET** `/api/gamification/territories` - Get territories (filter by agentId, area)
- **POST** `/api/gamification/territories` - Assign territory (admin only)

**Request Example (Assign Territory):**
```json
{
  "agentId": "agent-123",
  "area": "Lekki",
  "dominance": 75,
  "rank": 1
}
```

#### Leaderboard
- **GET** `/api/gamification/leaderboard?sortBy=xp&limit=10` - Get leaderboard

**Query Parameters:**
- `sortBy`: 'xp' | 'credits' | 'listings' | 'deals'
- `limit`: number (default: 10)

---

## 🤝 Phase 7: Agent Marketplace

### Endpoints

#### Marketplace Offers
- **GET** `/api/marketplace/offers` - Get offers (filter by agentId, type, status)
- **POST** `/api/marketplace/offers` - Create offer (agent only)
- **GET** `/api/marketplace/offers/:id` - Get offer by ID
- **PUT** `/api/marketplace/offers/:id` - Update offer (accept/reject)
- **DELETE** `/api/marketplace/offers/:id` - Delete offer

**Request Example (Create Offer):**
```json
{
  "type": "lead", // 'lead', 'co-broking', 'access'
  "propertyId": "property-123",
  "description": "High-value lead in Lekki",
  "price": 500
}
```

**Request Example (Accept Offer):**
```json
{
  "status": "pending",
  "acceptedBy": "agent-456"
}
```

#### Collaborations
- **GET** `/api/marketplace/collaborations` - Get collaborations (filter by agentId, type, status)
- **POST** `/api/marketplace/collaborations` - Create collaboration (agent only)
- **GET** `/api/marketplace/collaborations/:id` - Get collaboration by ID
- **PUT** `/api/marketplace/collaborations/:id` - Update collaboration status

**Request Example (Create Collaboration):**
```json
{
  "type": "co-broking", // 'lead-exchange', 'co-broking', 'credit-transaction'
  "toAgent": "agent-456",
  "propertyId": "property-123",
  "credits": 500,
  "reason": "Co-broking agreement"
}
```

**Request Example (Complete Collaboration):**
```json
{
  "status": "completed"
}
```

---

## 💬 Phase 8: Group Communication

### Endpoints

#### Groups
- **GET** `/api/groups` - Get user's groups
- **POST** `/api/groups` - Create group
- **GET** `/api/groups/:id` - Get group by ID
- **PUT** `/api/groups/:id` - Update group (add/remove members, update details)
- **DELETE** `/api/groups/:id` - Delete group (admin/creator only)

**Request Example (Create Group):**
```json
{
  "name": "Lekki Agents",
  "description": "Group for agents in Lekki area",
  "avatar": "https://..."
}
```

**Request Example (Update Group - Add Member):**
```json
{
  "addMember": "user-456"
}
```

**Request Example (Update Group - Remove Member):**
```json
{
  "removeMember": "user-456"
}
```

#### Group Messages
- **GET** `/api/groups/:id/messages` - Get group messages
- **POST** `/api/groups/:id/messages` - Send message to group

**Request Example (Send Message):**
```json
{
  "message": "Hello group!",
  "type": "text" // 'text', 'image', 'document'
}
```

---

## 🛡️ Phase 9: Admin Tools & Moderation

### Endpoints

#### KYC Review
- **GET** `/api/admin/kyc/review` - Get pending KYC submissions (admin only)
- **POST** `/api/admin/kyc/review` - Review KYC (approve/reject) (admin only)

**Request Example (Review KYC):**
```json
{
  "agentId": "agent-123",
  "status": "verified", // 'verified' | 'rejected'
  "notes": "All documents verified successfully"
}
```

#### Flagged Content
- **GET** `/api/admin/flags` - Get flagged content (admin only, filter by entityType, status, severity)
- **POST** `/api/admin/flags` - Flag content
- **GET** `/api/admin/flags/:id` - Get flag by ID
- **PUT** `/api/admin/flags/:id` - Resolve/dismiss flag (admin only)

**Request Example (Flag Content):**
```json
{
  "entityType": "property", // 'property', 'user', 'interest', etc.
  "entityId": "property-123",
  "reason": "Suspected duplicate listing",
  "severity": "high", // 'high' | 'medium' | 'low'
  "evidence": ["url1", "url2"]
}
```

**Request Example (Resolve Flag):**
```json
{
  "status": "resolved",
  "notes": "Investigated and confirmed duplicate"
}
```

#### Admin Actions Log
- **GET** `/api/admin/actions` - Get admin action log (admin only, filter by adminId, action, entityType)
- **POST** `/api/admin/actions` - Log admin action (admin only)

**Request Example (Log Action):**
```json
{
  "action": "user_suspended",
  "entityType": "user",
  "entityId": "user-123",
  "details": {
    "reason": "Violation of terms",
    "duration": "30 days"
  }
}
```

#### System Settings
- **GET** `/api/admin/settings` - Get all settings (admin only)
- **GET** `/api/admin/settings?key=setting-key` - Get specific setting
- **POST** `/api/admin/settings` - Update setting (admin only)

**Request Example (Update Setting):**
```json
{
  "key": "paystack_public_key",
  "value": "pk_test_...",
  "description": "Paystack public API key"
}
```

---

## 📊 Phase 10: Analytics & Reporting

### Endpoints

#### Reports
- **GET** `/api/analytics/reports` - Get all reports (admin only)
- **POST** `/api/analytics/reports` - Generate report (admin only)

**Request Example (Generate Report):**
```json
{
  "type": "users", // 'users', 'properties', 'interests', 'financial'
  "parameters": {
    "dateRange": {
      "start": "2024-01-01",
      "end": "2024-12-31"
    }
  }
}
```

**Report Types:**
- `users` - User statistics, role breakdown, growth metrics
- `properties` - Property statistics, status breakdown, type distribution
- `interests` - Interest statistics, conversion rates
- `financial` - Transaction statistics, revenue, credit metrics

#### Metrics
- **GET** `/api/analytics/metrics?type=overview` - Get platform metrics (admin only)

**Query Parameters:**
- `type`: 'overview' | 'users' | 'properties' | 'conversions'

**Response Example (Overview):**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 2847,
      "agents": 342,
      "seekers": 2505
    },
    "properties": {
      "total": 1289,
      "active": 1150,
      "sold": 139
    },
    "interests": {
      "total": 5234,
      "pending": 123,
      "closed": 456
    },
    "financial": {
      "totalCredits": 125000,
      "totalTransactions": 890,
      "totalRevenue": 45000000
    }
  }
}
```

#### Analytics Events
- **POST** `/api/analytics/events` - Track event (public, requires userId)
- **GET** `/api/analytics/events` - Get events (admin only, filter by event, userId, dateRange)

**Request Example (Track Event):**
```json
{
  "userId": "user-123",
  "event": "property_view", // 'page_view', 'property_view', 'interest_created', etc.
  "entityType": "property",
  "entityId": "property-123",
  "metadata": {
    "location": "Lekki",
    "price": 50000000
  }
}
```

---

## 📋 Complete API Endpoint Summary

### Phase 6: Gamification (7 endpoints)
- ✅ Challenges (CRUD)
- ✅ Quests (CRUD)
- ✅ Badges (Read, Award)
- ✅ Territories (Read, Assign)
- ✅ Leaderboard (Read)

### Phase 7: Agent Marketplace (7 endpoints)
- ✅ Marketplace Offers (CRUD)
- ✅ Collaborations (CRUD)

### Phase 8: Group Communication (4 endpoints)
- ✅ Groups (CRUD)
- ✅ Group Messages (Read, Create)

### Phase 9: Admin Tools (8 endpoints)
- ✅ KYC Review (Read pending, Review)
- ✅ Flagged Content (CRUD)
- ✅ Admin Actions (Read, Log)
- ✅ System Settings (Read, Update)

### Phase 10: Analytics (4 endpoints)
- ✅ Reports (Read, Generate)
- ✅ Metrics (Read)
- ✅ Analytics Events (Track, Read)

**Total Enhancement Phases Endpoints: 30+ endpoints**

---

## 🔐 Authorization

All admin endpoints require:
- Authentication token in `Authorization: Bearer <token>` header
- User role must be `admin`

Gamification and Marketplace endpoints require:
- Authentication token
- User role must be `agent` (for creating/updating)

Group endpoints require:
- Authentication token
- User must be a member of the group (for messages)

---

## 📝 Response Format

All endpoints follow the standard response format:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

## 🚀 Integration with Frontend

The API client (`src/lib/api-client.ts`) can be extended with these endpoints:

```typescript
// Gamification
async getChallenges(params?: { agentId?: string, completed?: boolean }) {
  return this.request('/gamification/challenges', { params });
}

async createChallenge(challengeData: any) {
  return this.request('/gamification/challenges', {
    method: 'POST',
    body: JSON.stringify(challengeData),
  });
}

// Marketplace
async getMarketplaceOffers(params?: { type?: string, status?: string }) {
  return this.request('/marketplace/offers', { params });
}

// Groups
async getGroups() {
  return this.request('/groups');
}

async sendGroupMessage(groupId: string, message: string) {
  return this.request(`/groups/${groupId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

// Admin
async getPendingKYC() {
  return this.request('/admin/kyc/review');
}

async reviewKYC(agentId: string, status: string, notes?: string) {
  return this.request('/admin/kyc/review', {
    method: 'POST',
    body: JSON.stringify({ agentId, status, notes }),
  });
}

// Analytics
async generateReport(type: string, parameters?: any) {
  return this.request('/analytics/reports', {
    method: 'POST',
    body: JSON.stringify({ type, parameters }),
  });
}

async getMetrics(type: string = 'overview') {
  return this.request(`/analytics/metrics?type=${type}`);
}
```

---

## ✅ Implementation Status

All Enhancement Phases (6-10) are **complete** and ready for:
- ✅ Vercel deployment
- ✅ Frontend integration
- ✅ Supabase migration (when ready)

---

*Last Updated: December 13, 2024*
*Version: 1.0*

