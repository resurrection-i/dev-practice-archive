import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Select, 
  message, 
  Typography,
  Space,
  Table,
  Tag,
  Modal,
  Alert,
  Timeline
} from 'antd';
import { 
  SwapOutlined, 
  SearchOutlined,
  HistoryOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { ethers } from 'ethers';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

interface WalletState {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  connected: boolean;
}

interface TransferCopyrightProps {
  walletState: WalletState;
}

interface WorkInfo {
  tokenId: string;
  title: string;
  authors: string[];
  workType: string;
  currentOwner: string;
  originalAuthor: string;
  timestamp: number;
}

interface TransferRecord {
  from: string;
  to: string;
  timestamp: number;
  reason: string;
  txHash: string;
}

const TransferCopyright: React.FC<TransferCopyrightProps> = ({ walletState }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [myWorks, setMyWorks] = useState<WorkInfo[]>([]);
  const [selectedWork, setSelectedWork] = useState<WorkInfo | null>(null);
  const [transferHistory, setTransferHistory] = useState<TransferRecord[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);

  // 合约地址和ABI
  const CONTRACT_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  const CONTRACT_ABI = [
    "function getAuthorWorks(address author) view returns (uint256[])",
    "function getWorkDetails(uint256 tokenId) view returns (tuple(uint256 tokenId, string contentHash, string title, string[] authors, string workType, uint256 timestamp, address originalAuthor, address currentOwner, bool isActive, string metadata))",
    "function transferCopyright(uint256 tokenId, address to, string reason, bytes signature)",
    "function getTransferHistory(uint256 tokenId) view returns (tuple(address from, address to, uint256 timestamp, string reason, bytes signature)[])",
    "event CopyrightTransferred(uint256 indexed tokenId, address indexed from, address indexed to, uint256 timestamp, string reason)"
  ];

  // 获取用户的作品列表
  const fetchMyWorks = async () => {
    if (!walletState.connected || !walletState.provider || !walletState.account) {
      return;
    }

    try {
      setLoading(true);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, walletState.provider);
      
      // 获取用户作品ID列表
      const workIds = await contract.getAuthorWorks(walletState.account);
      
      // 获取每个作品的详细信息
      const works: WorkInfo[] = [];
      for (const tokenId of workIds) {
        try {
          const workDetail = await contract.getWorkDetails(tokenId);
          
          // 只显示当前用户拥有的作品
          if (workDetail.currentOwner.toLowerCase() === walletState.account.toLowerCase()) {
            works.push({
              tokenId: tokenId.toString(),
              title: workDetail.title,
              authors: workDetail.authors,
              workType: workDetail.workType,
              currentOwner: workDetail.currentOwner,
              originalAuthor: workDetail.originalAuthor,
              timestamp: workDetail.timestamp.toNumber()
            });
          }
        } catch (error) {
          console.error(`获取作品 ${tokenId} 详情失败:`, error);
        }
      }
      
      setMyWorks(works);
    } catch (error) {
      console.error('获取作品列表失败:', error);
      message.error('获取作品列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 搜索作品信息
  const searchWork = async (tokenId: string) => {
    if (!walletState.provider) {
      message.error('请先连接钱包');
      return;
    }

    try {
      setSearchLoading(true);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, walletState.provider);
      
      const workDetail = await contract.getWorkDetails(tokenId);
      
      if (!workDetail.isActive) {
        message.error('作品不存在或已失效');
        return;
      }

      const work: WorkInfo = {
        tokenId: tokenId,
        title: workDetail.title,
        authors: workDetail.authors,
        workType: workDetail.workType,
        currentOwner: workDetail.currentOwner,
        originalAuthor: workDetail.originalAuthor,
        timestamp: workDetail.timestamp.toNumber()
      };

      setSelectedWork(work);
      
      // 检查是否有转让权限
      if (work.currentOwner.toLowerCase() !== walletState.account?.toLowerCase()) {
        message.warning('您不是该作品的当前所有者，无法进行转让');
      }

    } catch (error) {
      console.error('搜索作品失败:', error);
      message.error('作品不存在或搜索失败');
      setSelectedWork(null);
    } finally {
      setSearchLoading(false);
    }
  };

  // 获取转让历史
  const fetchTransferHistory = async (tokenId: string) => {
    if (!walletState.provider) return;

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, walletState.provider);
      const history = await contract.getTransferHistory(tokenId);
      
      const records: TransferRecord[] = history.map((record: any) => ({
        from: record.from,
        to: record.to,
        timestamp: record.timestamp.toNumber(),
        reason: record.reason,
        txHash: '' // 实际应用中需要从事件日志获取
      }));
      
      setTransferHistory(records);
      setHistoryVisible(true);
    } catch (error) {
      console.error('获取转让历史失败:', error);
      message.error('获取转让历史失败');
    }
  };

  // 生成转让签名
  const generateTransferSignature = async (tokenId: string, to: string, reason: string) => {
    if (!walletState.signer) {
      throw new Error('未连接签名器');
    }

    const messageHash = ethers.solidityPackedKeccak256(
      ['uint256', 'address', 'string', 'uint256'],
      [tokenId, to, reason, Math.floor(Date.now() / 1000)]
    );

    const signature = await walletState.signer.signMessage(ethers.getBytes(messageHash));
    return signature;
  };

  // 执行版权转让
  const handleTransfer = async (values: any) => {
    if (!selectedWork || !walletState.signer) {
      message.error('请先选择作品并连接钱包');
      return;
    }

    // 验证接收地址
    if (!ethers.isAddress(values.toAddress)) {
      message.error('接收地址格式不正确');
      return;
    }

    if (values.toAddress.toLowerCase() === walletState.account?.toLowerCase()) {
      message.error('不能转让给自己');
      return;
    }

    confirm({
      title: '确认版权转让',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>您确定要将作品《{selectedWork.title}》的版权转让给：</p>
          <p><strong>{values.toAddress}</strong></p>
          <p>转让原因：{values.reason}</p>
          <p style={{ color: '#ff4d4f' }}>
            注意：版权转让后您将失去该作品的所有权，此操作不可撤销！
          </p>
        </div>
      ),
      onOk: async () => {
        try {
          setLoading(true);
          
          // 生成授权签名
          const signature = await generateTransferSignature(
            selectedWork.tokenId,
            values.toAddress,
            values.reason
          );

          // 创建合约实例
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, walletState.signer);

          // 执行转让交易
          const tx = await contract.transferCopyright(
            selectedWork.tokenId,
            values.toAddress,
            values.reason,
            signature
          );

          message.loading('交易提交中，请等待确认...', 0);

          // 等待交易确认
          const receipt = await tx.wait();
          
          message.destroy();
          message.success('版权转让成功！');

          // 重置表单和状态
          form.resetFields();
          setSelectedWork(null);
          
          // 刷新作品列表
          await fetchMyWorks();

        } catch (error) {
          message.destroy();
          console.error('转让失败:', error);
          const errorMessage = error instanceof Error ? error.message : '未知错误';
          message.error('转让失败: ' + errorMessage);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // 组件加载时获取作品列表
  useEffect(() => {
    if (walletState.connected) {
      fetchMyWorks();
    }
  }, [walletState.connected]);

  // 我的作品表格列定义
  const columns = [
    {
      title: 'Token ID',
      dataIndex: 'tokenId',
      key: 'tokenId',
      width: 100,
      render: (tokenId: string) => <Text code>#{tokenId}</Text>
    },
    {
      title: '作品标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true
    },
    {
      title: '类型',
      dataIndex: 'workType',
      key: 'workType',
      width: 100,
      render: (type: string) => <Tag color="blue">{type}</Tag>
    },
    {
      title: '注册时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
      render: (timestamp: number) => new Date(timestamp * 1000).toLocaleDateString()
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (record: WorkInfo) => (
        <Space>
          <Button 
            size="small" 
            onClick={() => {
              setSelectedWork(record);
              form.setFieldsValue({ tokenId: record.tokenId });
            }}
          >
            选择转让
          </Button>
          <Button 
            size="small" 
            icon={<HistoryOutlined />}
            onClick={() => fetchTransferHistory(record.tokenId)}
          >
            历史
          </Button>
        </Space>
      )
    }
  ];

  if (!walletState.connected) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <SwapOutlined style={{ fontSize: '64px', color: '#ccc', marginBottom: 16 }} />
          <Title level={3}>请先连接钱包</Title>
          <Paragraph>需要连接以太坊钱包才能进行版权转让操作</Paragraph>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <Title level={2}>
          <SwapOutlined /> 版权转让
        </Title>
        <Paragraph>
          安全地转让您的学术作品版权，所有转让记录将永久保存在区块链上
        </Paragraph>
      </Card>

      {/* 我的作品列表 */}
      <Card title="我的作品" style={{ marginTop: 16 }}>
        <Table
          columns={columns}
          dataSource={myWorks}
          rowKey="tokenId"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* 转让表单 */}
      <Card title="版权转让" style={{ marginTop: 16 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleTransfer}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="tokenId"
            label="作品Token ID"
            rules={[{ required: true, message: '请输入或选择作品Token ID' }]}
          >
            <Input
              placeholder="请输入Token ID或从上方表格选择"
              suffix={
                <Button 
                  type="link" 
                  icon={<SearchOutlined />}
                  onClick={() => {
                    const tokenId = form.getFieldValue('tokenId');
                    if (tokenId) {
                      searchWork(tokenId);
                    }
                  }}
                  loading={searchLoading}
                >
                  搜索
                </Button>
              }
            />
          </Form.Item>

          {selectedWork && (
            <Alert
              message="作品信息"
              description={
                <div>
                  <p><strong>标题：</strong>{selectedWork.title}</p>
                  <p><strong>作者：</strong>{selectedWork.authors.join(', ')}</p>
                  <p><strong>类型：</strong>{selectedWork.workType}</p>
                  <p><strong>当前所有者：</strong>{selectedWork.currentOwner}</p>
                  {selectedWork.currentOwner.toLowerCase() !== walletState.account?.toLowerCase() && (
                    <p style={{ color: '#ff4d4f' }}>
                      <strong>注意：您不是该作品的当前所有者</strong>
                    </p>
                  )}
                </div>
              }
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Form.Item
            name="toAddress"
            label="接收方地址"
            rules={[
              { required: true, message: '请输入接收方以太坊地址' },
              {
                validator: (_, value) => {
                  if (!value || ethers.isAddress(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('请输入有效的以太坊地址'));
                }
              }
            ]}
          >
            <Input placeholder="0x..." />
          </Form.Item>

          <Form.Item
            name="reason"
            label="转让原因"
            rules={[{ required: true, message: '请输入转让原因' }]}
          >
            <Select placeholder="请选择转让原因">
              <Option value="sale">出售</Option>
              <Option value="gift">赠与</Option>
              <Option value="collaboration">合作转让</Option>
              <Option value="inheritance">继承</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              disabled={!selectedWork || selectedWork.currentOwner.toLowerCase() !== walletState.account?.toLowerCase()}
              size="large"
            >
              确认转让
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 转让历史模态框 */}
      <Modal
        title="转让历史"
        open={historyVisible}
        onCancel={() => setHistoryVisible(false)}
        footer={null}
        width={600}
      >
        {transferHistory.length > 0 ? (
          <Timeline>
            {transferHistory.map((record, index) => (
              <Timeline.Item key={index}>
                <div>
                  <p><strong>从：</strong>{record.from}</p>
                  <p><strong>到：</strong>{record.to}</p>
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

export default TransferCopyright;
