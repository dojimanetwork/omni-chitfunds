// Required modules for Hardhat configuration
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

/**
 * Hardhat configuration
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  // Solidity compiler settings
  solidity: {
    compilers: [
      {
        version: "0.8.24", // Solidity compiler version
        settings: {
          optimizer: {
            enabled: true, // Enable optimization
            runs: 200, // Number of optimization runs
          },
          evmVersion: "paris",
          viaIR: true, // Use intermediate representation (IR) for compilation
        },
      },
    ],
  },

  defaultNetwork: "dojima_chain_testnet",

  // Network configurations for deploying contracts
  networks: {
    // Configuration for Dojima Chain Testnet
    dojima_chain_testnet: {
      url: "https://rpc-test-d11k.dojima.network", // RPC URL for the network
      chainId: 184, // Chain ID of the network
      // gasPrice: 2000000000, // Gas price in wei
      accounts: [
        process.env.PRIVATE_KEY, // Private key for deploying contracts
      ],
    },
    // Configuration for Holesky Ethereum testnet
    holesky_ethereum: {
      url: "https://eth-dev.h4s.dojima.network/",
      // url: 'https://ethereum-holesky.publicnode.com',  // If you want to use public node
      chainId: 17000,
      gasPrice: 2000000000,
      accounts: [process.env.PRIVATE_KEY],
    },
    // Configuration for Sepolia Ethereum testnet
    sepolia_ethereum: {
      url: "https://1rpc.io/sepolia",
      chainId: 11155111,
      accounts: [process.env.PRIVATE_KEY],
    },
    // Configuration for Binance Smart Chain testnet
    bsc_testnet: {
      url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545/",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
