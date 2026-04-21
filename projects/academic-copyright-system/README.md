# 学术成果版权存证系统

基于 **Solidity + Hardhat + React** 开发的区块链版权存证练习项目，支持学术成果上链存证、版权转让追踪与侵权验证。

---

## 项目简介

这个项目围绕“学术成果确权与版权追踪”场景展开，主要用于练习：

- 智能合约中的作品登记与权属管理
- NFT 化存证思路
- 前端与链上合约的交互流程
- 区块链场景下的公开验证能力

项目整体包含智能合约、部署脚本和 React DApp 前端，属于偏课程实践型的 Web3 项目。

---

## 核心功能

- 学术成果哈希上链存证
- 生成 NFT 形式的存证凭证
- 版权转让与历史追踪
- 侵权验证与公开查询
- 钱包连接与前端交互

---

## 技术栈

| 层级 | 技术方案 |
| --- | --- |
| 智能合约 | Solidity |
| 合约开发 | Hardhat |
| 前端 | React、TypeScript、Ant Design |
| 链上交互 | ethers.js |
| 钱包连接 | MetaMask |

---

## 项目结构

```text
academic-copyright-system/
|-- contracts/
|   |-- AcademicCopyright.sol
|   |-- PrivacyVerifier.sol
|   `-- verifier.sol
|-- frontend/
|   `-- src/
|-- scripts/
|-- test/
`-- README.md
```

---

## 快速开始

### 环境要求

- Node.js 16+
- npm 8+
- MetaMask

### 安装依赖

```bash
npm install
cd frontend
npm install
```

### 启动本地环境

```bash
# 1. 启动本地区块链网络
npx hardhat node

# 2. 部署合约
npx hardhat run scripts/deploy.js --network localhost

# 3. 启动前端
cd frontend
npm start
```

---

## 项目特点

- 结合 NFT 思路做链上版权存证
- 同时覆盖合约开发和前端交互
- 包含版权转让与侵权验证等业务流程
- 适合作为区块链应用练习项目展示

---

## 适合简历怎么写

> 基于 Solidity + Hardhat + React 开发学术成果版权存证系统，实现作品哈希上链、NFT 存证、版权转让追踪与侵权验证等功能，完成基础 Web3 存证场景实践。

