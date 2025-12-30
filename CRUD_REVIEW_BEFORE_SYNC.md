# Complete CRUD Review Before Database Sync

**Date:** 2024  
**Status:** 🔍 Pre-Sync Review

---

## 🎯 Objectives

1. Review all CRUD operations across the platform
2. Identify inactive buttons and features
3. Check for missing API endpoints
4. Verify Supabase integration completeness
5. Fix issues before database sync

---

## 📊 CRUD Operations Status

### ✅ Fully Integrated with Supabase

#### Users
- ✅ `GET /api/users` - List users (admin)
- ✅ `GET /api/users/:id` - Get user
- ⚠️ `PUT /api/users/:id` - Update user (needs Supabase update)
- ❌ `DELETE /api/users/:id` - Missing

#### Properties
- ✅ `GET /api/properties` - List properties
- ✅ `GET /api/properties/:id` - Get property
- ✅ `POST /api/properties` - Create property
- ✅ `PUT /api/properties/:id` - Update property
- ✅ `DELETE /api/properties/:id` - Delete property

#### Interests
- ✅ `GET /api/interests` - List interests
- ✅ `GET /api/interests/:id` - Get interest
- ✅ `POST /api/interests` - Create interest
- ✅ `PUT /api/interests/:id` - Update interest
- ✅ `DELETE /api/interests/:id` - Delete interest

#### Chats
- ✅ `GET /api/chats` - List chat sessions
- ✅ `POST /api/chats` - Create chat session
- ✅ `GET /api/chats/:id/messages` - Get messages
- ✅ `POST /api/chats/:id/messages` - Send message

#### Credits
- ✅ `GET /api/credits/bundles` - Get bundles
- ✅ `GET /api/credits/balance` - Get balance
- ✅ `POST /api/credits/purchase` - Purchase credits
- ✅ `GET /api/credits/transactions` - Get transactions

#### Notifications
- ✅ `GET /api/notifications` - Get notifications
- ✅ `POST /api/notifications` - Create notification
- ✅ `PUT /api/notifications` - Update notification
- ✅ `DELETE /api/notifications` - Delete notification

#### Groups
- ✅ `GET /api/groups` - List groups
- ✅ `POST /api/groups` - Create group
- ✅ `GET /api/groups/:id` - Get group
- ⚠️ `PUT /api/groups/:id` - Update group (needs Supabase update)
- ⚠️ `DELETE /api/groups/:id` - Delete group (needs Supabase update)
- ✅ `GET /api/groups/:id/messages` - Get messages
- ✅ `POST /api/groups/:id/messages` - Send message

#### Marketplace
- ✅ `GET /api/marketplace/offers` - List offers
- ✅ `POST /api/marketplace/offers` - Create offer
- ✅ `GET /api/marketplace/offers/:id` - Get offer
- ⚠️ `PUT /api/marketplace/offers/:id` - Update offer (needs Supabase update)
- ⚠️ `DELETE /api/marketplace/offers/:id` - Delete offer (needs Supabase update)

#### Watchlist
- ✅ `GET /api/watchlist` - Get watchlist
- ✅ `POST /api/watchlist` - Add to watchlist
- ✅ `DELETE /api/watchlist` - Remove from watchlist

#### Property Requests
- ✅ `GET /api/property-requests` - List requests
- ✅ `POST /api/property-requests` - Create request

#### KYC
- ✅ `POST /api/kyc/submit` - Submit KYC
- ✅ `POST /api/admin/kyc/review` - Review KYC

#### Gamification
- ✅ `GET /api/gamification/leaderboard` - Get leaderboard
- ⚠️ `GET /api/gamification/challenges` - List challenges (in-memory)
- ⚠️ `GET /api/gamification/quests` - List quests (in-memory)
- ⚠️ `GET /api/gamification/badges` - List badges (in-memory)
- ⚠️ `GET /api/gamification/territories` - List territories (in-memory)

#### Territories
- ⚠️ `GET /api/territories/locations` - List locations (in-memory)
- ⚠️ `POST /api/territories/locations` - Create location (in-memory)
- ⚠️ `GET /api/territories/locations/:id` - Get location (in-memory)
- ⚠️ `PUT /api/territories/locations/:id` - Update location (in-memory)
- ⚠️ `DELETE /api/territories/locations/:id` - Delete location (in-memory)

---

## 🚨 Issues Found

### 1. API Routes Still Using In-Memory Store

#### Critical (Need Before Sync)
- ⚠️ `api/users/[id].ts` - Update user (still in-memory)
- ⚠️ `api/groups/[id].ts` - Update/Delete group (still in-memory)
- ⚠️ `api/marketplace/offers/[id].ts` - Update/Delete offer (still in-memory)

#### Medium Priority
- ⚠️ `api/territories/locations/index.ts` - All operations (in-memory)
- ⚠️ `api/territories/locations/[id].ts` - All operations (in-memory)
- ⚠️ `api/gamification/challenges/index.ts` - All operations (in-memory)
- ⚠️ `api/gamification/quests/index.ts` - All operations (in-memory)
- ⚠️ `api/gamification/badges/index.ts` - All operations (in-memory)
- ⚠️ `api/gamification/territories/index.ts` - All operations (in-memory)

### 2. Missing DELETE Operations

- ❌ `DELETE /api/users/:id` - User deletion not implemented
- ❌ `DELETE /api/property-requests/:id` - Request deletion not implemented

### 3. Frontend Buttons Using Alerts (Not API Calls)

#### Territories Page
- ⚠️ `handleClaim` - Uses `alert()` instead of API call
- ⚠️ Missing: `/api/territories/claim` endpoint

#### Marketplace Page
- ⚠️ `handlePurchase` - Uses `alert()` instead of API call
- ⚠️ Missing: `/api/marketplace/offers/:id/purchase` endpoint

#### Admin Pages
- ⚠️ `AdminUsersPage` - `handleUserAction` uses `alert()`
- ⚠️ `AdminListingsPage` - `handleListingAction` uses `alert()`
- ⚠️ `AdminKYCPage` - `handleApprove/Reject` uses `alert()`
- ⚠️ `AdminFinancialsPage` - `handleApprovePayout` uses `alert()`
- ⚠️ `AdminModerationPage` - `handleAction` uses `alert()`
- ⚠️ `AdminReportsPage` - `handleGenerateReport` uses `alert()`
- ⚠️ `AdminAnalyticsPage` - `handleExport` uses `alert()`
- ⚠️ `AdminTerritoriesPage` - `handleEditTerritory` uses `alert()`

### 4. Missing API Endpoints

- ❌ `POST /api/territories/claim` - Claim territory
- ❌ `POST /api/marketplace/offers/:id/purchase` - Purchase offer
- ❌ `DELETE /api/users/:id` - Delete user
- ❌ `DELETE /api/property-requests/:id` - Delete request

### 5. TODO Comments Found

- ⚠️ `PaymentModal.tsx` - "TODO: Integrate with Paystack payment gateway"
- ⚠️ `AddListingPage.tsx` - Direct agent unlock needs API integration

---

## 🔧 Required Fixes Before Sync

### Priority 1: Critical API Routes (Must Fix)

1. **Update `api/users/[id].ts`**
   - Convert `handleGetUser` to Supabase
   - Convert `handleUpdateUser` to Supabase
   - Add `handleDeleteUser` with Supabase

2. **Update `api/groups/[id].ts`**
   - Convert `handleGetGroup` to Supabase
   - Convert `handleUpdateGroup` to Supabase
   - Convert `handleDeleteGroup` to Supabase

3. **Update `api/marketplace/offers/[id].ts`**
   - Convert `handleGetOffer` to Supabase
   - Convert `handleUpdateOffer` to Supabase
   - Convert `handleDeleteOffer` to Supabase

### Priority 2: Missing Endpoints

1. **Create `api/territories/claim.ts`**
   - POST endpoint to claim territory
   - Deduct credits
   - Create territory record

2. **Create `api/marketplace/offers/[id]/purchase.ts`**
   - POST endpoint to purchase offer
   - Deduct credits
   - Create collaboration/transaction

3. **Add DELETE to `api/users/[id].ts`**
   - Soft delete (mark as inactive)
   - Hard delete option for admin

4. **Add DELETE to `api/property-requests/index.ts`**
   - Allow seekers to delete their requests

### Priority 3: Frontend Integration

1. **TerritoriesPage**
   - Connect `handleClaim` to `/api/territories/claim`
   - Add loading states
   - Add error handling

2. **AgentMarketplacePage**
   - Connect `handlePurchase` to `/api/marketplace/offers/:id/purchase`
   - Add loading states
   - Add error handling

3. **Admin Pages**
   - Connect all action handlers to API endpoints
   - Replace alerts with proper API calls
   - Add loading states and error handling

---

## 📋 Checklist Before Sync

### API Routes
- [ ] Update `api/users/[id].ts` to Supabase
- [ ] Update `api/groups/[id].ts` to Supabase
- [ ] Update `api/marketplace/offers/[id].ts` to Supabase
- [ ] Create `api/territories/claim.ts`
- [ ] Create `api/marketplace/offers/[id]/purchase.ts`
- [ ] Add DELETE to `api/users/[id].ts`
- [ ] Add DELETE to `api/property-requests/index.ts`

### Frontend
- [ ] Connect TerritoriesPage to API
- [ ] Connect AgentMarketplacePage to API
- [ ] Connect AdminUsersPage to API
- [ ] Connect AdminListingsPage to API
- [ ] Connect AdminKYCPage to API
- [ ] Connect AdminFinancialsPage to API
- [ ] Connect AdminModerationPage to API
- [ ] Connect AdminReportsPage to API
- [ ] Connect AdminAnalyticsPage to API
- [ ] Connect AdminTerritoriesPage to API

### Testing
- [ ] Test all CRUD operations
- [ ] Test all button interactions
- [ ] Verify error handling
- [ ] Check loading states
- [ ] Validate data persistence

---

## 🎯 Summary

### Total Issues: 25+
- **Critical API Routes**: 3 need Supabase update
- **Missing Endpoints**: 4 need to be created
- **Frontend Alerts**: 10+ need API integration
- **Missing DELETE**: 2 operations

### Estimated Fix Time
- **Priority 1**: 2-3 hours
- **Priority 2**: 2-3 hours
- **Priority 3**: 3-4 hours
- **Total**: ~8-10 hours

---

## ✅ Next Steps

1. Fix Priority 1 issues (Critical API routes)
2. Create missing endpoints (Priority 2)
3. Connect frontend buttons (Priority 3)
4. Test all operations
5. Proceed with database sync

---

**Status**: Ready to fix issues before sync

