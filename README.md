Website Link-> https://food-app-mern-base-omega.vercel.app

CryptoEats: MERN + Web3 Food Delivery
A high-performance Hybrid Decentralized Application (dApp) that combines the speed of traditional web tech with the security of blockchain payments.

The Stack
This project is built using a Modern Hybrid Architecture:

Frontend & Mobile
React.js & Vite: For a lightning-fast, single-page user interface.
Tailwind CSS: For a fully responsive, mobile-first UI design.
Ethers.js: The bridge between the browser's MetaMask Extension and the blockchain.
Cloudinary: Stored all product images on cloudinary

Backend & Database (Off-Chain)
Node.js & Express: Managing the API logic and order processing.
MongoDB: Stores "High-Frequency" data (Product catalogs, user profiles, and order history).
Vercel: Hosting for both Frontend and Backend with optimized edge functions.

Blockchain (On-Chain)
Solidity: Smart Contract logic for secure, trustless payments.
Base Sepolia (L2): A high-speed, low-gas Layer 2 testnet.
Hardhat: Development environment for compiling, testing, and deploying contracts.
Alchemy: High-performance RPC node for blockchain communication.

Hybrid Data Strategy
To ensure the app is both fast and secure, we split data storage into two layers:

1. What is stored in MongoDB? (Off-Chain)
User Profiles: Name, phone number, and physical delivery addresses.
Product Catalog: Food items, descriptions, prices, and image URLs.
Pending Orders: Temporary state of orders before payment is confirmed.
Application Logs: General metadata for UI rendering.

2. What is stored on the Blockchain? (On-Chain)
Order ID: A unique string mapped to the payment.
Payment Amount: The exact value of ETH or USDC sent.
Buyer Address: The public wallet address of the customer.
Payment Method: A flag identifying if the payment was in Native ETH (0) or USDC (1).
Timestamp: Immutable proof of when the transaction occurred.
Transaction Hash: The permanent "receipt" linked back to the MongoDB record.

Security Features
CORS Protection: Backend is locked to trust only the specific Vercel frontend origin.
Smart Contract Verification: Contract is verified on Etherscan for public auditing.
Non-Custodial: The platform never touches your Private Keys. All signing happens securely within the MetaMask extension.

ERC-20 Approval Flow: Uses the standard approve and transferFrom pattern for secure USDC transactions.
