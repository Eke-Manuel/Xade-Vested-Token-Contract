require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "Mumbai",
  networks: {
    hardhat: {
    },
    Mumbai: {
      url: process.env.MUMBAI_URL,
      accounts : [ process.env.MNEMONIC ]
    },
    PolygonPoS: {
      url: process.env.POLYGON_URL,
      accounts : [ process.env.MNEMONIC ]
    }

    
  },
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    },
  },

  etherscan: {
    apiKey: process.env.API_KEY,
  },
  mocha: {
    timeout: 40000
  }
}
