# 区块链投票系统

基于 **Solidity + Hardhat + React + MetaMask** 开发的区块链投票练习项目，用于实现候选人管理、链上投票和投票结果展示等基础功能。

---

## 项目简介

这是一个偏入门实践型的 Web3 项目，主要目的是熟悉：

- 智能合约编写与部署
- 前端调用链上合约
- MetaMask 钱包连接
- 链上投票结果的读取与展示

项目包含：

- 智能合约目录
- Hardhat 本地开发环境
- React 前端页面

---

## 核心功能

- 连接 MetaMask 钱包
- 添加候选人信息
- 对候选人发起投票
- 读取链上投票结果
- 前端展示投票统计

---

## 技术栈

| 层级 | 技术方案 |
| --- | --- |
| 智能合约 | Solidity |
| 合约开发 | Hardhat |
| 前端 | React |
| 链上交互 | ethers.js |
| 钱包连接 | MetaMask |
| 图表展示 | ECharts |

---

## 项目结构

```text
blockchain-voting-dapp/
|-- contracts/
|   `-- Vote.sol
|-- frontend/
|   |-- src/
|   `-- package.json
|-- hardhat.config.js
|-- package.json
`-- README.md
```

---

## 快速开始

### 1. 安装依赖

```bash
npm install
cd frontend
npm install
```

### 2. 启动本地区块链网络

```bash
npx hardhat node
```

### 3. 部署合约

```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 4. 启动前端

```bash
cd frontend
npm start
```

---

## 适合简历怎么写

> 基于 Solidity + Hardhat + React 开发区块链投票练习项目，实现候选人管理、钱包连接、链上投票与结果展示，完成基础 Web3 交互流程搭建。

