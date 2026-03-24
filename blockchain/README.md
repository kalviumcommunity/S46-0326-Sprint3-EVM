# Blockchain Module (Mugunthan)

This module contains the smart contract and Hardhat setup for Sprint 3 EVM voting.

## Setup

1. Install dependencies:

   npm install

2. Copy env file:

   copy .env.example .env

3. Add valid Sepolia RPC URL and deployer private key in `.env`.

## Commands

- Compile:

  npm run compile

- Test:

  npm run test

- Deploy to Sepolia:

  npm run deploy:sepolia

## Contract Highlights

- One wallet can vote only once (`hasVoted` mapping).
- Candidate list is fixed at deployment time.
- Vote counts are public and transparent.
