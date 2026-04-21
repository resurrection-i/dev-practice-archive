# 📚 Git 使用说明 - 上传到 Gitee

## 🎯 准备工作

### 1. 安装 Git
- 下载地址: https://git-scm.com/downloads
- 安装后验证: `git --version`

### 2. 注册 Gitee 账号
- 访问: https://gitee.com/
- 注册并登录

### 3. 创建仓库
1. 登录 Gitee
2. 点击右上角 "+" → "新建仓库"
3. 填写仓库信息：
   - 仓库名称: `blockchain-crowdfunding`
   - 仓库介绍: `基于以太坊的去中心化众筹平台`
   - 是否开源: 选择"公开"或"私有"
   - 初始化仓库: **不要勾选**（我们已有代码）
4. 点击"创建"

---

## 📤 上传步骤

### 方法1：命令行上传（推荐）

#### 步骤1：初始化 Git 仓库

```bash
# 进入项目目录
cd "c:\Users\25362\Desktop\咸鱼智能合约\众筹最终版"

# 初始化 Git
git init

# 配置用户信息（首次使用）
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱"
```

#### 步骤2：添加文件到暂存区

```bash
# 添加所有文件
git add .

# 查看状态
git status
```

#### 步骤3：提交到本地仓库

```bash
# 提交（附带说明）
git commit -m "Initial commit: 区块链众筹平台完整项目"
```

#### 步骤4：关联远程仓库

```bash
# 关联 Gitee 仓库（替换为你的仓库地址）
git remote add origin https://gitee.com/your-username/blockchain-crowdfunding.git

# 查看远程仓库
git remote -v
```

#### 步骤5：推送到 Gitee

```bash
# 推送到主分支
git push -u origin master

# 如果提示输入用户名和密码，输入你的 Gitee 账号信息
```

---

### 方法2：使用 Gitee 桌面客户端

1. 下载 Gitee 桌面客户端
2. 登录账号
3. 点击"添加仓库"
4. 选择项目文件夹
5. 点击"提交"并"推送"

---

## 📝 .gitignore 文件

项目已包含 `.gitignore` 文件，会自动忽略以下内容：

```
# 编译产物
backend/target/
crowdfunding/artifacts/
crowdfunding/cache/
crowdfunding/frontend/dist/

# 依赖包
node_modules/

# 数据库文件
*.db
*.db-journal

# 日志文件
*.log

# IDE 配置
.idea/
.vscode/
*.iml

# 系统文件
.DS_Store
Thumbs.db
```

---

## 🔄 后续更新

### 修改代码后提交

```bash
# 1. 查看修改
git status

# 2. 添加修改的文件
git add .

# 3. 提交修改
git commit -m "描述你的修改内容"

# 4. 推送到 Gitee
git push
```

### 常用命令

```bash
# 查看提交历史
git log

# 查看当前状态
git status

# 查看修改内容
git diff

# 撤销修改
git checkout -- filename

# 创建分支
git branch feature-name

# 切换分支
git checkout feature-name

# 合并分支
git merge feature-name
```

---

## 📋 提交信息规范

建议使用以下格式：

```bash
# 新功能
git commit -m "feat: 添加用户注册功能"

# 修复bug
git commit -m "fix: 修复钱包连接问题"

# 文档更新
git commit -m "docs: 更新README文档"

# 代码优化
git commit -m "refactor: 优化智能合约代码"

# 性能优化
git commit -m "perf: 优化数据库查询性能"

# 测试
git commit -m "test: 添加单元测试"

# 样式修改
git commit -m "style: 调整页面布局"
```

---

## 🔐 SSH 密钥配置（可选）

使用 SSH 可以避免每次输入密码：

### 1. 生成 SSH 密钥

```bash
ssh-keygen -t rsa -C "your-email@example.com"
```

按回车使用默认路径，设置密码（可选）。

### 2. 查看公钥

```bash
cat ~/.ssh/id_rsa.pub
```

### 3. 添加到 Gitee

1. 登录 Gitee
2. 点击头像 → 设置
3. 左侧菜单 → SSH公钥
4. 粘贴公钥内容
5. 点击"确定"

### 4. 修改远程仓库地址

```bash
# 删除原来的 HTTPS 地址
git remote remove origin

# 添加 SSH 地址
git remote add origin git@gitee.com:your-username/blockchain-crowdfunding.git

# 推送
git push -u origin master
```

---

## 📦 完整的上传流程示例

```bash
# 1. 进入项目目录
cd "c:\Users\25362\Desktop\咸鱼智能合约\众筹最终版"

# 2. 初始化 Git（如果还没有）
git init

# 3. 配置用户信息（首次使用）
git config --global user.name "张三"
git config --global user.email "zhangsan@example.com"

# 4. 添加所有文件
git add .

# 5. 提交到本地
git commit -m "Initial commit: 区块链众筹平台完整项目

项目特点：
- 使用 Solidity 开发智能合约
- Spring Boot + React 全栈开发
- SQLite 数据库，无需安装 MySQL
- 一键启动脚本
- 完整的课程设计报告"

# 6. 关联远程仓库（替换为你的仓库地址）
git remote add origin https://gitee.com/your-username/blockchain-crowdfunding.git

# 7. 推送到 Gitee
git push -u origin master
```

---

## ⚠️ 注意事项

### 1. 不要上传敏感信息
- ❌ 数据库密码
- ❌ API密钥
- ❌ JWT密钥
- ✅ 使用环境变量或配置文件

### 2. 不要上传大文件
- ❌ node_modules（已在.gitignore中）
- ❌ 编译产物（已在.gitignore中）
- ❌ 数据库文件（已在.gitignore中）

### 3. 检查 .gitignore
确保 `.gitignore` 文件正确配置，避免上传不必要的文件。

### 4. 定期备份
- 定期推送到远程仓库
- 可以创建多个分支保存不同版本

---

## 🎯 推荐的仓库结构

```
blockchain-crowdfunding/
├── README.md                    # 项目说明（必需）
├── 课程设计报告.md              # 完整文档
├── LICENSE                      # 开源协议（可选）
├── .gitignore                   # Git忽略文件
├── setup.bat                    # 配置脚本
├── start-all.bat                # 启动脚本
├── backend/                     # 后端代码
├── crowdfunding/                # 前端和合约
└── docs/                        # 额外文档（可选）
```

---

## 📚 学习资源

- Git 官方文档: https://git-scm.com/doc
- Gitee 帮助中心: https://gitee.com/help
- Git 教程: https://www.runoob.com/git/git-tutorial.html
- Pro Git 书籍: https://git-scm.com/book/zh/v2

---

## 🆘 常见问题

### Q1: 推送失败，提示 "rejected"
```bash
# 先拉取远程更新
git pull origin master --allow-unrelated-histories

# 再推送
git push origin master
```

### Q2: 忘记添加 .gitignore，已经提交了不需要的文件
```bash
# 从 Git 中删除，但保留本地文件
git rm -r --cached node_modules/
git commit -m "Remove node_modules from git"
git push
```

### Q3: 想要撤销上一次提交
```bash
# 撤销提交，但保留修改
git reset --soft HEAD^

# 撤销提交和修改
git reset --hard HEAD^
```

### Q4: 克隆速度慢
```bash
# 使用浅克隆（只克隆最近的提交）
git clone --depth 1 https://gitee.com/your-username/blockchain-crowdfunding.git
```

---

## ✅ 上传完成后

1. **访问仓库页面**
   - https://gitee.com/your-username/blockchain-crowdfunding

2. **编辑仓库信息**
   - 添加项目介绍
   - 设置项目标签
   - 上传项目封面

3. **完善 README**
   - 添加项目截图
   - 添加使用说明
   - 添加联系方式

4. **分享项目**
   - 复制仓库链接
   - 分享给同学或老师
   - 写在课程设计报告中

---

**🎉 恭喜！你的项目已经成功上传到 Gitee！**

**记得在课程设计报告中添加你的 Gitee 仓库链接！**
