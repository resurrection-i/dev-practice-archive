-- SQLite 数据库初始化脚本
-- 区块链众筹平台

-- ============================
-- 用户表
-- ============================
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    real_name VARCHAR(50),
    bio TEXT,
    status INTEGER DEFAULT 1,  -- 0-禁用, 1-正常, 2-锁定
    role VARCHAR(20) DEFAULT 'USER',  -- USER, ADMIN
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    last_login_ip VARCHAR(50)
);

-- ============================
-- 钱包地址表
-- ============================
CREATE TABLE IF NOT EXISTS wallet_addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    wallet_name VARCHAR(50),
    is_primary INTEGER DEFAULT 0,  -- 0-否, 1-是
    is_verified INTEGER DEFAULT 0,  -- 0-未验证, 1-已验证
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================
-- 项目表
-- ============================
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    blockchain_id INTEGER NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    creator_address VARCHAR(42) NOT NULL,
    project_name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    goal_amount DECIMAL(30, 18) NOT NULL,
    current_amount DECIMAL(30, 18) DEFAULT 0,
    contributors_count INTEGER DEFAULT 0,
    deadline TIMESTAMP NOT NULL,
    is_completed INTEGER DEFAULT 0,  -- 0-进行中, 1-已完成
    is_successful INTEGER DEFAULT 0,  -- 0-未达标, 1-已达标
    category VARCHAR(50),
    cover_image_url VARCHAR(500),
    video_url VARCHAR(500),
    contract_address VARCHAR(42),
    transaction_hash VARCHAR(66),
    block_number INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================
-- 项目贡献者表
-- ============================
CREATE TABLE IF NOT EXISTS project_contributors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    user_id INTEGER,
    contributor_address VARCHAR(42) NOT NULL,
    total_contribution DECIMAL(30, 18) NOT NULL DEFAULT 0,
    contribution_count INTEGER DEFAULT 0,
    first_contribution_at TIMESTAMP NOT NULL,
    last_contribution_at TIMESTAMP NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(project_id, contributor_address)
);

-- ============================
-- 交易记录表
-- ============================
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    user_id INTEGER,
    from_address VARCHAR(42) NOT NULL,
    to_address VARCHAR(42) NOT NULL,
    amount DECIMAL(30, 18) NOT NULL,
    transaction_hash VARCHAR(66) NOT NULL UNIQUE,
    block_number INTEGER NOT NULL,
    block_timestamp TIMESTAMP NOT NULL,
    gas_used INTEGER,
    gas_price DECIMAL(30, 18),
    transaction_fee DECIMAL(30, 18),
    status INTEGER DEFAULT 1,  -- 0-失败, 1-成功, 2-待确认
    transaction_type VARCHAR(20) DEFAULT 'FUNDING',  -- FUNDING, WITHDRAW, REFUND
    memo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================
-- 资金请求表
-- ============================
CREATE TABLE IF NOT EXISTS funding_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    blockchain_request_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(30, 18) NOT NULL,
    recipient_address VARCHAR(42) NOT NULL,
    approval_count INTEGER DEFAULT 0,
    required_approvals INTEGER NOT NULL,
    is_completed INTEGER DEFAULT 0,  -- 0-未执行, 1-已执行
    is_approved INTEGER DEFAULT 0,  -- 0-未批准, 1-已批准
    transaction_hash VARCHAR(66),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- ============================
-- 投票记录表
-- ============================
CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    funding_request_id INTEGER NOT NULL,
    user_id INTEGER,
    voter_address VARCHAR(42) NOT NULL,
    vote_type INTEGER NOT NULL,  -- 1-赞成, 0-反对
    transaction_hash VARCHAR(66),
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (funding_request_id) REFERENCES funding_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(funding_request_id, voter_address)
);

-- ============================
-- 通知消息表
-- ============================
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    related_id INTEGER,
    related_type VARCHAR(50),
    is_read INTEGER DEFAULT 0,  -- 0-未读, 1-已读
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================
-- 操作日志表
-- ============================
CREATE TABLE IF NOT EXISTS operation_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    operation_type VARCHAR(50) NOT NULL,
    operation_desc VARCHAR(500),
    ip_address VARCHAR(50),
    user_agent TEXT,
    request_url VARCHAR(500),
    request_method VARCHAR(10),
    request_params TEXT,
    response_status INTEGER,
    error_message TEXT,
    execution_time INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================
-- 系统配置表
-- ============================
CREATE TABLE IF NOT EXISTS system_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    config_type VARCHAR(20) DEFAULT 'STRING',
    description VARCHAR(500),
    is_public INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- 创建索引
-- ============================

-- 用户表索引
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- 钱包地址表索引
CREATE INDEX IF NOT EXISTS idx_wallet_user_id ON wallet_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_address ON wallet_addresses(wallet_address);
CREATE INDEX IF NOT EXISTS idx_wallet_is_primary ON wallet_addresses(is_primary);

-- 项目表索引
CREATE INDEX IF NOT EXISTS idx_projects_blockchain_id ON projects(blockchain_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_creator_address ON projects(creator_address);
CREATE INDEX IF NOT EXISTS idx_projects_deadline ON projects(deadline);
CREATE INDEX IF NOT EXISTS idx_projects_is_completed ON projects(is_completed);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- 项目贡献者表索引
CREATE INDEX IF NOT EXISTS idx_contributors_project_id ON project_contributors(project_id);
CREATE INDEX IF NOT EXISTS idx_contributors_user_id ON project_contributors(user_id);
CREATE INDEX IF NOT EXISTS idx_contributors_address ON project_contributors(contributor_address);
CREATE INDEX IF NOT EXISTS idx_contributors_total ON project_contributors(total_contribution);

-- 交易记录表索引
CREATE INDEX IF NOT EXISTS idx_transactions_project_id ON transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_from_address ON transactions(from_address);
CREATE INDEX IF NOT EXISTS idx_transactions_hash ON transactions(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_transactions_block_number ON transactions(block_number);
CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(block_timestamp);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);

-- 资金请求表索引
CREATE INDEX IF NOT EXISTS idx_funding_requests_project_id ON funding_requests(project_id);
CREATE INDEX IF NOT EXISTS idx_funding_requests_blockchain_id ON funding_requests(blockchain_request_id);
CREATE INDEX IF NOT EXISTS idx_funding_requests_is_completed ON funding_requests(is_completed);
CREATE INDEX IF NOT EXISTS idx_funding_requests_created_at ON funding_requests(created_at);

-- 投票记录表索引
CREATE INDEX IF NOT EXISTS idx_votes_request_id ON votes(funding_request_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_voter_address ON votes(voter_address);
CREATE INDEX IF NOT EXISTS idx_votes_voted_at ON votes(voted_at);

-- 通知消息表索引
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- 操作日志表索引
CREATE INDEX IF NOT EXISTS idx_operation_logs_user_id ON operation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_operation_logs_type ON operation_logs(operation_type);
CREATE INDEX IF NOT EXISTS idx_operation_logs_created_at ON operation_logs(created_at);

-- 系统配置表索引
CREATE INDEX IF NOT EXISTS idx_system_config_key ON system_config(config_key);

-- ============================
-- 插入初始数据
-- ============================

-- 插入管理员用户 (密码: admin123)
INSERT OR IGNORE INTO users (id, username, password, email, real_name, bio, status, role) 
VALUES (1, 'admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'admin@crowdfunding.com', '管理员', '平台管理员账户', 1, 'ADMIN');

-- 插入测试用户1 (密码: test123)
INSERT OR IGNORE INTO users (id, username, password, email, real_name, bio, status, role) 
VALUES (2, 'testuser1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'user1@test.com', '测试用户1', '这是一个测试用户', 1, 'USER');

-- 插入测试用户2 (密码: test123)
INSERT OR IGNORE INTO users (id, username, password, email, real_name, bio, status, role) 
VALUES (3, 'testuser2', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'user2@test.com', '测试用户2', '这是另一个测试用户', 1, 'USER');

-- 插入测试钱包地址
INSERT OR IGNORE INTO wallet_addresses (id, user_id, wallet_address, wallet_name, is_primary, is_verified, verified_at) 
VALUES (1, 1, '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 'Admin Wallet', 1, 1, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO wallet_addresses (id, user_id, wallet_address, wallet_name, is_primary, is_verified, verified_at) 
VALUES (2, 2, '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 'User1 Wallet', 1, 1, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO wallet_addresses (id, user_id, wallet_address, wallet_name, is_primary, is_verified, verified_at) 
VALUES (3, 3, '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', 'User2 Wallet', 1, 1, CURRENT_TIMESTAMP);

-- 插入系统配置
INSERT OR IGNORE INTO system_config (config_key, config_value, config_type, description, is_public) 
VALUES ('contract_address', '0x5FbDB2315678afecb367f032d93F642f64180aa3', 'STRING', '智能合约地址', 1);

INSERT OR IGNORE INTO system_config (config_key, config_value, config_type, description, is_public) 
VALUES ('network_name', 'Hardhat Local', 'STRING', '区块链网络名称', 1);

INSERT OR IGNORE INTO system_config (config_key, config_value, config_type, description, is_public) 
VALUES ('chain_id', '31337', 'NUMBER', '链ID', 1);

INSERT OR IGNORE INTO system_config (config_key, config_value, config_type, description, is_public) 
VALUES ('rpc_url', 'http://localhost:8545', 'STRING', 'RPC节点地址', 1);

INSERT OR IGNORE INTO system_config (config_key, config_value, config_type, description, is_public) 
VALUES ('min_contribution', '0.01', 'NUMBER', '最小捐款金额(ETH)', 1);

INSERT OR IGNORE INTO system_config (config_key, config_value, config_type, description, is_public) 
VALUES ('max_contribution', '1000', 'NUMBER', '最大捐款金额(ETH)', 1);

INSERT OR IGNORE INTO system_config (config_key, config_value, config_type, description, is_public) 
VALUES ('platform_fee_rate', '0', 'NUMBER', '平台手续费率(%)', 1);

INSERT OR IGNORE INTO system_config (config_key, config_value, config_type, description, is_public) 
VALUES ('jwt_secret', 'your-secret-key-change-in-production', 'STRING', 'JWT密钥', 0);

INSERT OR IGNORE INTO system_config (config_key, config_value, config_type, description, is_public) 
VALUES ('jwt_expiration', '86400', 'NUMBER', 'JWT过期时间(秒)', 0);

INSERT OR IGNORE INTO system_config (config_key, config_value, config_type, description, is_public) 
VALUES ('email_enabled', 'false', 'BOOLEAN', '是否启用邮件通知', 1);
