# <div align="center">susheng</div>

<div align="center">

### 个人精选全栈项目作品集

聚焦区块链应用、后端系统开发与 Web 项目实践，整理可公开展示、结构较完整的代表性项目。

</div>

---

## 仓库定位

这个仓库不是把学习目录原样打包上传，而是从已有项目中筛出更适合公开展示的作品，统一整理成一个作品集入口。

当前主推 3 个方向：

- **区块链应用开发**：智能合约、DApp 前端、链上存证
- **Java Web 系统开发**：Spring Boot、MyBatis、Thymeleaf、MySQL
- **Go 后端开发**：Gin、GORM、JWT、RBAC、任务流转

---

## 精选项目

### 1. 学术成果版权存证系统

路径：[`projects/academic-copyright-system`](projects/academic-copyright-system)

一个基于以太坊的学术成果版权存证系统，支持作品哈希上链、ERC-721 NFT 存证、版权转让追踪与侵权验证，包含智能合约与 React DApp 前端。

技术关键词：

- Solidity
- Hardhat
- React
- TypeScript
- ethers.js
- NFT

适合展示的能力：

- 链上业务建模
- 智能合约开发与部署
- 前后端联动的 DApp 设计
- 区块链场景下的数据可信存证

### 2. 校园公告信息管理系统

路径：[`projects/campus-notice-system`](projects/campus-notice-system)

一个基于 Spring Boot + MyBatis + Thymeleaf 的校园公告管理系统，包含前台公告浏览与后台管理两套流程，支持分类、标签、评论、收藏、日志记录等功能。

技术关键词：

- Spring Boot
- MyBatis
- Thymeleaf
- MySQL
- Bootstrap
- Maven

适合展示的能力：

- 经典三层架构设计
- Web 管理后台开发
- 数据库建模与业务流程实现
- 表单、文件上传、权限与日志管理

### 3. Go 任务管理系统

路径：[`projects/go-task-manager`](projects/go-task-manager)

一个基于 Go 的任务管理系统，支持 JWT 登录鉴权、RBAC 权限控制、任务创建/分配/状态流转、用户管理和日志记录，并带有前端页面。

技术关键词：

- Go
- Gin
- GORM
- MySQL
- JWT
- RBAC

适合展示的能力：

- Go Web 服务开发
- RESTful API 设计
- 用户权限与任务流转模型
- 配置管理与日志系统

---

## 为什么只上传这些

原始目录里还有不少课程练习、静态页面、过程版本和重复迭代目录。为了让 GitHub 首页更干净、项目叙事更清晰，这个仓库只保留：

- 完成度相对更高的项目
- 有明确业务场景的项目
- 比较适合面试讲解的项目
- 能代表不同技术方向的项目

暂时没有放进来的内容，不代表没做过，而是优先级不如这几个高。

---

## 仓库结构

```text
susheng/
`-- projects/
    |-- academic-copyright-system/
    |-- campus-notice-system/
    `-- go-task-manager/
```

---

## 建议阅读顺序

如果你是招聘方或面试官，建议按这个顺序看：

1. `academic-copyright-system`
2. `campus-notice-system`
3. `go-task-manager`

这个顺序能比较快看到我在区块链、Java Web、Go 后端三个方向上的实践能力。

---

## 后续计划

- 为每个项目补充更多运行截图
- 继续统一整理 README 风格
- 持续清理课程项目中的中间文件、缓存和冗余资料
- 逐步把更多值得展示的项目补进作品集

