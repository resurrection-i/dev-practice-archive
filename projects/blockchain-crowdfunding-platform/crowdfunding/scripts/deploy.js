// 部署脚本
const hre = require("hardhat");

async function main() {
  console.log("开始部署 CrowdFunding 智能合约...");

  // 获取合约工厂
  const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
  
  // 部署合约
  const crowdFunding = await CrowdFunding.deploy();
  
  // 等待合约部署确认
  await crowdFunding.waitForDeployment();
  
  // 获取合约地址
  const crowdFundingAddress = await crowdFunding.getAddress();
  console.log(`CrowdFunding 合约已部署到地址: ${crowdFundingAddress}`);
  
  // 将合约地址写入到前端配置
  const fs = require("fs");
  const path = require("path");
  
  // 创建合约配置
  const contractConfig = {
    address: crowdFundingAddress,
    abi: JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json"), 
        "utf8"
      )
    ).abi
  };
  
  // 确保目录存在
  const contractsDir = path.join(__dirname, "../frontend/src/contracts");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }
  
  // 保存合约配置
  fs.writeFileSync(
    path.join(contractsDir, "contractConfig.json"),
    JSON.stringify(contractConfig, null, 2)
  );
  console.log("合约配置已写入 frontend/src/contracts/contractConfig.json");
}

// 执行部署函数并处理错误
main().catch((error) => {
  console.error("部署过程发生错误:", error);
  process.exitCode = 1;
}); 