# <div align="center">dev-practice-archive</div>

<div align="center">

### 学习项目与课程实验归档

记录 Web3、Java Web、Go 后端方向的阶段实践。  
这里保存的是学习路径、实验过程和阶段性项目沉淀，而不是最终主打的代表作。

</div>

<div align="center">

![Web3](https://img.shields.io/badge/Web3-Practice-1f2937?style=for-the-badge)
![Java Web](https://img.shields.io/badge/Java%20Web-Archive-7c3aed?style=for-the-badge)
![Go Backend](https://img.shields.io/badge/Go-Backend-0f766e?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Learning%20Archive-f59e0b?style=for-the-badge)

</div>

---

## 仓库定位

这个仓库用来整理我在课程学习、阶段练习和实验过程中完成的一组项目，主要覆盖 3 个方向：

| 方向 | 内容 |
| --- | --- |
| Web3 / 区块链 | 智能合约、DApp、链上业务练习 |
| Java Web | Spring Boot、MyBatis、Thymeleaf 业务系统 |
| Go 后端 | Gin、GORM、JWT、RBAC 与基础服务开发 |

和单独维护的“主打项目仓库”不同，这里更强调：

- 学习过程的记录
- 技术路线的积累
- 不同方向的阶段实践
- 相对完整、适合公开查看的实验项目

---

## 项目索引

### Web3 / 区块链方向

| 项目 | 简介 | 技术栈 |
| --- | --- | --- |
| [`academic-copyright-system`](projects/academic-copyright-system) | 学术成果版权存证系统，支持作品上链、NFT 存证、版权转让与侵权验证 | Solidity, Hardhat, React |
| [`blockchain-voting-dapp`](projects/blockchain-voting-dapp) | 区块链投票练习项目，包含候选人管理、链上投票与结果展示 | Solidity, Hardhat, React |
| [`blockchain-crowdfunding-platform`](projects/blockchain-crowdfunding-platform) | 区块链众筹练习项目，覆盖项目创建、捐款、资金请求与投票审批 | Solidity, Hardhat, React, Spring Boot |

### 后端 / Web 系统方向

| 项目 | 简介 | 技术栈 |
| --- | --- | --- |
| [`campus-notice-system`](projects/campus-notice-system) | 校园公告信息管理系统，包含前台浏览与后台管理流程 | Spring Boot, MyBatis, Thymeleaf, MySQL |
| [`go-task-manager`](projects/go-task-manager) | Go 任务管理系统，支持 JWT 鉴权、RBAC 权限控制和任务流转 | Go, Gin, GORM, MySQL |

---

## 快速浏览

### 01. academic-copyright-system

偏区块链存证场景，能看到合约设计、前端交互和 NFT 化存证的练习思路。

### 02. blockchain-voting-dapp

偏轻量级 Web3 项目，适合快速展示钱包连接、链上投票和前端读取结果的基础能力。

### 03. blockchain-crowdfunding-platform

是这个仓库里相对综合的一个练习项目，同时包含合约、前端和 Java 后端。

### 04. campus-notice-system

更偏传统 Java Web 业务系统，适合展示分层结构、后台管理与数据库建模能力。

### 05. go-task-manager

偏后端服务练习，重点在鉴权、权限控制和任务流转设计。

---

## 为什么只保留这些

原始学习目录里还有不少：

- 零散静态页面练习
- 重复迭代版本
- 过程稿和实验草稿
- 没有整理完成的半成品

为了让仓库结构更清晰，这里只保留：

- 相对完整的项目
- 业务场景比较明确的项目
- 能代表某一类技术方向的项目
- 适合公开查看与后续继续整理的项目

---

## 仓库结构

```text
dev-practice-archive/
`-- projects/
    |-- academic-copyright-system/
    |-- blockchain-voting-dapp/
    |-- blockchain-crowdfunding-platform/
    |-- campus-notice-system/
    `-- go-task-manager/
```

---

## 阅读建议

如果想快速了解这个仓库，建议按这个顺序看：

1. `academic-copyright-system`
2. `blockchain-voting-dapp`
3. `blockchain-crowdfunding-platform`
4. `campus-notice-system`
5. `go-task-manager`

---

## 后续整理计划

- 为每个项目补充截图或演示图
- 继续统一各子项目 README 风格
- 清理历史实验项目中的冗余文件
- 将后续继续深入的项目拆到独立仓库维护
