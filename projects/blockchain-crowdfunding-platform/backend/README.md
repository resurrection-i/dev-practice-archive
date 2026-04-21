# 区块链众筹平台后端

## 项目说明

这是一个基于Spring Boot 2.7.14的后端项目，为区块链众筹平台提供用户认证、数据管理等功能。

## 技术栈

- **Spring Boot 2.7.14** - 主框架
- **Spring Security** - 安全框架
- **MyBatis Plus 3.5.3.1** - ORM框架
- **MySQL 8.0** - 数据库
- **JWT 0.11.5** - Token认证
- **Knife4j 3.0.3** - API文档
- **Lombok** - 简化代码

## 项目结构

```
backend/
├── src/main/java/com/crowdfunding/
│   ├── controller/          # 控制器层
│   │   ├── AuthController.java
│   │   └── UserController.java
│   ├── service/             # 服务层
│   │   ├── UserService.java
│   │   └── impl/
│   │       └── UserServiceImpl.java
│   ├── mapper/              # 数据访问层
│   │   ├── UserMapper.java
│   │   ├── WalletAddressMapper.java
│   │   ├── ProjectMapper.java
│   │   └── TransactionMapper.java
│   ├── entity/              # 实体类
│   │   ├── User.java
│   │   ├── WalletAddress.java
│   │   ├── Project.java
│   │   └── Transaction.java
│   ├── dto/                 # 数据传输对象
│   │   ├── RegisterRequest.java
│   │   ├── LoginRequest.java
│   │   └── UserResponse.java
│   ├── config/              # 配置类
│   │   ├── SecurityConfig.java
│   │   ├── CorsConfig.java
│   │   ├── MetaObjectHandlerConfig.java
│   │   └── Knife4jConfig.java
│   ├── security/            # 安全相关
│   │   └── JwtAuthenticationFilter.java
│   ├── utils/               # 工具类
│   │   └── JwtUtil.java
│   ├── common/              # 通用类
│   │   └── Result.java
│   ├── exception/           # 异常处理
│   │   └── GlobalExceptionHandler.java
│   └── CrowdfundingApplication.java  # 启动类
├── src/main/resources/
│   └── application.yml      # 配置文件
└── pom.xml                  # Maven配置
```

## 快速开始

### 1. 前置条件

- JDK 11+
- Maven 3.6+
- MySQL 8.0
- IntelliJ IDEA (推荐)

### 2. 数据库准备

在MySQL中执行项目根目录下的 `database_schema.sql` 文件创建数据库和表。

### 3. 修改配置

编辑 `src/main/resources/application.yml`，修改数据库密码:

```yaml
spring:
  datasource:
    password: 你的MySQL密码
```

### 4. 使用IDEA启动

1. 用IDEA打开 `backend` 文件夹
2. 等待Maven依赖下载完成
3. 运行 `CrowdfundingApplication.java`
4. 看到启动成功提示后，访问 http://localhost:8080/api/doc.html

### 5. 使用Maven命令启动

```bash
# 进入backend目录
cd backend

# 编译打包
mvn clean package

# 运行
java -jar target/crowdfunding-backend-1.0.0.jar
```

或者直接运行:

```bash
mvn spring-boot:run
```

## API接口

### 认证接口

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 用户注册 | POST | /api/auth/register | 注册新用户 |
| 用户登录 | POST | /api/auth/login | 登录获取Token |

### 用户接口

| 接口 | 方法 | 路径 | 说明 | 需要Token |
|------|------|------|------|-----------|
| 获取用户信息 | GET | /api/user/info | 获取当前用户信息 | ✅ |
| 绑定钱包 | POST | /api/user/bind-wallet | 绑定以太坊地址 | ✅ |

## 测试接口

### 使用Postman测试

**1. 注册用户**

```http
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "123456",
  "email": "test@example.com",
  "realName": "测试用户"
}
```

**2. 登录**

```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "123456"
}
```

返回:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9..."
  }
}
```

**3. 获取用户信息**

```http
GET http://localhost:8080/api/user/info
Authorization: Bearer {上一步获取的token}
```

**4. 绑定钱包**

```http
POST http://localhost:8080/api/user/bind-wallet?walletAddress=0xYourWalletAddress
Authorization: Bearer {token}
```

### 使用Knife4j测试

1. 启动项目后访问: http://localhost:8080/api/doc.html
2. 点击"认证管理"测试注册和登录接口
3. 登录后复制返回的token
4. 点击右上角"文档管理" → "全局参数设置"
5. 添加参数:
   - 参数名: Authorization
   - 参数值: Bearer {你的token}
   - 参数位置: header
6. 保存后即可测试需要认证的接口

## 配置说明

### JWT配置

```yaml
jwt:
  secret: 密钥(至少256位)
  expiration: 86400000  # Token有效期(毫秒)，默认24小时
```

### 数据库配置

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/crowdfunding_db
    username: root
    password: 你的密码
```

### 日志配置

```yaml
logging:
  level:
    com.crowdfunding: debug  # 项目日志级别
```

## 常见问题

### 1. 启动失败: 数据库连接错误

**解决**: 检查MySQL是否运行，密码是否正确

### 2. 启动失败: 端口8080被占用

**解决**: 修改 `application.yml` 中的 `server.port`

### 3. Token验证失败

**解决**: 检查请求头是否正确添加 `Authorization: Bearer {token}`

### 4. 跨域问题

**解决**: 已配置CORS，如仍有问题检查 `CorsConfig.java`

## 开发建议

1. **使用IDEA**: 推荐使用IntelliJ IDEA开发，支持自动导入依赖
2. **Lombok插件**: 确保IDEA安装了Lombok插件
3. **热部署**: 可添加 `spring-boot-devtools` 依赖实现热部署
4. **日志查看**: 启动后可在控制台看到SQL执行日志

## 下一步

1. ✅ 后端项目已创建完成
2. 📝 执行数据库SQL脚本
3. 🚀 启动后端项目
4. 🧪 测试接口
5. 🎨 集成前端

## 联系方式

如有问题，请查看项目根目录下的文档:
- `项目架构分析与后端设计.md`
- `后端集成指南.md`
- `快速实施清单.md`
