# 区块链众筹平台

这是一个基于以太坊区块链的去中心化众筹平台，通过智能合约实现项目众筹、资金管理和透明化治理。平台支持创建众筹项目、捐款、请求资金使用以及投票决策等核心功能，确保资金使用透明公开。

## 功能特色

- 使用 MetaMask 钱包连接区块链
- 创建众筹项目（名称、描述、目标金额、截止日期）
- 支持项目（通过 ETH 转账）
- 项目创建者可以发起资金使用请求
- 项目创建者同时也是贡献者时自动获得一票支持
- 项目支持者可以对资金请求进行投票
- 获得多数批准后可以提取资金
- 项目状态实时追踪

## 技术栈

- **智能合约**: Solidity 0.8.19
- **区块链开发环境**: Hardhat
- **前端框架**: React + Vite
- **Web3接口**: ethers.js v6
- **UI框架**: Bootstrap 5
- **路由**: React Router v6

## 前置条件

- Node.js (v14.x 或更高版本)
- npm 或 yarn
- MetaMask 钱包浏览器扩展
- Git

## 安装步骤

### 1. 进入项目目录

```bash
git clone <repository-url>
cd 众筹最终版
```

### 2. 安装依赖

```bash
cd crowdfunding
npm install
```

### 3. 安装前端依赖

```bash
cd frontend
npm install
```

## 部署智能合约

### 1. 启动本地区块链节点

```bash
cd crowdfunding
npx hardhat node
```

此命令会启动一个本地区块链网络，并提供20个测试账户，每个账户拥有10000 ETH。

### 2. 部署合约

在新的终端窗口中执行：

```bash
cd crowdfunding
npx hardhat run scripts/deploy.js --network localhost
替换合约地址在crowdfunding\frontend\src\contracts\contractConfig.json
```

或使用预配置的命令：

```bash
npm run deploy
```

部署后，会输出合约地址。请记录此地址，稍后需要在前端配置中使用。

### 3. 更新前端合约配置

编辑 `frontend/src/contracts/contractConfig.json` 文件，更新合约地址：

```json
{
  "address": "YOUR_DEPLOYED_CONTRACT_ADDRESS",
  "abi": [...]
}
```

## 启动前端应用

```bash
cd crowdfunding/frontend
npm run dev
```

或使用预配置的命令：

```bash
npm run frontend
```

应用将运行在 `http://localhost:3000` 或类似地址，具体以终端输出为准。

## 配置 MetaMask

1. 安装 [MetaMask](https://metamask.io/download.html) 浏览器扩展
2. 创建或导入钱包
3. 导入 Hardhat 测试账户私钥（在启动节点时显示）
4. 连接到本地网络：
   - 网络名称：Hardhat Local
   - RPC URL: http://localhost:8545
   - 链ID: 31337
   - 货币符号: ETH

## 项目结构说明

```
众筹最终版/
  - crowdfunding/
    - contracts/             # 智能合约代码
      - CrowdFunding.sol     # 主合约
    - scripts/               # 部署和任务脚本
      - deploy.js            # 部署脚本
    - test/                  # 测试文件
      - CrowdFunding.test.js # 合约测试
    - frontend/              # 前端应用
      - src/
        - components/        # UI组件
        - pages/             # 页面组件
        - utils/             # 工具函数
        - contracts/         # 合约配置
      - public/              # 静态资源
    - hardhat.config.js      # Hardhat 配置
```

## 主要功能

1. **创建项目**：设置名称、描述、目标金额和时间
2. **捐款支持**：向项目捐款ETH
3. **资金请求**：项目创建者可发起资金使用请求
4. **投票治理**：贡献者可对资金请求进行投票
5. **执行请求**：获得多数支持的请求可被执行

## 测试

运行智能合约测试：
```bash
npm test
```

## 部署到测试网

1. 更新 `hardhat.config.js` 添加测试网配置
2. 编译合约            
3. 部署到测试网 (例如 Sepolia)
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

## 常见问题解答

### Q: 为什么我无法连接到MetaMask?
A: 请确保MetaMask已安装并已切换到正确的网络(Hardhat: 链ID 31337)。

### Q: 如何获取测试ETH?
A: 使用Hardhat本地网络时，测试账户会自动获得10000 ETH。如果部署至测试网，可通过对应的水龙头获取测试币。

### Q: 我创建的资金请求无法执行?
A: 资金请求需要获得超过一半贡献者的批准才能执行。如果您是项目创建者且同时也是贡献者，系统会自动为您的请求添加一票支持。

### Q: 如何在生产环境部署?
A: 修改Hardhat配置，添加目标网络(如Ethereum Mainnet、Polygon等)的配置，更新部署脚本中的网络选择，并确保有足够的真实ETH支付Gas费用。

## 授权

本项目采用 MIT 授权。 