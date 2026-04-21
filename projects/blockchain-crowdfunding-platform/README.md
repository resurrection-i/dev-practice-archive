# 🚀 区块链众筹平台

基于以太坊智能合约的去中心化众筹平台，支持项目创建、捐款、资金请求管理等功能。

## ✨ 项目特色

- ✅ **零数据库安装** - 使用 SQLite，无需安装 MySQL
- ✅ **一键启动** - 提供自动化启动脚本
- ✅ **完整功能** - 用户认证、项目管理、资金请求、投票系统
- ✅ **安全可靠** - 钱包地址匹配验证、JWT认证、智能合约权限控制
- ✅ **易于部署** - 复制项目文件夹即可在其他电脑运行

## 📋 技术栈

### 区块链层
- **Solidity** - 智能合约开发
- **Hardhat** - 以太坊开发环境
- **Ethers.js v6** - 以太坊JavaScript库

### 后端层
- **Spring Boot 2.7** - Java Web框架
- **MyBatis Plus** - ORM框架
- **SQLite** - 嵌入式数据库（无需安装）
- **JWT** - 用户认证
- **Spring Security** - 安全框架

### 前端层
- **React 18** - 前端框架
- **React Router v6** - 路由管理
- **Vite** - 构建工具
- **Bootstrap 5** - UI框架
- **Axios** - HTTP客户端

## 🎯 核心功能

### 1. 用户管理
- 用户注册/登录
- 钱包地址绑定
- JWT身份认证

### 2. 项目管理
- 创建众筹项目
- 查看项目列表
- 查看项目详情
- 项目状态管理

### 3. 捐款功能
- 向项目捐款
- 查看捐款记录
- 查看个人贡献

### 4. 资金请求
- 创建资金使用请求
- 支持者投票批准
- 执行资金转账
- 查看请求状态

### 5. 安全功能
- 钱包地址匹配验证
- 权限控制
- 交易签名验证

## 🚀 快速开始

### 环境要求

| 软件 | 版本要求 | 是否必需 |
|------|---------|---------|
| Node.js | >= 16.0.0 | ✅ 必需 |
| Java JDK | >= 17 | ✅ 必需 |
| Maven | >= 3.8.0 | ✅ 必需 |
| MetaMask | 最新版 | ✅ 必需 |
| ~~MySQL~~ | ~~>= 8.0~~ | ❌ 不需要（已改用SQLite） |

### 一键启动（推荐）

```bash
# Windows 用户
1. 双击运行 setup.bat（首次使用）
2. 双击运行 start-all.bat（启动所有服务）
3. 打开浏览器访问 http://localhost:3000
```

### 手动启动

```bash
# 1. 安装依赖
cd crowdfunding
npm install
cd frontend
npm install
cd ../..

# 2. 编译智能合约
cd crowdfunding
npx hardhat compile

# 3. 编译后端
cd ../backend
mvn clean compile

# 4. 启动 Hardhat 本地网络（终端1）
cd crowdfunding
npx hardhat node

# 5. 部署智能合约（终端2）
cd crowdfunding
npx hardhat run scripts/deploy.js --network localhost

# 6. 启动后端服务（终端3）
cd backend
mvn spring-boot:run

# 7. 启动前端服务（终端4）
cd crowdfunding/frontend
npm run dev
```

## 📖 使用说明

### 1. 配置 MetaMask

添加 Hardhat 本地网络：
- 网络名称: Hardhat Local
- RPC URL: http://127.0.0.1:8545
- 链ID: 31337
- 货币符号: ETH

导入测试账户：
```
Account #0
地址: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
私钥: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### 2. 测试账户

| 用户名 | 密码 | 邮箱 | 角色 |
|--------|------|------|------|
| admin | admin123 | admin@crowdfunding.com | 管理员 |
| testuser1 | test123 | user1@test.com | 普通用户 |
| testuser2 | test123 | user2@test.com | 普通用户 |

### 3. 基本流程

1. **注册/登录** → 使用测试账户或注册新账户
2. **连接钱包** → 点击"连接钱包"按钮
3. **绑定钱包** → 首次连接需要绑定钱包地址
4. **创建项目** → 填写项目信息并提交
5. **捐款** → 浏览项目并进行捐款
6. **管理请求** → 创建者可以创建资金请求，支持者投票批准

## 📁 项目结构

```
众筹最终版/
├── backend/                    # 后端服务
│   ├── src/main/
│   │   ├── java/              # Java源代码
│   │   └── resources/         # 配置文件
│   │       ├── application.yml
│   │       └── schema.sql     # SQLite建表脚本
│   └── pom.xml
│
├── crowdfunding/              # 智能合约和前端
│   ├── contracts/            # Solidity合约
│   │   └── CrowdFunding.sol
│   ├── scripts/              # 部署脚本
│   │   └── deploy.js
│   ├── test/                 # 合约测试
│   ├── frontend/             # React前端
│   │   ├── src/
│   │   │   ├── api/         # API接口
│   │   │   ├── components/  # React组件
│   │   │   ├── pages/       # 页面组件
│   │   │   ├── utils/       # 工具函数
│   │   │   └── contracts/   # 合约配置
│   │   ├── package.json
│   │   └── vite.config.js
│   ├── hardhat.config.js
│   └── package.json
│
├── crowdfunding.db           # SQLite数据库（自动生成）
├── setup.bat                 # 一键配置脚本
├── start-all.bat             # 一键启动脚本
├── clean.bat                 # 清理脚本
├── .gitignore                # Git忽略配置
├── 课程设计报告.md           # 完整的课程设计报告
├── SQLite迁移说明.md         # SQLite迁移说明
└── README.md                 # 本文件
```

## 🔧 常用脚本

| 脚本 | 说明 |
|------|------|
| `setup.bat` | 一键配置：检查环境、安装依赖、编译项目 |
| `start-all.bat` | 一键启动：启动所有服务（4个窗口） |
| `clean.bat` | 清理编译产物和缓存 |
| `clean-deep.ps1` | 深度清理（包括node_modules） |

## 📊 数据库

### SQLite 优势

- ✅ **零配置** - 无需安装数据库服务器
- ✅ **自动创建** - 首次运行自动建表
- ✅ **便携性强** - 数据库文件随项目移动
- ✅ **易于备份** - 直接复制 `crowdfunding.db` 文件

### 查看数据库

**方法1：DB Browser for SQLite**
- 下载：https://sqlitebrowser.org/
- 打开 `crowdfunding.db` 文件

**方法2：VS Code 插件**
- 安装：SQLite Viewer
- 右键 `crowdfunding.db` → Open Database

**方法3：命令行**
```bash
sqlite3 crowdfunding.db
.tables
SELECT * FROM users;
.quit
```

## 🔒 安全特性

### 1. 钱包地址匹配验证
所有交易前检查连接的钱包是否与登录账户绑定的钱包一致。

### 2. JWT 身份认证
使用 JWT Token 进行用户身份验证。

### 3. 智能合约权限控制
- 只有项目创建者可以创建资金请求
- 只有贡献者可以投票
- 只有达到批准数才能执行请求

### 4. 密码加密
使用 BCrypt 算法加密存储用户密码。

## 📝 开发说明

### 编译智能合约
```bash
cd crowdfunding
npx hardhat compile
```

### 运行合约测试
```bash
cd crowdfunding
npx hardhat test
```

### 部署合约
```bash
cd crowdfunding
npx hardhat run scripts/deploy.js --network localhost
```

### 清理项目
```bash
# 清理编译产物
clean.bat

# 深度清理（包括依赖包）
clean-deep.ps1
```

## 🚢 部署到其他电脑

### 步骤1：复制项目
将整个项目文件夹复制到目标电脑。

### 步骤2：安装环境
在目标电脑上安装：
- Node.js
- Java JDK 17+
- Maven
- MetaMask浏览器插件

### 步骤3：运行配置脚本
```bash
setup.bat
```

### 步骤4：启动项目
```bash
start-all.bat
```

### 步骤5：访问应用
打开浏览器访问 http://localhost:3000

## 📚 文档

- [课程设计报告](./课程设计报告.md) - 完整的技术文档和设计说明
- [SQLite迁移说明](./SQLite迁移说明.md) - 数据库迁移详细说明
- [项目清理说明](./项目清理说明.md) - 项目清理指南
- [项目结构说明](./项目结构说明.md) - 详细的项目结构

## ❓ 常见问题

### Q1: 无法连接到 Hardhat 网络
**解决方案**：
1. 确保 Hardhat 节点正在运行
2. 检查 MetaMask 网络配置
3. 确认 RPC URL 为 http://127.0.0.1:8545

### Q2: 交易失败
**解决方案**：
1. 检查钱包地址是否匹配
2. 确认账户有足够的 ETH
3. 查看 Hardhat 终端的错误信息

### Q3: 后端启动失败
**解决方案**：
1. 检查 Java 版本（需要 JDK 17+）
2. 运行 `mvn clean compile`
3. 查看错误日志

### Q4: 前端无法访问
**解决方案**：
1. 确认前端服务已启动
2. 检查端口 3000 是否被占用
3. 尝试访问 http://localhost:3000

### Q5: 数据库文件在哪里？
**解决方案**：
数据库文件 `crowdfunding.db` 在项目根目录，首次启动后端时自动创建。

## 📦 源码仓库

### Gitee 地址

🔗 **完整源码**: https://gitee.com/your-username/blockchain-crowdfunding

```bash
# 克隆项目
git clone https://gitee.com/your-username/blockchain-crowdfunding.git

# 进入项目
cd blockchain-crowdfunding

# 一键配置
setup.bat

# 一键启动
start-all.bat
```

### 快速体验

1. **克隆仓库** → 下载完整源码
2. **安装环境** → Node.js + Java JDK + Maven
3. **运行脚本** → setup.bat + start-all.bat
4. **开始使用** → 访问 http://localhost:3000

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👨‍💻 作者

[你的姓名]

**联系方式**:
- Gitee: https://gitee.com/your-username
- Email: your-email@example.com

## 🙏 致谢

感谢所有开源项目的贡献者！

---

**如有问题，请查看 [课程设计报告](./课程设计报告.md) 或在 Gitee 提交 Issue。**

**⭐ 如果这个项目对你有帮助，欢迎 Star！**
