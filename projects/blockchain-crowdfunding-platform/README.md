# 区块链众筹平台

基于 **Solidity + Hardhat + React + Spring Boot** 开发的区块链众筹练习项目，围绕“项目创建、链上捐款、资金请求、投票审批”构建基础业务流程。

---

## 项目简介

这个项目主要用于练习一个相对完整的 Web3 业务闭环，包含：

- 智能合约层：处理项目创建、捐款、资金请求与投票
- 前端层：提供项目浏览、创建、捐款和请求管理页面
- 后端层：负责用户认证、钱包绑定和部分业务数据管理

项目同时覆盖了区块链交互、前后端联动和基础权限控制，是一个偏课程实践型的综合练习项目。

---

## 核心功能

- 用户注册与登录
- 钱包地址绑定
- 创建众筹项目
- 浏览项目与查看详情
- 对项目进行捐款
- 创建资金使用请求
- 支持者投票批准请求
- 执行资金拨付流程

---

## 技术栈

| 层级 | 技术方案 |
| --- | --- |
| 智能合约 | Solidity |
| 合约开发 | Hardhat、Ethers.js |
| 前端 | React、Vite、Bootstrap |
| 后端 | Spring Boot、Spring Security、MyBatis Plus |
| 数据库 | SQLite |
| 鉴权 | JWT |

---

## 项目结构

```text
blockchain-crowdfunding-platform/
|-- backend/                 # Java 后端
|-- crowdfunding/            # 合约与前端
|   |-- contracts/
|   |-- scripts/
|   |-- test/
|   `-- frontend/
|-- setup.bat
|-- start-all.bat
`-- README.md
```

---

## 快速开始

### 环境要求

- Node.js 16+
- Java JDK 17+
- Maven 3.8+
- MetaMask

### 推荐方式

Windows 环境下可以直接使用：

```bash
setup.bat
start-all.bat
```

启动后访问：

```text
http://localhost:3000
```

### 手动启动

```bash
# 1. 启动本地区块链网络
cd crowdfunding
npx hardhat node

# 2. 部署合约
cd crowdfunding
npx hardhat run scripts/deploy.js --network localhost

# 3. 启动后端
cd backend
mvn spring-boot:run

# 4. 启动前端
cd crowdfunding/frontend
npm run dev
```

---

## 项目特点

- 采用 SQLite，降低本地运行门槛
- 同时包含合约、前端和后端三个部分
- 具备基础的钱包绑定和权限控制逻辑
- 适合作为区块链业务系统练习项目进行展示

---

## 适合简历怎么写

> 基于 Solidity + Hardhat + React + Spring Boot 开发区块链众筹平台练习项目，实现项目创建、链上捐款、资金请求、投票审批与钱包绑定等功能，完成 Web3 场景下的基础业务闭环设计。

