# Vilanow Backend API

Complete CRUD API implementation for Phases 1-5 (MVP).

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm)

### Setup

1. **Install dependencies**
```bash
cd backend
pnpm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Initialize data**
```bash
pnpm run seed
```

4. **Start development server**
```bash
pnpm dev
```

The API will be available at `http://localhost:3000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── models/           # Data models
│   ├── services/         # Business logic
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── utils/            # Utility functions
│   └── types/            # TypeScript types
├── data/                 # JSON data storage
├── .env.example          # Environment template
└── package.json
```

## 📡 API Endpoints

### Authentication (Phase 1)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users (Phase 1)
- `GET /api/users` - List users (admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Properties (Phase 2)
- `GET /api/properties` - List properties
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create property (agent)
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Property Requests (Phase 2)
- `GET /api/property-requests` - List requests
- `GET /api/property-requests/:id` - Get request by ID
- `POST /api/property-requests` - Create request (seeker)
- `PUT /api/property-requests/:id` - Update request
- `DELETE /api/property-requests/:id` - Delete request

### Watchlist (Phase 2)
- `GET /api/watchlist` - Get user watchlist
- `POST /api/watchlist` - Add to watchlist
- `DELETE /api/watchlist/:propertyId` - Remove from watchlist

### Agents (Phase 3)
- `GET /api/agents` - List agents
- `GET /api/agents/:id` - Get agent by ID
- `PUT /api/agents/:id` - Update agent
- `GET /api/agents/:id/dashboard` - Get agent dashboard

### KYC (Phase 3)
- `POST /api/kyc` - Submit KYC documents
- `GET /api/kyc/:agentId` - Get KYC status
- `PUT /api/kyc/:agentId/approve` - Approve KYC (admin)
- `PUT /api/kyc/:agentId/reject` - Reject KYC (admin)

### Interests (Phase 4)
- `GET /api/interests` - List interests
- `GET /api/interests/:id` - Get interest by ID
- `POST /api/interests` - Express interest
- `PUT /api/interests/:id` - Update interest
- `DELETE /api/interests/:id` - Withdraw interest

### Chat (Phase 4)
- `GET /api/chats` - List chat sessions
- `GET /api/chats/:id` - Get chat session
- `POST /api/chats` - Create chat session
- `GET /api/chats/:id/messages` - Get messages
- `POST /api/chats/:id/messages` - Send message

### Credits (Phase 5)
- `GET /api/credits/balance` - Get credit balance
- `GET /api/credits/bundles` - Get credit bundles
- `POST /api/credits/purchase` - Purchase credits
- `GET /api/credits/transactions` - Get transaction history

### Wallet (Phase 5)
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/fund` - Fund wallet
- `GET /api/wallet/transactions` - Get wallet transactions

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## 📝 Data Storage

Currently uses JSON file storage for development. Can be easily migrated to:
- PostgreSQL
- MongoDB
- Supabase
- Any other database

## 🧪 Testing

```bash
pnpm test
```

## 📚 Documentation

See individual route files for detailed endpoint documentation.

