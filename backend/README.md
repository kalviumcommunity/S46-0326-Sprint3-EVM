# EVM Voting Backend

Backend API for the blockchain-based voting system using Express.js and MongoDB.

## Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas connection string)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the server:
```bash
npm run dev  # Development with nodemon
npm start    # Production
```

## API Routes

### Authentication (`/api/auth`)
- **POST** `/register` - Register new user
- **POST** `/login` - Login with email/password
- **POST** `/wallet-login` - Login with MetaMask wallet
- **GET** `/me` - Get current logged-in user (protected)

### Response Format
All responses follow this format:
```json
{
  "success": true/false,
  "message": "Description",
  "data": {...}
}
```

## Architecture

```
backend/
├── models/          # Database schemas
├── controllers/     # Request handlers
├── routes/          # API route definitions
├── middleware/      # Custom middleware (auth, etc)
├── app.js          # Express app setup
└── package.json    # Dependencies
```

## Middleware

### `protect` - JWT Authentication
Validates JWT token from Authorization header. Usage:
```javascript
router.get('/protected-route', protect, controller);
```

### `adminOnly` - Admin Check
Requires admin privileges (use after protect):
```javascript
router.post('/admin-route', protect, adminOnly, controller);
```

## Models

### User
- `username` - Unique username
- `email` - Unique email
- `password` - Hashed password
- `walletAddress` - Ethereum wallet (optional)
- `isAdmin` - Admin flag
- `hasVoted` - Voting status

## Next Steps
- Implement Election CRUD APIs
- Implement Vote API with transaction hash storage
- Add admin election management endpoints
- Add tests
