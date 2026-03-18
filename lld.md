Low-Level Design (LLD)
1. System Overview

The system enables secure, transparent, and tamper-proof voting for academic councils. It combines a traditional web application with blockchain to ensure vote integrity while maintaining voter privacy.

Objectives

Ensure one-person-one-vote

Prevent tampering with results

Maintain voter anonymity

Provide transparency in results

2. Technology Stack (Free Tier)
Frontend

React (Vite)

Tailwind CSS

Zustand (state management)

Backend

Node.js with Express

MongoDB Atlas (free tier)

Blockchain

Ethereum Sepolia Testnet

Solidity smart contracts

Hardhat (development framework)

Ethers.js (interaction library)

Authentication

MetaMask wallet-based authentication

Optional: Email-based OTP using Nodemailer

Storage (Optional)

IPFS via Pinata (free tier)

3. System Architecture
Client (React)
    |
    v
Backend API (Node.js + Express)
    |
    v
MongoDB (User & Election Data)
    |
    v
Blockchain (Smart Contract)
4. Core Modules
4.1 User Module
Roles

Student

Admin (faculty/council members)

Schema
User {
  _id: ObjectId,
  name: String,
  email: String,
  studentId: String,
  walletAddress: String,
  role: "student" | "admin",
  hasVoted: Boolean,
  createdAt: Date
}
4.2 Election Module
Election {
  _id: ObjectId,
  title: String,
  description: String,
  candidates: [
    {
      id: String,
      name: String,
      department: String
    }
  ],
  startTime: Date,
  endTime: Date,
  contractAddress: String,
  status: "upcoming" | "active" | "ended"
}
4.3 Vote Module (Off-chain support)
Vote {
  _id: ObjectId,
  userId: ObjectId,
  electionId: ObjectId,
  transactionHash: String,
  createdAt: Date
}
5. Smart Contract Design (Solidity)
pragma solidity ^0.8.0;

contract Election {
    struct Candidate {
        string name;
        uint voteCount;
    }

    mapping(address => bool) public hasVoted;
    Candidate[] public candidates;

    constructor(string[] memory candidateNames) {
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate(candidateNames[i], 0));
        }
    }

    function vote(uint candidateIndex) public {
        require(!hasVoted[msg.sender], "Already voted");

        hasVoted[msg.sender] = true;
        candidates[candidateIndex].voteCount++;
    }

    function getVotes(uint index) public view returns (uint) {
        return candidates[index].voteCount;
    }

    function getCandidatesCount() public view returns (uint) {
        return candidates.length;
    }
}
6. API Design
6.1 Authentication APIs
POST /auth/register
POST /auth/login
POST /auth/wallet-login
6.2 Election APIs
POST /elections/create        (admin only)
GET  /elections
GET  /elections/:id
POST /elections/start         (admin only)
POST /elections/end           (admin only)
6.3 Voting API
POST /vote
Flow

User selects a candidate on frontend

Frontend triggers blockchain transaction via MetaMask

Smart contract records vote

Transaction hash returned

Backend stores transaction reference

7. Voting Workflow

User logs in (wallet or email)

Active elections are fetched from backend

User selects a candidate

MetaMask prompts transaction confirmation

Smart contract executes vote

Backend stores transaction hash

UI updates voting status

8. Security Design
Double Voting Prevention

Smart contract enforces hasVoted

Backend validates user vote status

Identity Verification

Student ID and college email validation

Optional wallet whitelisting

Privacy

Wallet addresses act as pseudonymous identifiers

No direct mapping exposed publicly

9. Folder Structure
Backend
backend/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── services/
 ├── middleware/
 ├── utils/
 └── app.js
Frontend
frontend/
 ├── components/
 ├── pages/
 ├── hooks/
 ├── store/
 ├── services/
 └── App.jsx
Blockchain
blockchain/
 ├── contracts/
 ├── scripts/
 ├── test/
 └── hardhat.config.js
10. Blockchain Integration

Using Ethers.js:

import { ethers } from "ethers";

const contract = new ethers.Contract(address, abi, signer);

await contract.vote(candidateIndex);
11. State Management (Zustand)
import { create } from "zustand";

const useStore = create((set) => ({
  user: null,
  elections: [],
  setUser: (user) => set({ user }),
}));
12. Admin Dashboard Features

Create elections

Add candidates

Start and end voting

View live results from blockchain

13. Deployment Strategy (Free)

Frontend: Vercel

Backend: Render or Railway

Database: MongoDB Atlas

Blockchain: Sepolia testnet

14. MVP Scope

Initial implementation should include:

User authentication

Election creation

Voting via smart contract

Displaying results

15. Future Enhancements

Zero-knowledge proof-based voting

NFT-based voting eligibility

Real-time updates using WebSockets

IPFS-based metadata storage

QR-based login system

16. Key Challenges

User onboarding for wallet usage

Gas fee handling (even on testnets)

Balancing anonymity with identity verification