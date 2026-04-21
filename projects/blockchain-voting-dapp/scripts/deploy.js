// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("部署合约的账户:", deployer.address);
  
  // ethers v6 语法获取余额
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("账户余额:", balance.toString());
  
  // 部署Vote合约
  const voteFactory = await hre.ethers.getContractFactory("Vote", deployer);
  
  // 候选人列表
  const candidateNames = ["张三", "李四", "王五", "赵六"];
  
  // 部署合约，并传入候选人名称列表 (ethers v6 语法)
  console.log("正在部署合约...");
  const voteContract = await voteFactory.deploy(candidateNames);
  
  // ethers v6 等待交易确认
  await voteContract.waitForDeployment();
  
  // ethers v6 获取合约地址
  const contractAddress = await voteContract.getAddress();
  
  console.log("Vote合约地址:", contractAddress);
  console.log("候选人列表:", candidateNames);
  
  // 打印合约ABI和地址信息供前端使用
  console.log("\n-----------------------------------------------------");
  console.log("前端配置信息 (复制到frontend/src/config/contract.js):");
  console.log("-----------------------------------------------------");
  console.log(`CONTRACT_ADDRESS = "${contractAddress}"`);
}

// 执行部署
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("部署失败:", error);
    process.exit(1);
  });