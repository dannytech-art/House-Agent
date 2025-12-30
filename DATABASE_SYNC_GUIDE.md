# Database Sync & Testing Guide

**Date:** 2024  
**Status:** Ready for Database Sync

---

## 🎯 Overview

This guide will help you:
1. Clear existing data (if any)
2. Sync database schema
3. Insert test data
4. Test CRUD operations

---

## 📋 Prerequisites

1. ✅ Supabase project created
2. ✅ Environment variables configured
3. ✅ Database schema created (`database/schema.sql`)
4. ✅ All API routes updated to use Supabase

---

## 🔄 Step-by-Step Database Sync

### Step 1: Clear Database (Optional)

If you have existing test data and want to start fresh:

1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `database/clear_and_prepare.sql`
3. Paste and run in SQL Editor
4. Verify all tables are empty

**⚠️ Warning:** This deletes ALL data. Only use in development/staging.

### Step 2: Verify Schema

1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `database/schema.sql`
3. Paste and run in SQL Editor
4. Verify all tables are created successfully

**Note:** If tables already exist, you may see errors. This is normal - the schema uses `CREATE TABLE IF NOT EXISTS`.

### Step 2.5: Create Password Verification Function

1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `database/verify_password_function.sql`
3. Paste and run in SQL Editor
4. This creates an RPC function for bcrypt password verification

**Important:** This function is required for test data passwords to work correctly.

### Step 3: Insert Test Data

1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `database/test_crud_data.sql`
3. Paste and run in SQL Editor
4. Verify data inserted successfully

You should see:
- 6 users (1 admin, 3 agents, 2 seekers)
- 4 credit bundles
- 5 properties
- 5 locations
- 3 interests
- 2 chat sessions
- 2 transactions

### Step 4: Enable Realtime (If Not Done)

1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `database/enable_realtime.sql`
3. Paste and run in SQL Editor

---

## 🧪 Testing CRUD Operations

### Test 1: User CRUD

#### Create User (Register)
```bash
POST /api/auth/register
{
  "email": "test@example.com",
  "password": "Test123!",
  "name": "Test User",
  "phone": "+234 800 000 0000",
  "role": "seeker"
}
```

#### Read User
```bash
GET /api/users/{user-id}
Authorization: Bearer {token}
```

#### Update User
```bash
PUT /api/users/{user-id}
Authorization: Bearer {token}
{
  "name": "Updated Name"
}
```

#### Delete User (Soft Delete)
```bash
DELETE /api/users/{user-id}
Authorization: Bearer {token}
{
  "hardDelete": false
}
```

### Test 2: Property CRUD

#### Create Property
```bash
POST /api/properties
Authorization: Bearer {token}
{
  "title": "Test Property",
  "type": "apartment",
  "price": 100000000,
  "location": "Lekki",
  "area": "Lekki Phase 1",
  "bedrooms": 3,
  "bathrooms": 2,
  "description": "Test property description"
}
```

#### Read Properties
```bash
GET /api/properties
```

#### Update Property
```bash
PUT /api/properties/{property-id}
Authorization: Bearer {token}
{
  "price": 120000000
}
```

#### Delete Property
```bash
DELETE /api/properties/{property-id}
Authorization: Bearer {token}
```

### Test 3: Credits & Transactions

#### Get Balance
```bash
GET /api/credits/balance
Authorization: Bearer {token}
```

#### Purchase Credits
```bash
POST /api/credits/purchase
Authorization: Bearer {token}
{
  "bundleId": "bundle-001"
}
```

#### Get Transactions
```bash
GET /api/credits/transactions
Authorization: Bearer {token}
```

### Test 4: Territory Claiming

#### Claim Territory
```bash
POST /api/territories/claim
Authorization: Bearer {token}
{
  "area": "Victoria Island",
  "cost": 200,
  "state": "Lagos",
  "dailyIncome": 15
}
```

### Test 5: Marketplace

#### Create Offer
```bash
POST /api/marketplace/offers
Authorization: Bearer {token}
{
  "type": "lead",
  "description": "Serious buyer looking for property",
  "price": 50
}
```

#### Purchase Offer
```bash
POST /api/marketplace/offers/{offer-id}/purchase
Authorization: Bearer {token}
```

---

## ✅ Verification Checklist

### Database
- [ ] All tables created
- [ ] Test data inserted
- [ ] Realtime enabled
- [ ] Row Level Security configured

### API Endpoints
- [ ] User CRUD working
- [ ] Property CRUD working
- [ ] Credits operations working
- [ ] Territory claiming working
- [ ] Marketplace operations working

### Frontend
- [ ] Buttons connected to API
- [ ] Loading states working
- [ ] Error handling working
- [ ] Success messages showing

---

## 🐛 Troubleshooting

### Issue: "Table already exists"
**Solution:** This is normal if schema was already run. Tables won't be recreated.

### Issue: "Foreign key constraint violation"
**Solution:** Make sure to insert data in correct order (users first, then dependent tables).

### Issue: "Authentication failed"
**Solution:** 
1. Check JWT_SECRET in environment variables
2. Verify token is being sent in Authorization header
3. Check user exists in database

### Issue: "Insufficient credits"
**Solution:** 
1. Check user's credit balance
2. Verify credit bundles exist
3. Test credit purchase first

---

## 📊 Expected Test Results

After running all tests, you should have:

- **Users**: 7+ (6 test + any created during testing)
- **Properties**: 5+ (5 test + any created during testing)
- **Interests**: 3+ (3 test + any created during testing)
- **Transactions**: 2+ (2 test + any created during testing)
- **Territories**: 0+ (depends on claims)
- **Marketplace Offers**: 0+ (depends on offers created)

---

## 🚀 Next Steps

1. ✅ Database synced
2. ✅ Test data inserted
3. ✅ CRUD operations tested
4. ⏭️ Frontend testing
5. ⏭️ Integration testing
6. ⏭️ Performance testing

---

## 📝 Notes

- All test data uses predictable IDs for easy reference
- Test users have simple passwords (change in production)
- Credit bundles are pre-configured
- Properties are in Lagos area
- All timestamps use NOW() for current time

---

**Status**: Ready to sync and test! 🎉

