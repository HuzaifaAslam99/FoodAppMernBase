Website Link-> https://food-app-mern-base-omega.vercel.app

Web3 Food Cart DApp: MERN + Web3 Food Delivery

A high-performance Hybrid Decentralized Application (dApp) that combines the speed of traditional web tech with the security of blockchain payments. Accepts both Native ETH and ERC-20 USDC.

The Challenge
In standard Web3 dApps, the frontend relies on await tx.wait() to confirm a transaction before updating the database. If a user closes their browser or loses connection while the transaction is processing, the funds are deducted from their wallet, but the database remains stuck in "Pending".

The Solution: I architected a completely server-side, event-driven payment verification system. The frontend is entirely removed from the confirmation process:

User clicks "Pay" → MongoDB saves order as PENDING.
MetaMask handles the blockchain transaction (User can safely close the browser here).
Smart contract emits a OrderPlaced event on Base Sepolia.
Alchemy Webhook catches the event and pushes it to the Express backend.
Backend cryptographically verifies the webhook's hashed signature to prevent spoofing.
Backend securely updates MongoDB status to PAID.

The Stack
Built using a modern hybrid architecture to balance Web2 speed with Web3 security.
Pinata (IPFS): Decentralized storage for order metadata, ensuring data integrity while keeping gas costs low.

Frontend (Off-Chain UI)
React.js & Vite: Lightning-fast, single-page user interface.
Tailwind CSS: Fully responsive, mobile-first UI design.
Ethers.js: The bridge between the browser's MetaMask extension and the blockchain.
Cloudinary: Centralized cloud storage for high-speed product image delivery.

Backend & Database (Off-Chain Logic)
Node.js & Express: Managing API logic, webhook verification, and order processing.
MongoDB: Stores "High-Frequency" data (Product catalogs, user profiles, and order state).
Vercel: Hosting for both Frontend and Backend with optimized edge functions.

Blockchain (On-Chain Settlement)
Solidity: Smart contract logic for secure, trustless payments.
Base Sepolia (L2): High-speed, low-gas Layer 2 testnet.
Hardhat: Development environment for compiling, testing, and deploying contracts.
Alchemy: High-performance RPC node and Webhook infrastructure.

Hybrid Data Strategy
To ensure the app is both fast and secure, data storage is strictly split into two layers:

What is stored in MongoDB? (Off-Chain)
User Profiles: Name, phone number, and physical delivery addresses.
Product Catalog: Food items, descriptions, prices, and Cloudinary image URLs.
Order State Machine: Tracks orders (PENDING ➔ PAID ➔ DELIVERED).
Application Logs: General metadata for UI rendering.


⛓️ What is stored on the Blockchain? (On-Chain)
IPFS Hash (Metadata): Order details (items bought, quantities) are structured as JSON, uploaded to Pinata IPFS cloud service, and the resulting CID (hash) is stored permanently on-chain.
Payment Amount: The exact value of ETH or USDC sent.
Buyer Address: The public wallet address of the customer.
Payment Method: A flag identifying if the payment was Native ETH (0) or USDC (1).
Timestamp: Immutable proof of when the transaction occurred.
Transaction Hash: The permanent "receipt" linked back to the MongoDB record.

Security Features
Webhook HMAC Verification: Backend validates the hashed signature of every incoming Alchemy webhook to prevent malicious payload spoofing.
CORS Protection: Backend is locked to trust only the specific Vercel frontend origin.
Smart Contract Verification: Contract is publicly verified on Basescan for community auditing.
Non-Custodial: The platform never touches user Private Keys. All signing happens securely within MetaMask.
Standard ERC-20 Flow: Uses the secure approve and transferFrom pattern for USDC transactions.
