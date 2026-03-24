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

### Elections (`/api/elections`)
- **GET** `/` - Get all elections (paginated, public)
- **GET** `/:id` - Get single election details (public)
- **GET** `/:id/results` - Get election results (public)
- **POST** `/create` - Create election (protected, admin only)
- **PUT** `/:id/start` - Start election (protected, admin only)
- **PUT** `/:id/end` - End election (protected, admin only)

### Votes (`/api/votes`)
- **POST** `/` - Cast vote (protected)
- **GET** `/election/:electionId` - Get votes for election (protected, admin/creator only)
- **GET** `/status/:transactionHash` - Check vote status (public)
- **PUT** `/:voteId/confirm` - Confirm vote transaction (protected, admin only)

## Response Format
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

### Election
- `title` - Election title
- `description` - Election description
- `candidates` - Array of candidates with vote counts
- `startTime` - When election starts
- `endTime` - When election ends
- `status` - pending | active | ended | archived
- `createdBy` - User ID of creator
- `voterCount` - Total number of votes
- `contractAddress` - Blockchain contract address (optional)

### Vote
- `electionId` - Reference to election
- `userId` - Reference to user who voted
- `candidateName` - Name of candidate voted for
- `transactionHash` - Blockchain transaction hash
- `status` - pending | confirmed | failed
- `walletAddress` - User's wallet address (optional)
- `blockNumber` - Block number where vote was recorded
- `gasUsed` - Gas used for transaction

## Next Steps
- Add input validation service
- Add error handling service
- Add blockchain integration service (ethers.js)
- Add transaction verification service
- Add comprehensive error handling and logging
- Write unit and integration tests
- Add rate limiting and security headers
