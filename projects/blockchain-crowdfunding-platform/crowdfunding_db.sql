/*
 Navicat Premium Data Transfer

 Source Server         : mysql8
 Source Server Type    : MySQL
 Source Server Version : 80036
 Source Host           : localhost:3306
 Source Schema         : crowdfunding_db

 Target Server Type    : MySQL
 Target Server Version : 80036
 File Encoding         : 65001

 Date: 23/11/2025 09:39:09
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for funding_requests
-- ----------------------------
DROP TABLE IF EXISTS `funding_requests`;
CREATE TABLE `funding_requests`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '请求ID',
  `project_id` bigint NOT NULL COMMENT '项目ID',
  `blockchain_request_id` bigint NOT NULL COMMENT '区块链上的请求ID',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '资金用途描述',
  `amount` decimal(30, 18) NOT NULL COMMENT '请求金额(ETH)',
  `recipient_address` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '接收方地址',
  `approval_count` int NULL DEFAULT 0 COMMENT '批准票数',
  `required_approvals` int NOT NULL COMMENT '所需批准票数',
  `is_completed` tinyint NULL DEFAULT 0 COMMENT '是否已执行: 0-未执行, 1-已执行',
  `is_approved` tinyint NULL DEFAULT 0 COMMENT '是否已批准: 0-未批准, 1-已批准',
  `transaction_hash` varchar(66) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '执行交易哈希',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `completed_at` timestamp NULL DEFAULT NULL COMMENT '完成时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_project_id`(`project_id` ASC) USING BTREE,
  INDEX `idx_blockchain_request_id`(`blockchain_request_id` ASC) USING BTREE,
  INDEX `idx_is_completed`(`is_completed` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE,
  CONSTRAINT `funding_requests_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '资金请求表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of funding_requests
-- ----------------------------

-- ----------------------------
-- Table structure for notifications
-- ----------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '通知ID',
  `user_id` bigint NOT NULL COMMENT '接收用户ID',
  `notification_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '通知类型: PROJECT_FUNDED, REQUEST_CREATED, VOTE_RESULT等',
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '通知标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '通知内容',
  `related_id` bigint NULL DEFAULT NULL COMMENT '关联ID(项目ID/请求ID等)',
  `related_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '关联类型: PROJECT, REQUEST, TRANSACTION',
  `is_read` tinyint NULL DEFAULT 0 COMMENT '是否已读: 0-未读, 1-已读',
  `read_at` timestamp NULL DEFAULT NULL COMMENT '阅读时间',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_is_read`(`is_read` ASC) USING BTREE,
  INDEX `idx_notification_type`(`notification_type` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE,
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '通知消息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of notifications
-- ----------------------------

-- ----------------------------
-- Table structure for operation_logs
-- ----------------------------
DROP TABLE IF EXISTS `operation_logs`;
CREATE TABLE `operation_logs`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `user_id` bigint NULL DEFAULT NULL COMMENT '用户ID',
  `operation_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '操作类型: LOGIN, REGISTER, CREATE_PROJECT, FUND, VOTE等',
  `operation_desc` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '操作描述',
  `ip_address` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'IP地址',
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '用户代理',
  `request_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '请求URL',
  `request_method` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '请求方法',
  `request_params` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '请求参数',
  `response_status` int NULL DEFAULT NULL COMMENT '响应状态码',
  `error_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '错误信息',
  `execution_time` int NULL DEFAULT NULL COMMENT '执行时间(毫秒)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_operation_type`(`operation_type` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE,
  CONSTRAINT `operation_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '操作日志表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of operation_logs
-- ----------------------------

-- ----------------------------
-- Table structure for project_contributors
-- ----------------------------
DROP TABLE IF EXISTS `project_contributors`;
CREATE TABLE `project_contributors`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `project_id` bigint NOT NULL COMMENT '项目ID',
  `user_id` bigint NULL DEFAULT NULL COMMENT '用户ID',
  `contributor_address` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '贡献者地址',
  `total_contribution` decimal(30, 18) NOT NULL DEFAULT 0.000000000000000000 COMMENT '总贡献金额(ETH)',
  `contribution_count` int NULL DEFAULT 0 COMMENT '贡献次数',
  `first_contribution_at` timestamp NOT NULL COMMENT '首次贡献时间',
  `last_contribution_at` timestamp NOT NULL COMMENT '最后贡献时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_project_contributor`(`project_id` ASC, `contributor_address` ASC) USING BTREE,
  INDEX `idx_project_id`(`project_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_contributor_address`(`contributor_address` ASC) USING BTREE,
  INDEX `idx_total_contribution`(`total_contribution` ASC) USING BTREE,
  INDEX `idx_contributors_project_contribution`(`project_id` ASC, `total_contribution` DESC) USING BTREE,
  CONSTRAINT `project_contributors_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `project_contributors_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '项目贡献者表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of project_contributors
-- ----------------------------

-- ----------------------------
-- Table structure for projects
-- ----------------------------
DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '数据库项目ID',
  `blockchain_id` bigint NOT NULL COMMENT '区块链上的项目ID',
  `user_id` bigint NOT NULL COMMENT '创建者用户ID',
  `creator_address` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建者钱包地址',
  `project_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '项目名称',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '项目描述',
  `goal_amount` decimal(30, 18) NOT NULL COMMENT '目标金额(ETH)',
  `current_amount` decimal(30, 18) NULL DEFAULT 0.000000000000000000 COMMENT '当前募集金额(ETH)',
  `contributors_count` int NULL DEFAULT 0 COMMENT '贡献者数量',
  `deadline` timestamp NOT NULL COMMENT '截止时间',
  `is_completed` tinyint NULL DEFAULT 0 COMMENT '是否完成: 0-进行中, 1-已完成',
  `is_successful` tinyint NULL DEFAULT 0 COMMENT '是否成功: 0-未达标, 1-已达标',
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '项目分类: 科技/艺术/公益/教育等',
  `cover_image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '封面图片URL',
  `video_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '视频介绍URL',
  `contract_address` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '合约地址',
  `transaction_hash` varchar(66) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '创建交易哈希',
  `block_number` bigint NULL DEFAULT NULL COMMENT '创建区块号',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `completed_at` timestamp NULL DEFAULT NULL COMMENT '完成时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `blockchain_id`(`blockchain_id` ASC) USING BTREE,
  INDEX `idx_blockchain_id`(`blockchain_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_creator_address`(`creator_address` ASC) USING BTREE,
  INDEX `idx_deadline`(`deadline` ASC) USING BTREE,
  INDEX `idx_is_completed`(`is_completed` ASC) USING BTREE,
  INDEX `idx_category`(`category` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE,
  INDEX `idx_projects_status_deadline`(`is_completed` ASC, `deadline` ASC) USING BTREE,
  FULLTEXT INDEX `idx_fulltext_search`(`project_name`, `description`),
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '项目表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of projects
-- ----------------------------

-- ----------------------------
-- Table structure for system_config
-- ----------------------------
DROP TABLE IF EXISTS `system_config`;
CREATE TABLE `system_config`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  `config_key` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '配置键',
  `config_value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '配置值',
  `config_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'STRING' COMMENT '配置类型: STRING, NUMBER, BOOLEAN, JSON',
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '配置描述',
  `is_public` tinyint NULL DEFAULT 0 COMMENT '是否公开: 0-私有, 1-公开',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `config_key`(`config_key` ASC) USING BTREE,
  INDEX `idx_config_key`(`config_key` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '系统配置表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of system_config
-- ----------------------------
INSERT INTO `system_config` VALUES (1, 'contract_address', '0x5FbDB2315678afecb367f032d93F642f64180aa3', 'STRING', '智能合约地址', 1, '2025-11-22 22:01:03', '2025-11-22 22:01:03');
INSERT INTO `system_config` VALUES (2, 'network_name', 'Hardhat Local', 'STRING', '区块链网络名称', 1, '2025-11-22 22:01:03', '2025-11-22 22:01:03');
INSERT INTO `system_config` VALUES (3, 'chain_id', '31337', 'NUMBER', '链ID', 1, '2025-11-22 22:01:03', '2025-11-22 22:01:03');
INSERT INTO `system_config` VALUES (4, 'rpc_url', 'http://localhost:8545', 'STRING', 'RPC节点地址', 1, '2025-11-22 22:01:03', '2025-11-22 22:01:03');
INSERT INTO `system_config` VALUES (5, 'min_contribution', '0.01', 'NUMBER', '最小捐款金额(ETH)', 1, '2025-11-22 22:01:03', '2025-11-22 22:01:03');
INSERT INTO `system_config` VALUES (6, 'max_contribution', '1000', 'NUMBER', '最大捐款金额(ETH)', 1, '2025-11-22 22:01:03', '2025-11-22 22:01:03');
INSERT INTO `system_config` VALUES (7, 'platform_fee_rate', '0', 'NUMBER', '平台手续费率(%)', 1, '2025-11-22 22:01:03', '2025-11-22 22:01:03');
INSERT INTO `system_config` VALUES (8, 'jwt_secret', 'your-secret-key-change-in-production', 'STRING', 'JWT密钥', 0, '2025-11-22 22:01:03', '2025-11-22 22:01:03');
INSERT INTO `system_config` VALUES (9, 'jwt_expiration', '86400', 'NUMBER', 'JWT过期时间(秒)', 0, '2025-11-22 22:01:03', '2025-11-22 22:01:03');
INSERT INTO `system_config` VALUES (10, 'email_enabled', 'false', 'BOOLEAN', '是否启用邮件通知', 1, '2025-11-22 22:01:03', '2025-11-22 22:01:03');

-- ----------------------------
-- Table structure for transactions
-- ----------------------------
DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '交易ID',
  `project_id` bigint NOT NULL COMMENT '项目ID',
  `user_id` bigint NULL DEFAULT NULL COMMENT '用户ID(如果已注册)',
  `from_address` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '发送方地址',
  `to_address` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '接收方地址(合约地址)',
  `amount` decimal(30, 18) NOT NULL COMMENT '交易金额(ETH)',
  `transaction_hash` varchar(66) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '交易哈希',
  `block_number` bigint NOT NULL COMMENT '区块号',
  `block_timestamp` timestamp NOT NULL COMMENT '区块时间',
  `gas_used` bigint NULL DEFAULT NULL COMMENT '消耗的Gas',
  `gas_price` decimal(30, 18) NULL DEFAULT NULL COMMENT 'Gas价格(Gwei)',
  `transaction_fee` decimal(30, 18) NULL DEFAULT NULL COMMENT '交易手续费(ETH)',
  `status` tinyint NULL DEFAULT 1 COMMENT '交易状态: 0-失败, 1-成功, 2-待确认',
  `transaction_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'FUNDING' COMMENT '交易类型: FUNDING-捐款, WITHDRAW-提现, REFUND-退款',
  `memo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '备注信息',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `transaction_hash`(`transaction_hash` ASC) USING BTREE,
  INDEX `idx_project_id`(`project_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_from_address`(`from_address` ASC) USING BTREE,
  INDEX `idx_transaction_hash`(`transaction_hash` ASC) USING BTREE,
  INDEX `idx_block_number`(`block_number` ASC) USING BTREE,
  INDEX `idx_block_timestamp`(`block_timestamp` ASC) USING BTREE,
  INDEX `idx_transaction_type`(`transaction_type` ASC) USING BTREE,
  INDEX `idx_transactions_project_time`(`project_id` ASC, `block_timestamp` ASC) USING BTREE,
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '交易记录表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of transactions
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '密码(BCrypt加密)',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '邮箱',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '手机号',
  `avatar_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '头像URL',
  `real_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '真实姓名',
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '个人简介',
  `status` tinyint NULL DEFAULT 1 COMMENT '账户状态: 0-禁用, 1-正常, 2-锁定',
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'USER' COMMENT '用户角色: USER, ADMIN',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `last_login_at` timestamp NULL DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '最后登录IP',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE,
  UNIQUE INDEX `email`(`email` ASC) USING BTREE,
  INDEX `idx_username`(`username` ASC) USING BTREE,
  INDEX `idx_email`(`email` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'admin@crowdfunding.com', NULL, NULL, '管理员', '平台管理员账户', 1, 'ADMIN', '2025-11-22 22:01:03', '2025-11-22 22:01:03', NULL, NULL);
INSERT INTO `users` VALUES (2, 'testuser1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'user1@test.com', NULL, NULL, '测试用户1', '这是一个测试用户', 1, 'USER', '2025-11-22 22:01:03', '2025-11-22 22:01:03', NULL, NULL);
INSERT INTO `users` VALUES (3, 'testuser2', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'user2@test.com', NULL, NULL, '测试用户2', '这是另一个测试用户', 1, 'USER', '2025-11-22 22:01:03', '2025-11-22 22:01:03', NULL, NULL);
INSERT INTO `users` VALUES (4, '猪脚饭', '$2a$10$jGWqmCnOdQwqMa/224P.b.9.f1We4yEFviDct5LBoO5xMSYXwQR4.', 'zhujiaofan@zhujiaofan.com', NULL, NULL, '', NULL, 1, 'USER', '2025-11-22 22:24:43', '2025-11-22 22:24:43', '2025-11-23 09:16:01', NULL);
INSERT INTO `users` VALUES (5, '54321', '$2a$10$reIiVk8re/tyaHCoFDWkxOQ2HfR1I0RzXN8OmuWC834cfp1QQS.Tu', '54321@54321', NULL, NULL, '', NULL, 1, 'USER', '2025-11-23 01:49:25', '2025-11-23 01:49:25', '2025-11-23 09:25:14', NULL);
INSERT INTO `users` VALUES (9, '小金毛', '$2a$10$PD7HA6gJmvbn2s.qVdR6V.iHM0Rz2tXXWEnlhgGNY6507waIdEqAu', 'xiaojin@xiaojinmao', NULL, NULL, '', NULL, 1, 'USER', '2025-11-23 09:13:57', '2025-11-23 09:13:57', '2025-11-23 09:26:40', NULL);
INSERT INTO `users` VALUES (10, '小白a ', '$2a$10$a4fF0xNNKRAJd0wi.F5C0e6JJNBCbIG9JOaZd6e7Ki/9hikhQr5wi', 'xiaobai@xiaobai', NULL, NULL, '', NULL, 1, 'USER', '2025-11-23 09:22:23', '2025-11-23 09:22:23', '2025-11-23 09:27:08', NULL);

-- ----------------------------
-- Table structure for votes
-- ----------------------------
DROP TABLE IF EXISTS `votes`;
CREATE TABLE `votes`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '投票ID',
  `funding_request_id` bigint NOT NULL COMMENT '资金请求ID',
  `user_id` bigint NULL DEFAULT NULL COMMENT '投票用户ID',
  `voter_address` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '投票者地址',
  `vote_type` tinyint NOT NULL COMMENT '投票类型: 1-赞成, 0-反对',
  `transaction_hash` varchar(66) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '投票交易哈希',
  `voted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '投票时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_request_voter`(`funding_request_id` ASC, `voter_address` ASC) USING BTREE,
  INDEX `idx_funding_request_id`(`funding_request_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_voter_address`(`voter_address` ASC) USING BTREE,
  INDEX `idx_voted_at`(`voted_at` ASC) USING BTREE,
  CONSTRAINT `votes_ibfk_1` FOREIGN KEY (`funding_request_id`) REFERENCES `funding_requests` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `votes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '投票记录表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of votes
-- ----------------------------

-- ----------------------------
-- Table structure for wallet_addresses
-- ----------------------------
DROP TABLE IF EXISTS `wallet_addresses`;
CREATE TABLE `wallet_addresses`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '钱包ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `wallet_address` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '以太坊钱包地址(0x开头)',
  `wallet_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '钱包别名',
  `is_primary` tinyint NULL DEFAULT 0 COMMENT '是否为主钱包: 0-否, 1-是',
  `is_verified` tinyint NULL DEFAULT 0 COMMENT '是否已验证: 0-未验证, 1-已验证',
  `verified_at` timestamp NULL DEFAULT NULL COMMENT '验证时间',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '绑定时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `wallet_address`(`wallet_address` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_wallet_address`(`wallet_address` ASC) USING BTREE,
  INDEX `idx_is_primary`(`is_primary` ASC) USING BTREE,
  CONSTRAINT `wallet_addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '钱包地址表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of wallet_addresses
-- ----------------------------
INSERT INTO `wallet_addresses` VALUES (1, 1, '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 'Admin Wallet', 1, 1, '2025-11-22 22:01:03', '2025-11-22 22:01:03', '2025-11-22 22:01:03');
INSERT INTO `wallet_addresses` VALUES (2, 2, '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 'User1 Wallet', 1, 1, '2025-11-22 22:01:03', '2025-11-22 22:01:03', '2025-11-22 22:01:03');
INSERT INTO `wallet_addresses` VALUES (3, 3, '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', 'User2 Wallet', 1, 1, '2025-11-22 22:01:03', '2025-11-22 22:01:03', '2025-11-22 22:01:03');
INSERT INTO `wallet_addresses` VALUES (4, 5, '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199', NULL, 1, 1, '2025-11-23 02:07:29', '2025-11-23 02:07:29', '2025-11-23 02:07:29');
INSERT INTO `wallet_addresses` VALUES (5, 4, '0xdd2fd4581271e230360230f9337d5c0430bf44c0', NULL, 1, 1, '2025-11-23 02:19:44', '2025-11-23 02:19:44', '2025-11-23 02:19:44');
INSERT INTO `wallet_addresses` VALUES (8, 9, '0x2546bcd3c84621e976d8185a91a922ae77ecec30', NULL, 1, 1, '2025-11-23 09:15:01', '2025-11-23 09:15:01', '2025-11-23 09:15:01');
INSERT INTO `wallet_addresses` VALUES (9, 10, '0x71be63f3384f5fb98995898a86b02fb2426c5788', NULL, 1, 1, '2025-11-23 09:22:58', '2025-11-23 09:22:58', '2025-11-23 09:22:58');

-- ----------------------------
-- View structure for v_project_statistics
-- ----------------------------
DROP VIEW IF EXISTS `v_project_statistics`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_project_statistics` AS select `p`.`id` AS `id`,`p`.`blockchain_id` AS `blockchain_id`,`p`.`project_name` AS `project_name`,`p`.`goal_amount` AS `goal_amount`,`p`.`current_amount` AS `current_amount`,`p`.`contributors_count` AS `contributors_count`,`p`.`deadline` AS `deadline`,`p`.`is_completed` AS `is_completed`,`p`.`is_successful` AS `is_successful`,`u`.`username` AS `creator_username`,count(distinct `t`.`id`) AS `transaction_count`,sum(`t`.`amount`) AS `total_transaction_amount`,count(distinct `fr`.`id`) AS `funding_request_count`,(case when (`p`.`current_amount` >= `p`.`goal_amount`) then '已达标' when (now() > `p`.`deadline`) then '已截止' else '进行中' end) AS `project_status`,round(((`p`.`current_amount` / `p`.`goal_amount`) * 100),2) AS `completion_percentage` from (((`projects` `p` left join `users` `u` on((`p`.`user_id` = `u`.`id`))) left join `transactions` `t` on((`p`.`id` = `t`.`project_id`))) left join `funding_requests` `fr` on((`p`.`id` = `fr`.`project_id`))) group by `p`.`id`;

-- ----------------------------
-- View structure for v_user_statistics
-- ----------------------------
DROP VIEW IF EXISTS `v_user_statistics`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_user_statistics` AS select `u`.`id` AS `id`,`u`.`username` AS `username`,`u`.`email` AS `email`,`u`.`created_at` AS `created_at`,count(distinct `p`.`id`) AS `created_projects_count`,count(distinct `pc`.`project_id`) AS `contributed_projects_count`,coalesce(sum(`pc`.`total_contribution`),0) AS `total_contribution_amount`,count(distinct `v`.`id`) AS `total_votes_count` from (((`users` `u` left join `projects` `p` on((`u`.`id` = `p`.`user_id`))) left join `project_contributors` `pc` on((`u`.`id` = `pc`.`user_id`))) left join `votes` `v` on((`u`.`id` = `v`.`user_id`))) group by `u`.`id`;

-- ----------------------------
-- Procedure structure for sp_record_transaction
-- ----------------------------
DROP PROCEDURE IF EXISTS `sp_record_transaction`;
delimiter ;;
CREATE PROCEDURE `sp_record_transaction`(IN p_project_id BIGINT,
    IN p_user_id BIGINT,
    IN p_from_address VARCHAR(42),
    IN p_to_address VARCHAR(42),
    IN p_amount DECIMAL(30, 18),
    IN p_transaction_hash VARCHAR(66),
    IN p_block_number BIGINT,
    IN p_block_timestamp TIMESTAMP)
BEGIN
    DECLARE v_project_blockchain_id BIGINT;
    
    -- 插入交易记录
    INSERT INTO transactions (
        project_id, user_id, from_address, to_address, amount,
        transaction_hash, block_number, block_timestamp, transaction_type
    ) VALUES (
        p_project_id, p_user_id, p_from_address, p_to_address, p_amount,
        p_transaction_hash, p_block_number, p_block_timestamp, 'FUNDING'
    );
    
    -- 更新项目当前金额
    UPDATE projects 
    SET current_amount = current_amount + p_amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_project_id;
    
    -- 更新或插入贡献者记录
    INSERT INTO project_contributors (
        project_id, user_id, contributor_address, 
        total_contribution, contribution_count,
        first_contribution_at, last_contribution_at
    ) VALUES (
        p_project_id, p_user_id, p_from_address,
        p_amount, 1, p_block_timestamp, p_block_timestamp
    )
    ON DUPLICATE KEY UPDATE
        total_contribution = total_contribution + p_amount,
        contribution_count = contribution_count + 1,
        last_contribution_at = p_block_timestamp;
        
    -- 更新贡献者数量
    UPDATE projects 
    SET contributors_count = (
        SELECT COUNT(DISTINCT contributor_address) 
        FROM project_contributors 
        WHERE project_id = p_project_id
    )
    WHERE id = p_project_id;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for sp_sync_project
-- ----------------------------
DROP PROCEDURE IF EXISTS `sp_sync_project`;
delimiter ;;
CREATE PROCEDURE `sp_sync_project`(IN p_blockchain_id BIGINT,
    IN p_user_id BIGINT,
    IN p_creator_address VARCHAR(42),
    IN p_project_name VARCHAR(200),
    IN p_description TEXT,
    IN p_goal_amount DECIMAL(30, 18),
    IN p_deadline TIMESTAMP,
    IN p_transaction_hash VARCHAR(66),
    IN p_block_number BIGINT)
BEGIN
    INSERT INTO projects (
        blockchain_id, user_id, creator_address, project_name, 
        description, goal_amount, deadline, transaction_hash, block_number
    ) VALUES (
        p_blockchain_id, p_user_id, p_creator_address, p_project_name,
        p_description, p_goal_amount, p_deadline, p_transaction_hash, p_block_number
    )
    ON DUPLICATE KEY UPDATE
        current_amount = VALUES(current_amount),
        contributors_count = VALUES(contributors_count),
        updated_at = CURRENT_TIMESTAMP;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table projects
-- ----------------------------
DROP TRIGGER IF EXISTS `tr_after_project_insert`;
delimiter ;;
CREATE TRIGGER `tr_after_project_insert` AFTER INSERT ON `projects` FOR EACH ROW BEGIN
    INSERT INTO notifications (user_id, notification_type, title, content, related_id, related_type)
    VALUES (
        NEW.user_id,
        'PROJECT_CREATED',
        '项目创建成功',
        CONCAT('您的项目"', NEW.project_name, '"已成功创建并上链'),
        NEW.id,
        'PROJECT'
    );
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table transactions
-- ----------------------------
DROP TRIGGER IF EXISTS `tr_after_transaction_insert`;
delimiter ;;
CREATE TRIGGER `tr_after_transaction_insert` AFTER INSERT ON `transactions` FOR EACH ROW BEGIN
    DECLARE v_project_name VARCHAR(200);
    DECLARE v_creator_id BIGINT;
    
    -- 获取项目信息
    SELECT project_name, user_id INTO v_project_name, v_creator_id
    FROM projects WHERE id = NEW.project_id;
    
    -- 通知项目创建者
    IF v_creator_id IS NOT NULL THEN
        INSERT INTO notifications (user_id, notification_type, title, content, related_id, related_type)
        VALUES (
            v_creator_id,
            'PROJECT_FUNDED',
            '收到新的捐款',
            CONCAT('您的项目"', v_project_name, '"收到了', NEW.amount, ' ETH的捐款'),
            NEW.project_id,
            'PROJECT'
        );
    END IF;
    
    -- 通知捐款者
    IF NEW.user_id IS NOT NULL THEN
        INSERT INTO notifications (user_id, notification_type, title, content, related_id, related_type)
        VALUES (
            NEW.user_id,
            'FUNDING_SUCCESS',
            '捐款成功',
            CONCAT('您已成功向项目"', v_project_name, '"捐款', NEW.amount, ' ETH'),
            NEW.project_id,
            'PROJECT'
        );
    END IF;
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
