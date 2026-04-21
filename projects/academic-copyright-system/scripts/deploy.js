const { ethers } = require("hardhat");

async function main() {
  console.log("开始部署学术版权存证系统...");

  // 获取部署账户
  const [deployer] = await ethers.getSigners();
  console.log("部署账户:", deployer.address);
  console.log("账户余额:", (await ethers.provider.getBalance(deployer.address)).toString());

  // 1. 部署 Groth16 验证器合约
  console.log("\n1. 部署 Groth16 验证器合约...");
  const Verifier = await ethers.getContractFactory("Verifier");
  const verifier = await Verifier.deploy();
  await verifier.waitForDeployment();
  console.log("Verifier 合约地址:", await verifier.getAddress());

  // 2. 部署主合约 AcademicCopyright
  console.log("\n2. 部署主合约 AcademicCopyright...");
  const AcademicCopyright = await ethers.getContractFactory("AcademicCopyright");
  const academicCopyright = await AcademicCopyright.deploy();
  await academicCopyright.waitForDeployment();
  console.log("AcademicCopyright 合约地址:", await academicCopyright.getAddress());

  // 3. 部署隐私验证合约
  console.log("\n3. 部署隐私验证合约 PrivacyVerifier...");
  const PrivacyVerifier = await ethers.getContractFactory("PrivacyVerifier");
  const privacyVerifier = await PrivacyVerifier.deploy(
    await verifier.getAddress(),
    await academicCopyright.getAddress()
  );
  await privacyVerifier.waitForDeployment();
  console.log("PrivacyVerifier 合约地址:", await privacyVerifier.getAddress());

  // 4. 验证部署
  console.log("\n4. 验证合约部署...");
  
  // 验证主合约
  const name = await academicCopyright.name();
  const symbol = await academicCopyright.symbol();
  console.log("NFT 名称:", name);
  console.log("NFT 符号:", symbol);

  // 验证验证器合约
  const verifyingKeyAlpha = await verifier.getVerifyingKeyAlpha();
  console.log("验证密钥 Alpha:", verifyingKeyAlpha);

  // 5. 保存部署信息
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    contracts: {
      Verifier: await verifier.getAddress(),
      AcademicCopyright: await academicCopyright.getAddress(),
      PrivacyVerifier: await privacyVerifier.getAddress()
    },
    deploymentTime: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber()
  };

  // 写入部署信息文件
  const fs = require('fs');
  const path = require('path');
  
  const deploymentPath = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentPath)) {
    fs.mkdirSync(deploymentPath, { recursive: true });
  }
  
  const deploymentFile = path.join(deploymentPath, `${hre.network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n✅ 部署完成!");
  console.log("部署信息已保存到:", deploymentFile);
  
  // 6. 生成前端配置文件
  const frontendConfig = {
    contracts: {
      AcademicCopyright: {
        address: await academicCopyright.getAddress(),
        abi: [] // 实际使用时需要添加完整的ABI
      },
      PrivacyVerifier: {
        address: await privacyVerifier.getAddress(),
        abi: [] // 实际使用时需要添加完整的ABI
      }
    },
    network: {
      name: hre.network.name,
      chainId: (await ethers.provider.getNetwork()).chainId
    }
  };
  
  const frontendConfigPath = path.join(__dirname, '..', 'frontend', 'src', 'config', 'contracts.json');
  const configDir = path.dirname(frontendConfigPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  
  fs.writeFileSync(frontendConfigPath, JSON.stringify(frontendConfig, null, 2));
  console.log("前端配置文件已生成:", frontendConfigPath);

  console.log("\n📋 部署摘要:");
  console.log("=====================================");
  console.log(`网络: ${hre.network.name}`);
  console.log(`部署者: ${deployer.address}`);
  console.log(`主合约: ${await academicCopyright.getAddress()}`);
  console.log(`隐私合约: ${await privacyVerifier.getAddress()}`);
  console.log(`验证器: ${await verifier.getAddress()}`);
  console.log("=====================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("部署失败:", error);
    process.exit(1);
  });
