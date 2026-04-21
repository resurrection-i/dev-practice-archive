require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");

const DEFAULT_OPTIMIZER_RUNS = 200;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // 配置本地开发网络
      chainId: 31337,
      mining: {
        auto: true,
        interval: 1000
      }
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: {
        mnemonic: "test test test test test test test test test test test junk"
      }
      }
    },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test"
  },
  namedAccounts: {
    deployer: {
      default: 0,
      localhost: 0,
      1337: 0 // 显式指定 chainId 1337 的账户
    },
  },
  // 增强型配置
  mocha: {
    timeout: 40000 // 测试超时时间（毫秒）
  }
};