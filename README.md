# Web3 Food Ordering DApp — Hybrid MERN + Blockchain

A high-performance Hybrid Decentralized Application combining 
the speed of traditional web tech with the security of 
blockchain payments. Accepts both Native ETH and ERC-20 USDC.

## Live Demo
[food-app-mern-base-omega.vercel.app](https://food-app-mern-base-omega.vercel.app)

---

## The Problem
In standard Web3 dApps, the frontend relies on `await tx.wait()` 
to confirm a transaction before updating the database.

If a user closes their browser mid-transaction:
- ❌Funds are deducted from their wallet
- ❌ Database remains stuck in **PENDING** forever
- ❌ Order is lost with no recovery

---

## The Solution: Server-Side Event-Driven Architecture

The frontend is entirely removed from the confirmation process.


```
User clicks "Pay"
       ↓
MongoDB saves order as PENDING
       ↓
MetaMask signs & broadcasts transaction
(User can safely close the browser here)
       ↓
Smart contract emits OrderPlaced event on Base Sepolia
       ↓
Alchemy Webhook catches the event → pushes to Express backend
       ↓
Backend verifies HMAC cryptographic signature
       ↓
MongoDB updates order status to PAID ✅
```



---

## Smart Contracts
| Contract | Network | Address |
|----------|---------|---------|
| Food Cart | Base Sepolia | [`0x778cF88af553e30DCa4398d7f8C118dC0D396aE9`](https://sepolia.basescan.org/address/0x778cF88af553e30DCa4398d7f8C118dC0D396aE9) |
| USDC Token | Base Sepolia | [`0x036CbD53842c5426634e7929541eC2318f3dCF7e`](https://sepolia.basescan.org/address/0x036CbD53842c5426634e7929541eC2318f3dCF7e) |

---

## Tech Stack

### Frontend (Off-Chain UI)
| Technology | Purpose |
|-----------|---------|
| React.js + Vite | Lightning-fast single-page UI |
| Tailwind CSS | Responsive, mobile-first design |
| Ethers.js | MetaMask ↔ Blockchain bridge |
| Cloudinary | High-speed product image delivery |

### Backend & Database (Off-Chain Logic)
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | API logic + webhook verification |
| MongoDB | Products, users, order state |
| Vercel | Frontend + backend hosting |

### Blockchain (On-Chain Settlement)
| Technology | Purpose |
|-----------|---------|
| Solidity | Smart contract payment logic |
| Base Sepolia (L2) | Low-gas Layer 2 testnet |
| Hardhat | Compile, test, deploy contracts |
| Alchemy | RPC node + Webhook infrastructure |
| IPFS / Pinata | Decentralized order metadata storage |

---

## Hybrid Data Strategy

### MongoDB stores (Off-Chain)
- User profiles — name, phone, delivery address
- Product catalog — items, prices, Cloudinary image URLs
- Order state machine — PENDING → PAID → DELIVERED
- Application logs — metadata for UI rendering

### Blockchain stores (On-Chain)
- IPFS hash — order metadata (items + quantities) as JSON
- Payment amount — exact ETH or USDC value
- Buyer address — customer's public wallet address
- Payment method — ETH (0) or USDC (1)
- Timestamp — immutable proof of transaction time
- Transaction hash — permanent receipt linked to MongoDB

---

## Security Features

| Feature | Implementation |
|---------|---------------|
| Webhook HMAC Verification | Backend validates hashed signature of every Alchemy webhook to prevent spoofing |
| CORS Protection | Backend locked to Vercel frontend origin only |
| Smart Contract Verification | Publicly verified on Basescan |
| Non-Custodial | Private keys never leave MetaMask |
| ERC-20 Security | Uses `approve` + `transferFrom` pattern for USDC |

---

## Performance
- Load tested to **18,000 req/min peak** throughput
- Averaging **3,000 req/min** under sustained load
- Tested using [Loader.io](https://loader.io)

---

## Run Locally

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

### Smart Contract
```bash
cd blockchain
npm install
npx hardhat compile
npx hardhat ignition deploy ./ignition/modules/Order.ts --network baseSepolia
```

### Environment Variables
```bash
# Backend .env
MONGODB_URI=your_mongodb_uri
ALCHEMY_WEBHOOK_SECRET=your_secret
CORS_ORIGIN= https://food-app-mern-base-omega.vercel.app/

# Frontend .env
VITE_BACKEND_URL= https://food-app-mern-base-backend.vercel.app/
VITE_CONTRACT_ADDRESS=0x778cF88af553e30DCa4398d7f8C118dC0D396aE9
VITE_USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
```

---

## Project Structure

```
FoodAppMernBase/
├── frontend/          # React + Vite + Tailwind
│   └── src/
│       ├── components/
│       └── pages/
├── backend/           # Node.js + Express
│   └── routes/
│       └── webhook.js
└── blockchain/        # Solidity + Hardhat
    └── contracts/
        └── Order.sol
```


---

## Author
**Huzaifa** — Web3 Full-Stack Engineer  
[Portfolio](https://portfolio-website-vr3v.vercel.app) · 
[GitHub](https://github.com/HuzaifaAslam99) · 
[LinkedIn](https://linkedin.com/in/huzaifa-aslam-4845152aa)
