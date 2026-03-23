# Sprint 3 LLD Work Split

This split follows the LLD and divides MVP implementation equally across three members:

- Mugunthan: Blockchain core + on-chain voting integration
- Velavan: Backend APIs + database + auth
- Harini: Frontend UI + wallet UX + state management

## 1) Mugunthan (Blockchain Track)

### Ownership
- Implement Solidity election contract
- Add Hardhat project setup and tests
- Create deployment script for Sepolia
- Define contract ABI handoff for frontend/backend use
- Document on-chain data model and integration flow

### Mapped LLD Sections
- Section 5: Smart Contract Design
- Section 8 (partial): Double-voting prevention on-chain
- Section 9: Blockchain folder structure
- Section 10: Blockchain integration with Ethers.js
- Section 14 (partial): Voting via smart contract, displaying results

### Deliverables
- `blockchain/contracts/Election.sol`
- `blockchain/hardhat.config.js`
- `blockchain/scripts/deploy.js`
- `blockchain/test/Election.test.js`
- `blockchain/.env.example`
- `blockchain/README.md`

## 2) Velavan (Backend Track)

### Ownership
- Build Express app and route structure
- Implement auth APIs (`/auth/register`, `/auth/login`, `/auth/wallet-login`)
- Implement election APIs (`/elections/create`, `/elections`, `/elections/:id`, `/elections/start`, `/elections/end`)
- Implement vote API (`/vote`) storing transaction hash off-chain
- Add MongoDB models for User, Election, Vote
- Add admin-only middleware and validation

### Mapped LLD Sections
- Section 4.1, 4.2, 4.3: Core schemas
- Section 6: API Design
- Section 7 (partial): Store transaction hash + status updates
- Section 8 (partial): Identity verification + backend vote status checks
- Section 9: Backend folder structure
- Section 14 (partial): User auth + election creation

### Deliverables
- `backend/app.js`
- `backend/models/*.js`
- `backend/controllers/*.js`
- `backend/routes/*.js`
- `backend/middleware/*.js`
- `backend/services/*.js`

## 3) Harini (Frontend Track)

### Ownership
- Build React (Vite) app structure and routing
- Create login/register/wallet-connect flows
- Build election listing, voting screen, and results UI
- Integrate Zustand store for user and election state
- Integrate MetaMask transaction flow with clear UI feedback
- Build admin dashboard pages (create/start/end election, view results)

### Mapped LLD Sections
- Section 2: React + Tailwind + Zustand
- Section 3: Client architecture side
- Section 7: Voting workflow UX
- Section 11: State management
- Section 12: Admin dashboard features
- Section 14 (partial): Displaying results

### Deliverables
- `frontend/src/pages/*`
- `frontend/src/components/*`
- `frontend/src/store/useStore.js`
- `frontend/src/services/api.js`
- `frontend/src/services/web3.js`

## Equal Split Rationale
- Each member owns one major vertical with similar complexity.
- Each vertical has design + implementation + testing/documentation work.
- Dependencies are clean: blockchain contract first, backend consumes contract metadata, frontend consumes backend + wallet interactions.

## Suggested Sequence
1. Mugunthan finalizes contract + tests + deployment outputs (ABI, contract address).
2. Velavan wires backend with off-chain vote storage and election lifecycle.
3. Harini integrates frontend flows with backend APIs and MetaMask.
4. Team performs end-to-end integration and QA.
