# 校园公告信息管理系统

基于 **Spring Boot + MyBatis + Thymeleaf + MySQL** 开发的校园公告信息管理系统，包含前台用户端与后台管理端，适合作为课程设计或 Java Web 方向作品展示项目。

---

## 项目简介

系统围绕校园公告发布与管理场景展开，支持公告浏览、分类筛选、标签管理、评论互动、收藏、后台数据统计和管理员操作日志等功能。

项目采用经典的三层架构设计：

- 表现层：Thymeleaf + Bootstrap + jQuery
- 业务层：Controller + Service
- 持久层：MyBatis + MySQL

---

## 核心功能

### 用户端

- 用户注册、登录、退出
- 验证码校验
- 公告浏览、详情查看、关键词搜索
- 分类筛选
- 公告收藏与取消收藏
- 个人资料维护与头像上传

### 管理端

- 管理员登录
- 公告增删改查
- 分类管理
- 标签管理
- 评论管理
- 数据统计
- 操作日志记录

---

## 技术栈

| 层级 | 技术方案 |
| --- | --- |
| 后端 | Spring Boot 2.7、MyBatis |
| 数据库 | MySQL 8 |
| 模板引擎 | Thymeleaf |
| 前端 | Bootstrap 4、jQuery |
| 构建工具 | Maven |
| 其他 | Kaptcha、Logback、文件上传 |

---

## 项目结构

```text
campus-notice-system/
|-- database/
|   `-- campus_notice.sql
|-- src/
|   `-- main/
|       |-- java/com/campus/notice/
|       `-- resources/
|-- pom.xml
|-- 快速开始.md
`-- 课程设计文档.md
```

---

## 快速开始

### 环境要求

- JDK 1.8+
- Maven 3.6+
- MySQL 8.0+

### 启动步骤

1. 创建数据库并导入 [`database/campus_notice.sql`](database/campus_notice.sql)
2. 修改 `src/main/resources/application.yml` 中的数据库配置
3. 在项目根目录执行：

```bash
mvn clean install
mvn spring-boot:run
```

4. 浏览器访问 `http://localhost:8080`

---

## 默认说明文档

仓库中保留了两份课程阶段文档，方便快速了解项目：

- [`快速开始.md`](快速开始.md)
- [`课程设计文档.md`](课程设计文档.md)

---

## 适合简历怎么写

> 独立完成基于 Spring Boot + MyBatis + Thymeleaf 的校园公告信息管理系统开发，实现公告发布、分类标签管理、评论收藏、后台统计与操作日志等功能，具备较完整的 Java Web 项目开发流程经验。

