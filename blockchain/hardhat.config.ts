import { defineConfig } from "hardhat/config";
// You must import the plugin object, not just the string
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
// import "@nomicfoundation/hardhat-toolbox-viem";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  // Pass the actual object here, NOT a string
  plugins: [hardhatToolboxViemPlugin],
  
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    baseSepolia: {
      type: "http", 
      url: `${process.env.ALCHEMY_API_KEY}`,
      chainId: 84532,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  verify: {
    etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY,
    },
  },
});

      // type: "http", 
