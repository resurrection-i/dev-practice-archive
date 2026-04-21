import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Timeline, Typography, Button, Space } from 'antd';
import { 
  FileProtectOutlined, 
  SwapOutlined, 
  SearchOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import { ethers } from 'ethers';

const { Title, Paragraph } = Typography;

interface WalletState {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  connected: boolean;
}

interface HomePageProps {
  walletState: WalletState;
}

interface SystemStats {
  totalWorks: number;
  totalUsers: number;
  totalTransfers: number;
  totalVerifications: number;
  userWorks: number;
}

interface Activity {
  id: string;
  type: 'register' | 'transfer' | 'verify';
  user: string;
  content: string;
  timestamp: number;
  hash: string;
}

const HomePage: React.FC<HomePageProps> = ({ walletState }) => {
  const [stats, setStats] = useState<SystemStats>({
    totalWorks: 1247,
    totalUsers: 356,
    totalTransfers: 89,
    totalVerifications: 2341,
    userWorks: walletState.connected ? 5 : 0
  });

  const [recentActivities, setRecentActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'register',
      user: '张教授',
      content: '注册了学术论文《基于深度学习的图像识别算法研究》',
      timestamp: Date.now() - 3600000, // 1小时前
      hash: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456'
    },
    {
      type: 'transfer',
      title: '版权转让',
      description: '作品 #123 的版权从 0xabcd...efgh 转让给 0x9876...5432',
      time: '4小时前'
    },
    {
      type: 'verify',
      title: '侵权验证',
      description: '检测到潜在侵权行为，作品哈希: 0x7890...abcd',
      time: '6小时前'
    }
  ]);

  // 模拟获取系统统计数据
  useEffect(() => {
    const fetchStats = async () => {
      // 这里应该调用智能合约获取真实数据
      // 现在使用模拟数据
      setStats({
        totalWorks: 1247,
        totalTransfers: 89,
        totalVerifications: 3456,
        userWorks: walletState.connected ? 5 : 0
      });
    };

    fetchStats();
  }, [walletState.connected]);

  const features = [
    {
      icon: <FileProtectOutlined style={{ fontSize: '48px', color: '#1890ff' }} />,
      title: '权属存证',
      description: '上传学术成果哈希和作者信息，生成不可篡改的NFT存证记录，确保版权归属清晰可查。',
      action: '立即注册',
      link: '/register'
    },
    {
      icon: <SwapOutlined style={{ fontSize: '48px', color: '#52c41a' }} />,
      title: '版权转让',
      description: '支持安全的版权转让功能，需要原作者数字签名授权，完整记录转让历史轨迹。',
      action: '管理转让',
      link: '/transfer'
    },
    {
      icon: <SearchOutlined style={{ fontSize: '48px', color: '#faad14' }} />,
      title: '侵权验证',
      description: '提供公开验证接口，快速检测内容是否已被注册，支持批量验证和隐私保护验证。',
      action: '开始验证',
      link: '/verify'
    }
  ];

  return (
    <div>
      {/* 欢迎区域 */}
      <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
        <div style={{ color: 'white', textAlign: 'center', padding: '20px 0' }}>
          <Title level={2} style={{ color: 'white', marginBottom: 16 }}>
            欢迎使用学术版权存证系统
          </Title>
          <Paragraph style={{ color: 'white', fontSize: '16px', marginBottom: 24 }}>
            基于以太坊区块链技术，为学术成果提供安全、透明、不可篡改的版权保护服务
          </Paragraph>
          {!walletState.connected && (
            <Button type="primary" size="large" style={{ background: 'rgba(255,255,255,0.2)', borderColor: 'white' }}>
              连接钱包开始使用
            </Button>
          )}
        </div>
      </Card>

      {/* 统计数据 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总注册作品"
              value={stats.totalWorks}
              prefix={<FileProtectOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="版权转让次数"
              value={stats.totalTransfers}
              prefix={<SwapOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="验证查询次数"
              value={stats.totalVerifications}
              prefix={<SearchOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="我的作品"
              value={stats.userWorks}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 功能特性 */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        {features.map((feature, index) => (
          <Col span={8} key={index}>
            <Card
              hoverable
              style={{ textAlign: 'center', height: '100%' }}
              actions={[
                <Button type="primary" href={feature.link}>
                  {feature.action}
                </Button>
              ]}
            >
              <div style={{ padding: '20px 0' }}>
                {feature.icon}
                <Title level={4} style={{ marginTop: 16, marginBottom: 12 }}>
                  {feature.title}
                </Title>
                <Paragraph style={{ color: '#666', lineHeight: 1.6 }}>
                  {feature.description}
                </Paragraph>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 最近活动 */}
      <Row gutter={24}>
        <Col span={12}>
          <Card title="最近活动" extra={<Button type="link">查看全部</Button>}>
            <Timeline>
              {recentActivities.map((activity, index) => (
                <Timeline.Item
                  key={index}
                  dot={
                    activity.type === 'register' ? <FileProtectOutlined style={{ color: '#1890ff' }} /> :
                    activity.type === 'transfer' ? <SwapOutlined style={{ color: '#52c41a' }} /> :
                    <SearchOutlined style={{ color: '#faad14' }} />
                  }
                >
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                      {activity.title}
                    </div>
                    <div style={{ color: '#666', marginBottom: 4 }}>
                      {activity.description}
                    </div>
                    <div style={{ color: '#999', fontSize: '12px' }}>
                      <ClockCircleOutlined /> {activity.time}
                    </div>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="系统优势" extra={<TrophyOutlined style={{ color: '#faad14' }} />}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Title level={5} style={{ marginBottom: 8 }}>🔒 安全可靠</Title>
                <Paragraph style={{ marginBottom: 0, color: '#666' }}>
                  基于以太坊区块链，具备抗重入攻击能力，确保数据安全不可篡改
                </Paragraph>
              </div>
              
              <div>
                <Title level={5} style={{ marginBottom: 8 }}>🌐 去中心化</Title>
                <Paragraph style={{ marginBottom: 0, color: '#666' }}>
                  无需依赖中心化机构，全球任何地方都可以进行版权存证和验证
                </Paragraph>
              </div>
              
              <div>
                <Title level={5} style={{ marginBottom: 8 }}>🔍 透明可查</Title>
                <Paragraph style={{ marginBottom: 0, color: '#666' }}>
                  所有存证记录和转让历史完全透明，支持公开验证和溯源查询
                </Paragraph>
              </div>
              
              <div>
                <Title level={5} style={{ marginBottom: 8 }}>🛡️ 隐私保护</Title>
                <Paragraph style={{ marginBottom: 0, color: '#666' }}>
                  支持零知识证明技术，在保护隐私的同时验证版权归属
                </Paragraph>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
