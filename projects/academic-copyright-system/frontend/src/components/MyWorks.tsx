import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Typography,
  Space,
  Tag,
  Modal,
  Descriptions,
  Timeline,
  message,
  Input,
  Tooltip
} from 'antd';
import { 
  UserOutlined, 
  EyeOutlined,
  HistoryOutlined,
  CopyOutlined,
  SwapOutlined,
  FileProtectOutlined
} from '@ant-design/icons';
import { ethers } from 'ethers';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

interface WalletState {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  connected: boolean;
}

interface MyWorksProps {
  walletState: WalletState;
}

interface WorkInfo {
  tokenId: string;
  contentHash: string;
  title: string;
  authors: string[];
  workType: string;
  timestamp: number;
  originalAuthor: string;
  currentOwner: string;
  metadata: string;
}

interface TransferRecord {
  from: string;
  to: string;
  timestamp: number;
  reason: string;
}

const MyWorks: React.FC<MyWorksProps> = ({ walletState }) => {
  const [loading, setLoading] = useState(false);
  const [works, setWorks] = useState<WorkInfo[]>([]);
  const [filteredWorks, setFilteredWorks] = useState<WorkInfo[]>([]);
  const [selectedWork, setSelectedWork] = useState<WorkInfo | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [transferHistory, setTransferHistory] = useState<TransferRecord[]>([]);
  const [searchText, setSearchText] = useState('');

  // 合约地址和ABI
  const CONTRACT_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  const CONTRACT_ABI = [
    "function getAuthorWorks(address author) view returns (uint256[])",
    "function getWorkDetails(uint256 tokenId) view returns (tuple(uint256 tokenId, string contentHash, string title, string[] authors, string workType, uint256 timestamp, address originalAuthor, address currentOwner, bool isActive, string metadata))",
    "function getTransferHistory(uint256 tokenId) view returns (tuple(address from, address to, uint256 timestamp, string reason, bytes signature)[])"
  ];

  // 模拟数据
  const generateMockData = (): WorkInfo[] => {
    const currentTime = Date.now();
    const mockWorks: WorkInfo[] = [
      {
        tokenId: "1001",
        contentHash: "0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
        title: "基于深度学习的图像识别算法研究",
        authors: ["张教授", "李博士", "王研究员"],
        workType: "学术论文",
        timestamp: currentTime - 86400000 * 30, // 30天前
        originalAuthor: walletState.account || "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
        currentOwner: walletState.account || "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
        metadata: "发表于《计算机视觉期刊》2024年第3期"
      },
      {
        tokenId: "1002", 
        contentHash: "0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567",
        title: "区块链技术在供应链管理中的应用",
        authors: ["陈教授", "刘博士"],
        workType: "专利申请",
        timestamp: currentTime - 86400000 * 15, // 15天前
        originalAuthor: walletState.account || "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
        currentOwner: "0x8ba1f109551bD432803012645Hac136c34c0532925", // 已转让
        metadata: "专利申请号：CN202400123456"
      },
      {
        tokenId: "1003",
        contentHash: "0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678",
        title: "人工智能在医疗诊断中的伦理问题研究",
        authors: ["赵教授", "孙博士", "周研究员", "吴教授"],
        workType: "学术论文",
        timestamp: currentTime - 86400000 * 7, // 7天前
        originalAuthor: walletState.account || "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
        currentOwner: walletState.account || "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
        metadata: "已被《医学伦理学报》接收"
      },
      {
        tokenId: "1004",
        contentHash: "0xd4e5f6789012345678901234567890abcdef1234567890abcdef123456789",
        title: "量子计算算法优化方法",
        authors: ["马教授"],
        workType: "技术报告",
        timestamp: currentTime - 86400000 * 45, // 45天前
        originalAuthor: walletState.account || "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
        currentOwner: walletState.account || "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
        metadata: "国家重点实验室内部报告"
      },
      {
        tokenId: "1005",
        contentHash: "0xe5f6789012345678901234567890abcdef1234567890abcdef1234567890",
        title: "5G网络安全协议设计与分析",
        authors: ["郑教授", "韩博士"],
        workType: "会议论文",
        timestamp: currentTime - 86400000 * 60, // 60天前
        originalAuthor: walletState.account || "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
        currentOwner: "0x9cb2f210662cE435904013756Iad247d45d0632926", // 已转让
        metadata: "发表于IEEE国际通信会议2024"
      }
    ];
    return mockWorks;
  };

  // 获取用户作品列表
  const fetchMyWorks = async () => {
    if (!walletState.connected || !walletState.provider || !walletState.account) {
      return;
    }

    try {
      setLoading(true);
      
      // 使用模拟数据代替真实的合约调用
      console.log('加载模拟作品数据...');
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockWorks = generateMockData();
      console.log('加载了', mockWorks.length, '个模拟作品');
      
      setWorks(mockWorks);
      setFilteredWorks(mockWorks);
      
      message.success(`成功加载 ${mockWorks.length} 个学术作品`);
      
    } catch (error) {
      console.error('获取作品列表失败:', error);
      message.error('获取作品列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 生成模拟转让历史
  const generateMockTransferHistory = (tokenId: string): TransferRecord[] => {
    const mockHistories: { [key: string]: TransferRecord[] } = {
      "1002": [
        {
          from: walletState.account || "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
          to: "0x8ba1f109551bD432803012645Hac136c34c0532925",
          timestamp: Date.now() - 86400000 * 10, // 10天前
          reason: "专利权转让给科技公司进行产业化"
        }
      ],
      "1005": [
        {
          from: walletState.account || "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
          to: "0x9cb2f210662cE435904013756Iad247d45d0632926",
          timestamp: Date.now() - 86400000 * 20, // 20天前
          reason: "版权转让给期刊出版社"
        }
      ]
    };
    
    return mockHistories[tokenId] || [];
  };

  // 获取转让历史
  const fetchTransferHistory = async (tokenId: string) => {
    try {
      console.log('获取转让历史，Token ID:', tokenId);
      
      // 使用模拟数据
      const mockHistory = generateMockTransferHistory(tokenId);
      
      if (mockHistory.length === 0) {
        message.info('该作品暂无转让记录');
        setTransferHistory([]);
      } else {
        setTransferHistory(mockHistory);
        message.success(`找到 ${mockHistory.length} 条转让记录`);
      }
      
      setHistoryVisible(true);
    } catch (error) {
      console.error('获取转让历史失败:', error);
      message.error('获取转让历史失败');
    }
  };

  // 搜索过滤
  const handleSearch = (value: string) => {
    setSearchText(value);
    if (!value.trim()) {
      setFilteredWorks(works);
    } else {
      const filtered = works.filter(work => 
        work.title.toLowerCase().includes(value.toLowerCase()) ||
        work.authors.some(author => author.toLowerCase().includes(value.toLowerCase())) ||
        work.workType.toLowerCase().includes(value.toLowerCase()) ||
        work.tokenId.includes(value)
      );
      setFilteredWorks(filtered);
    }
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败');
    });
  };

  // 查看作品详情
  const viewWorkDetail = (work: WorkInfo) => {
    setSelectedWork(work);
    setDetailVisible(true);
  };

  // 组件加载时获取作品列表
  useEffect(() => {
    if (walletState.connected) {
      fetchMyWorks();
    }
  }, [walletState.connected]);

  // 表格列定义
  const columns = [
    {
      title: 'Token ID',
      dataIndex: 'tokenId',
      key: 'tokenId',
      width: 100,
      render: (tokenId: string) => (
        <Space>
          <Text code>#{tokenId}</Text>
          <Tooltip title="复制Token ID">
            <Button 
              type="text" 
              size="small" 
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(tokenId)}
            />
          </Tooltip>
        </Space>
      )
    },
    {
      title: '作品标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (title: string) => (
        <Tooltip title={title}>
          <Text>{title}</Text>
        </Tooltip>
      )
    },
    {
      title: '作者',
      dataIndex: 'authors',
      key: 'authors',
      width: 200,
      render: (authors: string[]) => (
        <Space wrap>
          {authors.slice(0, 2).map((author, index) => (
            <Tag key={index} color="blue">{author}</Tag>
          ))}
          {authors.length > 2 && (
            <Tag>+{authors.length - 2}</Tag>
          )}
        </Space>
      )
    },
    {
      title: '类型',
      dataIndex: 'workType',
      key: 'workType',
      width: 100,
      render: (type: string) => {
        const typeMap: { [key: string]: { color: string; text: string } } = {
          'paper': { color: 'blue', text: '论文' },
          'patent': { color: 'green', text: '专利' },
          'book': { color: 'purple', text: '著作' },
          'report': { color: 'orange', text: '报告' },
          'thesis': { color: 'red', text: '学位论文' },
          'other': { color: 'default', text: '其他' }
        };
        const typeInfo = typeMap[type] || typeMap['other'];
        return <Tag color={typeInfo.color}>{typeInfo.text}</Tag>;
      }
    },
    {
      title: '所有权状态',
      key: 'ownership',
      width: 120,
      render: (record: WorkInfo) => {
        const isOwner = record.currentOwner.toLowerCase() === walletState.account?.toLowerCase();
        const isOriginal = record.originalAuthor.toLowerCase() === walletState.account?.toLowerCase();
        
        if (isOwner && isOriginal) {
          return <Tag color="green">原始所有者</Tag>;
        } else if (isOwner) {
          return <Tag color="blue">当前所有者</Tag>;
        } else if (isOriginal) {
          return <Tag color="orange">原始作者</Tag>;
        } else {
          return <Tag color="default">相关作者</Tag>;
        }
      }
    },
    {
      title: '注册时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 120,
      render: (timestamp: number) => new Date(timestamp * 1000).toLocaleDateString()
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (record: WorkInfo) => (
        <Space>
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              onClick={() => viewWorkDetail(record)}
            />
          </Tooltip>
          <Tooltip title="转让历史">
            <Button 
              type="text" 
              icon={<HistoryOutlined />}
              onClick={() => fetchTransferHistory(record.tokenId)}
            />
          </Tooltip>
          {record.currentOwner.toLowerCase() === walletState.account?.toLowerCase() && (
            <Tooltip title="版权转让">
              <Button 
                type="text" 
                icon={<SwapOutlined />}
                onClick={() => window.location.href = `/transfer?tokenId=${record.tokenId}`}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  if (!walletState.connected) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <UserOutlined style={{ fontSize: '64px', color: '#ccc', marginBottom: 16 }} />
          <Title level={3}>请先连接钱包</Title>
          <Paragraph>需要连接以太坊钱包才能查看您的学术作品</Paragraph>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <Title level={2}>
          <UserOutlined /> 我的作品
        </Title>
        <Paragraph>
          管理您在区块链上注册的所有学术作品，查看详情、转让历史等信息
        </Paragraph>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Text strong>总计 {filteredWorks.length} 个作品</Text>
            {searchText && (
              <Text type="secondary">（搜索结果）</Text>
            )}
          </Space>
          
          <Space>
            <Search
              placeholder="搜索作品标题、作者、类型或Token ID"
              allowClear
              style={{ width: 300 }}
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Button 
              type="primary" 
              icon={<FileProtectOutlined />}
              href="/register"
            >
              注册新作品
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredWorks}
          rowKey="tokenId"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* 作品详情模态框 */}
      <Modal
        title="作品详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedWork && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Token ID">
              <Space>
                <Text code>#{selectedWork.tokenId}</Text>
                <Button 
                  type="link" 
                  size="small" 
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(selectedWork.tokenId)}
                >
                  复制
                </Button>
              </Space>
            </Descriptions.Item>
            
            <Descriptions.Item label="作品标题">
              {selectedWork.title}
            </Descriptions.Item>
            
            <Descriptions.Item label="作者列表">
              <Space wrap>
                {selectedWork.authors.map((author, index) => (
                  <Tag key={index} color="blue">{author}</Tag>
                ))}
              </Space>
            </Descriptions.Item>
            
            <Descriptions.Item label="作品类型">
              <Tag color="green">{selectedWork.workType}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="内容哈希">
              <Space>
                <Text code style={{ wordBreak: 'break-all' }}>
                  {selectedWork.contentHash}
                </Text>
                <Button 
                  type="link" 
                  size="small" 
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(selectedWork.contentHash)}
                >
                  复制
                </Button>
              </Space>
            </Descriptions.Item>
            
            <Descriptions.Item label="原始作者">
              <Space>
                <Text code>{selectedWork.originalAuthor}</Text>
                <Button 
                  type="link" 
                  size="small" 
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(selectedWork.originalAuthor)}
                >
                  复制
                </Button>
              </Space>
            </Descriptions.Item>
            
            <Descriptions.Item label="当前所有者">
              <Space>
                <Text code>{selectedWork.currentOwner}</Text>
                <Button 
                  type="link" 
                  size="small" 
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(selectedWork.currentOwner)}
                >
                  复制
                </Button>
              </Space>
            </Descriptions.Item>
            
            <Descriptions.Item label="注册时间">
              {new Date(selectedWork.timestamp * 1000).toLocaleString()}
            </Descriptions.Item>
            
            {selectedWork.metadata && (
              <Descriptions.Item label="元数据">
                <Text code style={{ whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(JSON.parse(selectedWork.metadata), null, 2)}
                </Text>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* 转让历史模态框 */}
      <Modal
        title="转让历史"
        open={historyVisible}
        onCancel={() => setHistoryVisible(false)}
        footer={[
          <Button key="close" onClick={() => setHistoryVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {transferHistory.length > 0 ? (
          <Timeline>
            {transferHistory.map((record, index) => (
              <Timeline.Item key={index}>
                <div>
                  <p><strong>从：</strong>
                    <Text code>{record.from}</Text>
                    <Button 
                      type="link" 
                      size="small" 
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(record.from)}
                    />
                  </p>
                  <p><strong>到：</strong>
                    <Text code>{record.to}</Text>
                    <Button 
                      type="link" 
                      size="small" 
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(record.to)}
                    />
                  </p>
                  <p><strong>原因：</strong>{record.reason}</p>
                  <p><strong>时间：</strong>{new Date(record.timestamp * 1000).toLocaleString()}</p>
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Text type="secondary">暂无转让记录</Text>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyWorks;
