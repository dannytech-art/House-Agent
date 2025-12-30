# Advanced Phases (11-14) API Implementation

## 📋 Overview

This document covers the API implementation for Advanced Phases 11-14 of the Vilanow platform.

---

## ✅ Phase 11: Notifications System

### Endpoints

#### Get Notifications
```
GET /api/notifications
```
- **Query Parameters:**
  - `read` (boolean): Filter by read status
  - `type` (string): Filter by notification type
- **Response:** Array of user notifications (newest first)
- **Auth:** Required

#### Create Notification
```
POST /api/notifications
```
- **Body:**
  ```json
  {
    "targetUserId"?: string,
    "broadcast"?: boolean,
    "title": string,
    "message": string,
    "type": "info" | "success" | "warning" | "error" | "system",
    "metadata"?: object
  }
  ```
- **Auth:** Required (Admin for broadcasting or sending to others)
- **Response:** Created notification(s)

#### Update Notifications
```
PUT /api/notifications
```
- **Body:**
  ```json
  {
    "markAllAsRead": boolean,
    "notificationId"?: string,
    "read"?: boolean
  }
  ```
- **Auth:** Required
- **Response:** Updated notification(s)

#### Delete Notification
```
DELETE /api/notifications?id={id}&deleteAll={true|false}
```
- **Query Parameters:**
  - `id` (string): Notification ID
  - `deleteAll` (boolean): Delete all user's notifications
- **Auth:** Required
- **Response:** Deletion confirmation

#### Get Notification Preferences
```
GET /api/notifications/preferences
```
- **Auth:** Required
- **Response:** User notification preferences

#### Update Notification Preferences
```
PUT /api/notifications/preferences
```
- **Body:**
  ```json
  {
    "email"?: boolean,
    "push"?: boolean,
    "sms"?: boolean,
    "inApp"?: boolean,
    "types"?: {
      "interests"?: boolean,
      "messages"?: boolean,
      "deals"?: boolean,
      "system"?: boolean,
      "marketing"?: boolean
    }
  }
  ```
- **Auth:** Required
- **Response:** Updated preferences

### Notification Types
- `info`: General information
- `success`: Success messages
- `warning`: Warning messages
- `error`: Error messages
- `system`: System notifications

---

## ✅ Phase 12: Territories & Locations

### Endpoints

#### Get Locations
```
GET /api/territories/locations
```
- **Query Parameters:**
  - `area` (string): Filter by area name
  - `state` (string): Filter by state
  - `search` (string): Search across name, area, state
- **Response:** Array of locations
- **Auth:** Public (read access)

#### Create Location
```
POST /api/territories/locations
```
- **Body:**
  ```json
  {
    "name": string,
    "area": string,
    "state"?: string,
    "coordinates"?: { "lat": number, "lng": number },
    "boundaries"?: GeoJSON
  }
  ```
- **Auth:** Required (Admin only)
- **Response:** Created location

#### Get Location
```
GET /api/territories/locations/:id
```
- **Auth:** Public
- **Response:** Location details

#### Update Location
```
PUT /api/territories/locations/:id
```
- **Body:** Partial location data
- **Auth:** Required (Admin only)
- **Response:** Updated location

#### Delete Location
```
DELETE /api/territories/locations/:id
```
- **Auth:** Required (Admin only)
- **Response:** Deletion confirmation

### Location Structure
```typescript
{
  id: string;
  name: string;
  area: string;
  state: string;
  coordinates?: { lat: number; lng: number };
  boundaries?: GeoJSON;
  createdAt: string;
  updatedAt: string;
}
```

---

## ✅ Phase 13-14: CIU System

### Closable Deals

#### Get Closable Deals
```
GET /api/ciu/deals
```
- **Query Parameters:**
  - `status` (string): Filter by status (new, contacted, viewing-scheduled, closed)
  - `urgency` (string): Filter by urgency (high, medium, low)
  - `assignedTo` (string): Filter by assigned agent ID
- **Response:** Array of closable deals (sorted by urgency and probability)
- **Auth:** Required (Admin only)

#### Create Closable Deal
```
POST /api/ciu/deals
```
- **Body:**
  ```json
  {
    "propertyId": string,
    "agentId": string,
    "urgency"?: "high" | "medium" | "low",
    "closingProbability"?: number,
    "assignedTo"?: string,
    "responseTimeExceeded"?: boolean,
    "pricingInRange"?: boolean
  }
  ```
- **Auth:** Required (Admin or System)
- **Response:** Created deal

#### Get Closable Deal
```
GET /api/ciu/deals/:id
```
- **Auth:** Required (Admin only)
- **Response:** Deal details

#### Update Closable Deal
```
PUT /api/ciu/deals/:id
```
- **Body:** Partial deal data
- **Auth:** Required (Admin only)
- **Response:** Updated deal

### Vilanow Tasks

#### Get Vilanow Tasks
```
GET /api/ciu/tasks
```
- **Query Parameters:**
  - `status` (string): Filter by status
  - `priority` (string): Filter by priority
  - `assignedAgent` (string): Filter by assigned agent
- **Response:** Array of tasks (sorted by priority and deadline)
- **Auth:** Required (Admin sees all, agents see assigned)

#### Create Vilanow Task
```
POST /api/ciu/tasks
```
- **Body:**
  ```json
  {
    "dealId": string,
    "propertyTitle": string,
    "assignedAgent": string,
    "priority"?: "high" | "medium" | "low",
    "deadline"?: string,
    "notes"?: string[]
  }
  ```
- **Auth:** Required (Admin only)
- **Response:** Created task

#### Get Vilanow Task
```
GET /api/ciu/tasks/:id
```
- **Auth:** Required (Admin or assigned agent)
- **Response:** Task details

#### Update Vilanow Task
```
PUT /api/ciu/tasks/:id
```
- **Body:**
  ```json
  {
    "status"?: string,
    "addNote"?: string,
    "revenue"?: number
  }
  ```
- **Auth:** Required (Admin or assigned agent)
- **Response:** Updated task

### Risk Flags

#### Get Risk Flags
```
GET /api/ciu/risks
```
- **Query Parameters:**
  - `type` (string): Filter by risk type
  - `severity` (string): Filter by severity (high, medium, low)
  - `status` (string): Filter by status (pending, investigating, resolved, dismissed)
- **Response:** Array of risks (sorted by severity)
- **Auth:** Required (Admin only)

#### Create Risk Flag
```
POST /api/ciu/risks
```
- **Body:**
  ```json
  {
    "entityType": "property" | "user" | "interest" | etc.,
    "entityId": string,
    "type": "duplicate" | "fraud" | "collusion" | "abuse" | etc.,
    "severity": "high" | "medium" | "low",
    "evidence"?: any[],
    "description"?: string
  }
  ```
- **Auth:** Required (Admin or System)
- **Response:** Created risk flag

#### Get Risk Flag
```
GET /api/ciu/risks/:id
```
- **Auth:** Required (Admin only)
- **Response:** Risk details

#### Update Risk Flag
```
PUT /api/ciu/risks/:id
```
- **Body:**
  ```json
  {
    "status"?: "pending" | "investigating" | "resolved" | "dismissed",
    "resolutionNotes"?: string
  }
  ```
- **Auth:** Required (Admin only)
- **Response:** Updated risk flag

### Automation Rules

#### Get Automation Rules
```
GET /api/ciu/automation
```
- **Query Parameters:**
  - `enabled` (boolean): Filter by enabled status
- **Response:** Array of automation rules
- **Auth:** Required (Admin only)

#### Create Automation Rule
```
POST /api/ciu/automation
```
- **Body:**
  ```json
  {
    "name": string,
    "description"?: string,
    "condition": {
      "interestCount"?: { "gt": number },
      "responseTime"?: { "gt": number },
      // ... other conditions
    },
    "action": {
      "type": "flag_closable" | "assign_task" | etc.,
      "assignTo"?: string
    },
    "enabled"?: boolean,
    "priority"?: number
  }
  ```
- **Auth:** Required (Admin only)
- **Response:** Created rule

#### Get Automation Rule
```
GET /api/ciu/automation/:id
```
- **Auth:** Required (Admin only)
- **Response:** Rule details

#### Update Automation Rule
```
PUT /api/ciu/automation/:id
```
- **Body:** Partial rule data
- **Auth:** Required (Admin only)
- **Response:** Updated rule

#### Delete Automation Rule
```
DELETE /api/ciu/automation/:id
```
- **Auth:** Required (Admin only)
- **Response:** Deletion confirmation

---

## 📊 Data Models

### Closable Deal
```typescript
{
  id: string;
  propertyId: string;
  propertyTitle: string;
  agentId: string;
  agentName: string;
  highIntentInterests: number;
  totalInterests: number;
  responseTimeExceeded: boolean;
  pricingInRange: boolean;
  urgency: "high" | "medium" | "low";
  estimatedValue: number;
  closingProbability: number; // 0-100
  status: "new" | "contacted" | "viewing-scheduled" | "closed";
  assignedTo?: string;
  assignedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Vilanow Task
```typescript
{
  id: string;
  dealId: string;
  propertyTitle: string;
  assignedAgent: string;
  status: "assigned" | "in-progress" | "viewing-scheduled" | "closed" | "lost";
  priority: "high" | "medium" | "low";
  createdAt: string;
  deadline?: string;
  notes: Array<{ note: string; addedBy: string; addedAt: string }>;
  revenue: number;
}
```

### Risk Flag
```typescript
{
  id: string;
  entityType: string;
  entityId: string;
  type: string;
  severity: "high" | "medium" | "low";
  status: "pending" | "investigating" | "resolved" | "dismissed";
  evidence: any[];
  description: string;
  detectedBy: string;
  detectedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
}
```

### Automation Rule
```typescript
{
  id: string;
  name: string;
  description: string;
  condition: object; // Flexible condition structure
  action: object; // Flexible action structure
  enabled: boolean;
  priority: number;
  executionCount: number;
  lastExecutedAt?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}
```

---

## 🔐 Authorization

### Access Levels
- **Public:** Location listings (read-only)
- **User:** Own notifications, preferences
- **Agent:** Assigned tasks (read-only)
- **Admin:** All endpoints

---

## 📈 Statistics

- **Phase 11:** 6 endpoints
- **Phase 12:** 5 endpoints
- **Phase 13-14:** 16 endpoints
- **Total:** 27 endpoints

---

## 🚀 Next Steps

1. ✅ All API endpoints implemented
2. ⏳ Frontend integration
3. ⏳ Real-time notification delivery (WebSocket/SSE)
4. ⏳ Automated risk detection engine
5. ⏳ Rule execution engine
6. ⏳ Testing & validation

---

*Implementation Complete: December 13, 2024*
*Advanced Phases 11-14: ✅ Complete*

