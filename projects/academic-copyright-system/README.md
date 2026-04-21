# 学术成果版权存证系统

基于以太坊区块链的学术成果版权存证系统，实现论文、专利等学术成果的链上存证、权属声明、转让追踪及侵权验证功能。

## 🎯 项目特性

### 核心功能
- **权属存证 (30分)**: 支持学术成果哈希上链存证，生成ERC-721 NFT代币
- **版权转让与追踪 (25分)**: 实现安全的版权转让，完整记录转让历史
- **侵权验证 (20分)**: 提供公开验证接口，支持批量验证
- **前端交互 (15分)**: React DApp界面，支持钱包连接和完整操作流程

### 进阶功能
- **零知识证明隐私保护**: 使用zk-SNARKs实现隐私保护验证
- **抗重入攻击**: 智能合约具备完整的安全防护机制
- **多语言支持**: 支持中英文界面切换

## 🏗️ 系统架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端DApp      │    │   智能合约层    │    │   以太坊网络    │
│  - React UI     │◄──►│  - 主合约       │◄──►│  - 区块链存储   │
│  - Web3集成     │    │  - 隐私合约     │    │  - 事件日志     │
│  - 钱包连接     │    │  - NFT标准      │    │  - Gas优化      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 项目结构

```
academic-copyright-system/
├── contracts/                 # 智能合约
│   ├── AcademicCopyright.sol # 主合约
│   ├── PrivacyVerifier.sol   # 隐私验证合约
│   └── verifier.sol          # zk-SNARK验证器
├── frontend/                 # 前端DApp
│   ├── src/
│   │   ├── components/       # React组件
│   │   ├── App.tsx          # 主应用
│   │   └── index.tsx        # 入口文件
│   └── package.json         # 依赖配置
├── scripts/                  # 部署脚本
├── test/                    # 测试文件
└── README.md               # 项目文档
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0
- MetaMask 钱包
- Hardhat 开发环境

### 安装依赖

```bash
# 安装项目依赖
npm install

# 安装前端依赖
cd frontend
npm install
```

### 部署智能合约

```bash
# 编译合约
npx hardhat compile

# 部署到本地网络
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost

# 部署到测试网络
npx hardhat run scripts/deploy.js --network goerli
```

### 启动前端应用

```bash
cd frontend
npm start
```

访问 http://localhost:3000 查看应用。

## 📋 功能详解

### 1. 权属存证 (30分)

#### 功能描述
- 用户上传学术成果哈希和作者信息
- 系统生成不可篡改的存证记录
- 支持NFT化存证，绑定ERC-721代币

#### 技术实现
```solidity
function registerWork(
    string memory contentHash,
    string memory title,
    string[] memory authors,
    string memory workType,
    string memory metadata
) public nonReentrant returns (uint256)
```

#### 使用流程
1. 连接MetaMask钱包
2. 填写作品基本信息
3. 上传文件或输入哈希值
4. 确认信息并支付Gas费用
5. 获得NFT Token ID作为存证凭证

### 2. 版权转让与追踪 (25分)

#### 功能描述
- 实现版权转让功能，需要原作者签名授权
- 记录转让双方地址及时间戳
- 设计权属溯源链，可查询历史转让路径

#### 技术实现
```solidity
function transferCopyright(
    uint256 tokenId,
    address to,
    string memory reason,
    bytes memory signature
) public nonReentrant workExists(tokenId) onlyWorkOwner(tokenId)
```

#### 安全机制
- 数字签名验证
- 重入攻击防护
- 权限检查机制

### 3. 侵权验证 (20分)

#### 功能描述
- 提供公开验证接口
- 输入文件哈希返回存证时间及作者信息
- 支持批量验证和隐私保护验证

#### 技术实现
```solidity
function verifyInfringement(string memory contentHash) 
    public view returns (
        bool exists,
        uint256 tokenId,
        uint256 timestamp,
        address currentOwner,
        string memory title
    )
```

#### 进阶功能：零知识证明
- 使用zk-SNARKs技术
- 仅返回是否侵权，不泄露原文
- 保护用户隐私

### 4. 前端交互 (15分)

#### 技术栈
- React 18 + TypeScript
- Ant Design UI组件库
- ethers.js Web3集成
- MetaMask钱包连接

#### 主要页面
- **首页**: 系统介绍和统计信息
- **注册作品**: 学术成果注册流程
- **版权转让**: 转让管理和历史查询
- **侵权验证**: 单个/批量/隐私验证
- **我的作品**: 个人作品管理

## 🔒 安全特性

### 智能合约安全
- **重入攻击防护**: 使用OpenZeppelin的ReentrancyGuard
- **权限控制**: 基于角色的访问控制
- **输入验证**: 严格的参数校验
- **事件日志**: 完整的操作记录

### 前端安全
- **钱包连接验证**: MetaMask集成
- **交易确认**: 用户明确授权
- **错误处理**: 完善的异常处理机制

## 🧪 测试

### 智能合约测试

```bash
# 运行测试套件
npx hardhat test

# 测试覆盖率
npx hardhat coverage
```

### 前端测试

```bash
cd frontend
npm test
```

## 📊 Gas 优化

### 优化策略
- 批量操作减少交易次数
- 事件日志替代存储
- 合理的数据结构设计
- 函数修饰符优化

### Gas 消耗估算
- 注册作品: ~150,000 Gas
- 版权转让: ~80,000 Gas
- 侵权验证: ~30,000 Gas (写入), 免费 (只读)

## 🌐 部署指南

### 测试网部署

1. **配置网络**
```javascript
// hardhat.config.js
networks: {
  goerli: {
    url: "https://goerli.infura.io/v3/YOUR_INFURA_KEY",
    accounts: ["YOUR_PRIVATE_KEY"]
  }
}
```

2. **部署合约**
```bash
npx hardhat run scripts/deploy.js --network goerli
```

3. **验证合约**
```bash
npx hardhat verify --network goerli CONTRACT_ADDRESS
```

### 主网部署

⚠️ **注意**: 主网部署前请确保：
- 充分的测试验证
- 安全审计完成
- Gas费用预算充足
- 备份私钥安全

## 📈 监控和维护

### 事件监听
```javascript
// 监听作品注册事件
contract.on("WorkRegistered", (tokenId, contentHash, author, title, timestamp) => {
  console.log(`新作品注册: ${title} by ${author}`);
});
```

### 数据统计
- 总注册作品数量
- 版权转让次数
- 验证查询统计
- 用户活跃度分析

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- 项目维护者: [Your Name]
- 邮箱: your.email@example.com
- 项目链接: https://github.com/yourusername/academic-copyright-system

## 🙏 致谢

- OpenZeppelin 提供的安全合约库
- Ethereum 社区的技术支持
- React 和 Ant Design 开发团队

---

## 📚 附录

### A. 合约接口文档

详细的合约接口文档请参考 [API.md](docs/API.md)

### B. 前端组件文档

前端组件使用说明请参考 [FRONTEND.md](docs/FRONTEND.md)

### C. 常见问题

常见问题解答请参考 [FAQ.md](docs/FAQ.md)
