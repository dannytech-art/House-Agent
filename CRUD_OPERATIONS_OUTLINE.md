# Vilanow Platform - Complete CRUD Operations Outline

## 📋 Overview

This document outlines all Create, Read, Update, and Delete operations for every entity in the Vilanow real estate marketplace platform.

---

## 👥 USER MANAGEMENT

### 1. Users (Base Entity)
- **CREATE**
  - Register new user (seeker/agent)
  - Create admin user
  - Bulk import users (admin only)

- **READ**
  - Get user profile by ID
  - Get user by email/phone
  - List all users (admin)
  - Search users (name, email, phone)
  - Get user statistics

- **UPDATE**
  - Update profile (name, email, phone, avatar)
  - Update password
  - Update preferences
  - Activate/deactivate account
  - Change user role (admin only)

- **DELETE**
  - Delete user account
  - Soft delete (mark as inactive)
  - Permanent delete (admin only)

---

### 2. Agents

#### CREATE
- Register as agent (with KYC submission)
- Create agent profile
- Onboard direct agent
- Onboard semi-direct agent

#### READ
- Get agent profile
- Get agent dashboard data
- Get agent listings
- Get agent performance metrics
- Get agent territory information
- Get agent challenges/quests
- Get agent marketplace offers
- Get agent KYC status
- Search agents (name, location, tier)
- List top agents (leaderboard)

#### UPDATE
- Update agent profile
- Update agent type (direct/semi-direct)
- Update verification status
- Update KYC documents
- Update agent tier/level
- Update XP and credits
- Update territory dominance
- Activate/deactivate agent account
- Promote/demote agent tier (admin)

#### DELETE
- Delete agent account
- Remove agent from platform
- Archive agent data

---

### 3. House Seekers

#### CREATE
- Register as seeker
- Create seeker profile
- Submit property request
- Create watchlist

#### READ
- Get seeker profile
- Get seeker dashboard
- Get seeker interests
- Get seeker property requests
- Get seeker watchlist
- Get seeker saved contacts
- Get seeker viewing history
- Search seekers (admin)

#### UPDATE
- Update seeker profile
- Update preferences
- Update property request
- Update watchlist
- Update saved contacts
- Update trust level (admin)

#### DELETE
- Delete seeker account
- Remove property request
- Remove from watchlist
- Remove saved contact

---

### 4. Admins

#### CREATE
- Create admin account (super admin only)
- Create admin roles/permissions

#### READ
- Get admin dashboard
- Get admin activity logs
- List all admins
- Get admin permissions

#### UPDATE
- Update admin profile
- Update admin permissions
- Activate/deactivate admin

#### DELETE
- Remove admin access
- Delete admin account (super admin only)

---

## 🏠 PROPERTY MANAGEMENT

### 5. Properties/Listings

#### CREATE
- Create new listing (agent)
- Duplicate listing (with modifications)
- Import listings (bulk)
- Create featured listing
- Create premium listing

#### READ
- Get property by ID
- List all properties
- Search properties (filters: type, location, price, bedrooms, amenities)
- Get properties by agent
- Get properties by location
- Get featured properties
- Get recommended properties (AI matching)
- Get property analytics (views, interests)
- Get property duplicate detection results
- Get property AI analysis (price, match score)

#### UPDATE
- Update property details (title, description, price)
- Update property images/videos
- Update property amenities
- Update property status (available/pending/sold)
- Mark as featured/unfeatured
- Update property location
- Update property pricing
- Re-analyze with AI
- Mark/remove duplicate status
- Freeze/unfreeze listing (admin)
- Promote to premium (admin)

#### DELETE
- Delete listing
- Archive listing
- Remove from featured
- Bulk delete (admin)

---

### 6. Property Requests (Seeker)

#### CREATE
- Submit property request
- Create request from search

#### READ
- Get property requests by seeker
- Get all property requests (admin)
- Get matching properties for request
- Get request statistics

#### UPDATE
- Update property request criteria
- Update request status (active/fulfilled/expired)
- Mark request as fulfilled

#### DELETE
- Delete property request
- Cancel active request

---

## 💬 INTEREST & COMMUNICATION

### 7. Interests

#### CREATE
- Express interest in property
- Create interest from watchlist
- Bulk interest (admin - for testing)

#### READ
- Get interest by ID
- Get interests for property
- Get interests by seeker
- Get interests by agent
- Get interest statistics
- Get interest connection lifecycle
- Filter interests (status, date range)
- Get unresolved interests

#### UPDATE
- Update interest status (pending → contacted → viewing-scheduled → closed)
- Mark interest as unlocked (agent pays credits)
- Update seriousness score
- Add notes to interest
- Mark interest as responded
- Schedule viewing
- Close interest (deal completed)

#### DELETE
- Withdraw interest
- Delete interest (admin)
- Archive resolved interests

---

### 8. Chat Sessions

#### CREATE
- Create chat session (from interest)
- Create direct agent-seeker chat
- Create group chat

#### READ
- Get chat session by ID
- Get user's chat sessions
- Get chat messages
- Get unread messages count
- Search chat messages
- Get chat participants

#### UPDATE
- Mark messages as read
- Update chat session metadata
- Archive chat session
- Pin chat session

#### DELETE
- Delete chat session
- Delete chat messages
- Clear chat history

---

### 9. Chat Messages

#### CREATE
- Send text message
- Send property brief
- Schedule inspection (message type)
- Send document (message type)
- Send image/video

#### READ
- Get messages in chat
- Get message by ID
- Get unread messages
- Search messages
- Get message attachments

#### UPDATE
- Edit message (before read)
- Mark as read
- Mark as delivered
- Pin message

#### DELETE
- Delete message
- Delete for everyone
- Delete for self only

---

### 10. Groups

#### CREATE
- Create group
- Create property-based group
- Create agent collaboration group

#### READ
- Get group by ID
- Get user's groups
- Get group members
- Get group messages
- Get group settings

#### UPDATE
- Update group name/description
- Update group avatar
- Add/remove members
- Update member roles (admin/member)
- Update group settings

#### DELETE
- Delete group
- Leave group
- Remove member from group

---

### 11. Group Messages

#### CREATE
- Send message to group
- Send image to group
- Send document to group
- Send system message

#### READ
- Get group messages
- Get unread group messages
- Search group messages

#### UPDATE
- Edit message
- Mark as read
- Pin message

#### DELETE
- Delete message
- Delete for everyone

---

## 💰 FINANCIAL OPERATIONS

### 12. Credits

#### CREATE
- Purchase credit bundle
- Grant credits (admin - bonus/promotion)
- Award credits (quest completion)
- Award credits (challenge completion)
- Refund credits

#### READ
- Get user credits balance
- Get credit transaction history
- Get credit purchases
- Get credit consumption
- Get credit bundles
- Get credit analytics (admin)

#### UPDATE
- Update credit balance
- Adjust credits (admin)
- Update credit bundle pricing (admin)

#### DELETE
- Remove credit bundle (admin)
- Void credit transaction (admin)

---

### 13. Credit Bundles

#### CREATE
- Create credit bundle
- Create promotional bundle
- Import bundles (admin)

#### READ
- Get all credit bundles
- Get bundle by ID
- Get popular bundles
- Get bundle pricing

#### UPDATE
- Update bundle credits/price
- Update bundle bonus
- Mark as popular/unpopular
- Activate/deactivate bundle

#### DELETE
- Delete credit bundle
- Archive bundle

---

### 14. Transactions

#### CREATE
- Create credit purchase transaction
- Create credit spend transaction
- Create wallet load transaction
- Create wallet debit transaction
- Create refund transaction

#### READ
- Get transaction by ID
- Get user transactions
- Get transactions by type
- Get transactions by date range
- Get transaction statistics
- Export transactions (CSV)

#### UPDATE
- Update transaction status (pending → completed/failed)
- Mark as processed
- Add transaction notes
- Reverse transaction (admin)

#### DELETE
- Cancel pending transaction
- Void transaction (admin)

---

### 15. Wallet

#### CREATE
- Initialize wallet for user
- Create wallet transaction

#### READ
- Get wallet balance
- Get wallet transactions
- Get wallet history
- Get wallet statistics

#### UPDATE
- Update wallet balance
- Credit wallet
- Debit wallet
- Freeze wallet (admin)
- Unfreeze wallet (admin)

#### DELETE
- Close wallet (withdraw all funds)
- Archive wallet transactions

---

## 🎮 GAMIFICATION & ADVENTURE SYSTEM

### 16. Agent Challenges

#### CREATE
- Create challenge (system generated)
- Create custom challenge (admin)
- Create weekly challenge
- Create daily challenge

#### READ
- Get agent challenges
- Get challenge by ID
- Get challenge progress
- Get completed challenges
- Get available challenges
- Get challenge leaderboard

#### UPDATE
- Update challenge progress
- Complete challenge
- Claim challenge reward
- Update challenge deadline
- Activate/deactivate challenge

#### DELETE
- Remove challenge
- Cancel challenge

---

### 17. Quests

#### CREATE
- Create daily quest
- Create weekly quest
- Generate quests for user

#### READ
- Get user quests
- Get quest by ID
- Get quest progress
- Get completed quests
- Get available quests

#### UPDATE
- Update quest progress
- Complete quest
- Claim quest reward
- Extend quest deadline

#### DELETE
- Remove quest
- Cancel quest

---

### 18. Agent Tiers

#### CREATE
- Initialize agent tier (on registration)
- Create tier promotion

#### READ
- Get agent tier
- Get tier requirements
- Get tier benefits
- Get tier leaderboard
- Get tier statistics

#### UPDATE
- Promote agent tier
- Demote agent tier (admin)
- Update tier requirements (admin)
- Update tier benefits (admin)

#### DELETE
- Reset agent tier (admin)
- Remove tier (system)

---

### 19. Agent Territories

#### CREATE
- Assign territory to agent
- Create territory claim

#### READ
- Get agent territories
- Get territory by area
- Get territory dominance
- Get territory rankings
- Get territory statistics

#### UPDATE
- Update territory dominance
- Update territory rank
- Transfer territory (admin)
- Update territory boundaries (admin)

#### DELETE
- Remove territory assignment
- Release territory claim

---

### 20. Badges

#### CREATE
- Award badge to agent
- Create new badge (admin)
- Create achievement badge

#### READ
- Get agent badges
- Get all badges
- Get badge requirements
- Get badge statistics

#### UPDATE
- Update badge requirements (admin)
- Update badge design (admin)

#### DELETE
- Revoke badge
- Remove badge (admin)

---

## 🤝 AGENT MARKETPLACE

### 21. Marketplace Offers

#### CREATE
- Create lead exchange offer
- Create co-broking offer
- Create access offer
- Create offer from interest

#### READ
- Get marketplace offers
- Get offer by ID
- Get offers by agent
- Get offers by type
- Search marketplace offers
- Get offer details

#### UPDATE
- Update offer price
- Update offer status (active → pending → completed)
- Accept offer
- Reject offer
- Complete offer
- Flag offer (admin review)

#### DELETE
- Cancel offer
- Remove offer (admin)
- Archive completed offers

---

### 22. Agent Collaborations

#### CREATE
- Create collaboration request
- Create co-broking agreement
- Create lead exchange

#### READ
- Get collaborations
- Get collaboration by ID
- Get collaborations by agent
- Get collaboration history
- Get collaboration statistics (admin)

#### UPDATE
- Update collaboration status
- Approve collaboration
- Reject collaboration
- Complete collaboration
- Flag collaboration (admin)

#### DELETE
- Cancel collaboration
- Remove collaboration (admin)

---

## 🔍 SEARCH & DISCOVERY

### 23. Search Prompts

#### CREATE
- Create search prompt (from user input)
- Save search query
- Create search alert

#### READ
- Get search history
- Get saved searches
- Get search analytics (admin)
- Get popular searches
- Get search trends

#### UPDATE
- Update saved search
- Update search alert criteria

#### DELETE
- Delete search history
- Remove saved search
- Cancel search alert

---

### 24. Watchlist

#### CREATE
- Add property to watchlist
- Create watchlist folder

#### READ
- Get user watchlist
- Get watchlist by folder
- Get watchlist statistics

#### UPDATE
- Move property between folders
- Update watchlist folder name
- Reorder watchlist

#### DELETE
- Remove property from watchlist
- Delete watchlist folder
- Clear watchlist

---

### 25. Saved Contacts

#### CREATE
- Save agent contact
- Save direct agent contact
- Import contacts

#### READ
- Get saved contacts
- Get contact by ID
- Get contact notes

#### UPDATE
- Update contact notes
- Update contact tags
- Mark contact as favorite

#### DELETE
- Remove saved contact
- Delete contact notes

---

## 🛡️ ADMIN & MODERATION

### 26. KYC Documents

#### CREATE
- Submit KYC documents (agent)
- Upload KYC document (admin)
- Create KYC review

#### READ
- Get KYC documents by agent
- Get pending KYC reviews
- Get KYC document by ID
- Get KYC review history
- Search KYC documents

#### UPDATE
- Update KYC status (pending → verified/rejected)
- Approve KYC
- Reject KYC
- Request additional documents
- Update KYC verification notes

#### DELETE
- Delete KYC documents
- Archive KYC records

---

### 27. Flagged Content

#### CREATE
- Flag listing as duplicate
- Flag listing as inappropriate
- Flag user for review
- Auto-flag content (system)

#### READ
- Get flagged listings
- Get flagged users
- Get flag reasons
- Get flag history
- Get flag statistics

#### UPDATE
- Update flag status
- Resolve flag
- Dismiss flag
- Escalate flag
- Mark as investigated

#### DELETE
- Remove flag
- Archive resolved flags

---

### 28. Admin Actions

#### CREATE
- Create admin action (freeze, suspend, promote)
- Create moderation action
- Create automated action

#### READ
- Get admin action log
- Get actions by admin
- Get actions by entity
- Get action history
- Export action log

#### UPDATE
- Update action status
- Revert action
- Add action notes

#### DELETE
- Archive action log
- Delete action record (super admin)

---

### 29. System Settings

#### CREATE
- Create system setting
- Create feature flag
- Create automation rule

#### READ
- Get system settings
- Get setting by key
- Get feature flags
- Get automation rules

#### UPDATE
- Update system setting
- Enable/disable feature
- Update automation rule
- Update platform configuration
- Update payment settings (Paystack keys)

#### DELETE
- Remove system setting
- Delete feature flag
- Delete automation rule

---

## 📊 ANALYTICS & REPORTING

### 30. Reports

#### CREATE
- Generate user report
- Generate listing report
- Generate financial report
- Generate activity report
- Schedule automated report

#### READ
- Get report by ID
- Get report history
- Get report templates
- Download report (CSV/PDF)

#### UPDATE
- Update report parameters
- Regenerate report
- Update report schedule

#### DELETE
- Delete report
- Cancel scheduled report

---

### 31. Analytics Data

#### CREATE
- Record page view
- Record user action
- Record search query
- Record conversion event

#### READ
- Get analytics dashboard
- Get user analytics
- Get property analytics
- Get platform metrics
- Get conversion funnel
- Get retention metrics
- Export analytics data

#### UPDATE
- Update analytics configuration
- Update tracking settings

#### DELETE
- Delete analytics data (GDPR)
- Archive old analytics

---

## 🗺️ TERRITORIES & LOCATIONS

### 32. Territories

#### CREATE
- Create territory
- Assign territory to agent
- Create territory zone

#### READ
- Get all territories
- Get territory by area
- Get territory agents
- Get territory statistics
- Get territory boundaries

#### UPDATE
- Update territory name
- Update territory boundaries
- Update territory assignment
- Update territory settings

#### DELETE
- Delete territory
- Remove territory assignment
- Archive territory

---

### 33. Locations

#### CREATE
- Add new location
- Create location area
- Import locations (bulk)

#### READ
- Get all locations
- Get location by name
- Get location areas
- Search locations
- Get location statistics

#### UPDATE
- Update location details
- Update location boundaries
- Merge locations
- Update location hierarchy

#### DELETE
- Delete location
- Archive location

---

## 💬 NOTIFICATIONS

### 34. Notifications

#### CREATE
- Create notification
- Create system notification
- Create push notification
- Create email notification
- Create in-app notification

#### READ
- Get user notifications
- Get unread notifications
- Get notification by ID
- Get notification preferences
- Get notification history

#### UPDATE
- Mark notification as read
- Mark all as read
- Update notification preferences
- Update notification settings

#### DELETE
- Delete notification
- Clear notification history
- Delete all notifications

---

## 🎯 CIU (Central Intelligence Unit)

### 35. Closable Deals

#### CREATE
- Auto-detect closable deal
- Manually flag deal as closable
- Create deal assignment

#### READ
- Get closable deals
- Get deal by ID
- Get deal details
- Get deal statistics
- Filter deals (urgency, status)

#### UPDATE
- Update deal status
- Assign deal to Vilanow agent
- Update deal priority
- Update closing probability
- Mark deal as closed

#### DELETE
- Remove from closable deals
- Archive closed deals

---

### 36. Vilanow Tasks

#### CREATE
- Create task from closable deal
- Create manual task
- Create task assignment

#### READ
- Get Vilanow tasks
- Get task by ID
- Get tasks by agent
- Get tasks by status
- Get task statistics

#### UPDATE
- Update task status
- Assign task to agent
- Update task priority
- Add task notes
- Update task deadline
- Mark task as completed

#### DELETE
- Delete task
- Archive completed tasks

---

### 37. Risk Flags

#### CREATE
- Auto-detect risk
- Manually flag risk
- Create risk investigation

#### READ
- Get risk flags
- Get risk by ID
- Get risks by type
- Get risks by severity
- Get risk statistics

#### UPDATE
- Update risk status
- Resolve risk
- Dismiss risk
- Escalate risk
- Add risk evidence

#### DELETE
- Remove risk flag
- Archive resolved risks

---

### 38. Automation Rules

#### CREATE
- Create automation rule
- Create trigger condition
- Create action

#### READ
- Get automation rules
- Get rule by ID
- Get rule execution log
- Get rule statistics

#### UPDATE
- Update rule condition
- Update rule action
- Enable/disable rule
- Update rule priority

#### DELETE
- Delete rule
- Disable rule
- Archive rule

---

### 39. Audit Logs

#### CREATE
- Log admin action
- Log system action
- Log automated action

#### READ
- Get audit logs
- Get logs by user
- Get logs by action
- Get logs by date range
- Search audit logs
- Export audit logs

#### UPDATE
- Add log notes
- Update log metadata

#### DELETE
- Archive old logs
- Delete logs (super admin)

---

## 🔐 AUTHENTICATION & SECURITY

### 40. Sessions

#### CREATE
- Create user session (login)
- Create API session
- Create refresh token

#### READ
- Get active sessions
- Get session by token
- Validate session

#### UPDATE
- Refresh session
- Extend session
- Update session metadata

#### DELETE
- Logout (delete session)
- Revoke session
- Logout all devices
- Delete expired sessions

---

### 41. Password Resets

#### CREATE
- Request password reset
- Generate reset token
- Create reset link

#### READ
- Get reset token
- Validate reset token

#### UPDATE
- Update password (via reset)
- Mark token as used

#### DELETE
- Expire reset token
- Delete used tokens

---

## 📝 SUMMARY BY ROLE

### Admin CRUD Operations
- **Full access** to all entities
- User management (all roles)
- Content moderation
- System configuration
- Financial oversight
- Analytics & reporting
- KYC verification
- Risk management
- Automation rules

### Agent CRUD Operations
- **Property management**: Create, Read, Update, Delete own listings
- **Interest management**: Read, Update interests on own properties
- **Profile management**: Read, Update own profile
- **Credits**: Read balance, Purchase bundles, Read transactions
- **Marketplace**: Create offers, Read/Update/Delete own offers
- **Chat**: Create/Read/Update/Delete chat sessions and messages
- **Territories**: Read own territories
- **Challenges/Quests**: Read, Update progress, Complete
- **Analytics**: Read own listing analytics

### Seeker CRUD Operations
- **Property viewing**: Read all properties
- **Interests**: Create, Read, Update, Delete own interests
- **Profile**: Read, Update own profile
- **Watchlist**: Create, Read, Update, Delete watchlist items
- **Saved contacts**: Create, Read, Update, Delete saved agents
- **Property requests**: Create, Read, Update, Delete own requests
- **Chat**: Create/Read/Update/Delete chat sessions and messages
- **Quests**: Read, Update progress, Complete

---

## 🔄 CRUD OPERATION STATUS

### Implemented (Based on Codebase)
- ✅ User registration/login
- ✅ Property listing creation
- ✅ Interest creation
- ✅ Chat functionality
- ✅ Admin dashboard operations
- ✅ KYC submission/review

### To Be Implemented (Backend API Required)
- 🔨 All financial transactions (Credits, Wallet, Transactions)
- 🔨 Agent marketplace operations
- 🔨 Gamification system (Challenges, Quests, Tiers)
- 🔨 Territory management
- 🔨 Analytics & reporting
- 🔨 Notification system
- 🔨 CIU automation
- 🔨 Search & discovery optimization

---

## 📚 Notes

1. **Soft Delete**: Most entities support soft delete (marked as inactive/archived) rather than permanent deletion for data integrity.

2. **Audit Trail**: All admin actions and sensitive operations should be logged in the audit log.

3. **Permissions**: Each CRUD operation should check user role and permissions before execution.

4. **Validation**: All Create/Update operations should include input validation and sanitization.

5. **Rate Limiting**: Certain operations (like creating listings, expressing interests) should have rate limits to prevent abuse.

6. **Real-time Updates**: Critical operations (like interest creation, chat messages) should use real-time updates via WebSockets.

7. **Bulk Operations**: Admin operations should support bulk Create/Update/Delete for efficiency.

8. **Export Functionality**: Admin should be able to export data (CSV/PDF) for reporting and compliance.

---

*Last Updated: December 13, 2024*
*Version: 1.0*

