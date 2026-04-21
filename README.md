# <div align="center">dev-practice-archive</div>

<div align="center">

### 学习项目与课程实验归档

记录 Web3、Java Web、Go 后端方向的阶段实践，不作为最终代表作，而是作为学习路径和项目实现过程的归档。

</div>

---

## 仓库说明

这个仓库用于整理我在课程学习、阶段练习和实验过程中完成的一组项目，覆盖：

- 区块链应用与智能合约开发
- Java Web 系统开发
- Go 后端服务开发

这里的项目更偏“学习过程记录”和“阶段实践沉淀”，而不是海投时主打的最终代表作。

真正更适合放到简历主位、单独拿出来重点展示的项目，我会放在独立仓库中维护。

---

## 当前保留项目

### 1. academic-copyright-system

路径：[`projects/academic-copyright-system`](projects/academic-copyright-system)

基于以太坊的学术成果版权存证系统，支持作品哈希上链、NFT 存证、版权转让追踪和侵权验证。

方向标签：

- Solidity
- Hardhat
- React
- DApp

### 2. blockchain-voting-dapp

路径：[`projects/blockchain-voting-dapp`](projects/blockchain-voting-dapp)

一个区块链投票练习项目，包含智能合约和前端页面，主要用于练习钱包连接、候选人管理、链上投票和结果展示。

方向标签：

- Solidity
- Hardhat
- React
- MetaMask

### 3. blockchain-crowdfunding-platform

路径：[`projects/blockchain-crowdfunding-platform`](projects/blockchain-crowdfunding-platform)

一个区块链众筹平台练习项目，包含智能合约、React 前端和 Java 后端，覆盖项目创建、捐款、资金请求和投票审批等流程。

方向标签：

- Solidity
- Hardhat
- React
- Spring Boot

### 4. campus-notice-system

路径：[`projects/campus-notice-system`](projects/campus-notice-system)

一个基于 Spring Boot + MyBatis + Thymeleaf 的校园公告信息管理系统，包含前台公告浏览与后台管理流程。

方向标签：

- Spring Boot
- MyBatis
- Thymeleaf
- MySQL

### 5. go-task-manager

路径：[`projects/go-task-manager`](projects/go-task-manager)

一个基于 Go 的任务管理系统，支持 JWT 鉴权、RBAC 权限控制、任务创建与状态流转。

方向标签：

- Go
- Gin
- GORM
- JWT

---

## 为什么只保留这些

原始学习目录里还有不少：

- 零散的静态页面练习
- 重复迭代版本
- 过程稿和实验草稿
- 未整理完成的半成品

为了避免仓库过于杂乱，这里只保留相对完整、比较容易说明白、适合公开查看的项目。

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

如果想快速了解我的学习路径，建议按下面顺序查看：

1. `academic-copyright-system`
2. `blockchain-voting-dapp`
3. `blockchain-crowdfunding-platform`
4. `campus-notice-system`
5. `go-task-manager`

---

## 说明

- 这些项目保留了各自原始技术路线和实现方式
- 我会逐步统一 README 风格，并持续清理缓存、日志和无关文件
- 如果某个项目后续继续深入，我会把它拆到独立仓库单独维护

