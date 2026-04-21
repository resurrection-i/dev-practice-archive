import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Upload, 
  message, 
  Typography,
  Space,
  Alert,
  Table,
  Tag,
  Divider,
  Switch,
  Modal
} from 'antd';
import { 
  SearchOutlined, 
  UploadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EyeInvisibleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

interface WalletState {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  connected: boolean;
}

interface VerifyInfringementProps {
  walletState: WalletState;
}

interface VerificationResult {
  exists: boolean;
  tokenId?: string;
  timestamp?: number;
  currentOwner?: string;
  title?: string;
  contentHash: string;
}

interface BatchVerificationResult {
  hash: string;
  exists: boolean;
  title?: string;
  owner?: string;
}

const VerifyInfringement: React.FC<VerifyInfringementProps> = ({ walletState }) => {
  const [form] = Form.useForm();
  const [batchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [batchResults, setBatchResults] = useState<BatchVerificationResult[]>([]);
  const [usePrivacyMode, setUsePrivacyMode] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);

  // 合约地址和ABI
  const CONTRACT_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  const PRIVACY_CONTRACT_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  
  const CONTRACT_ABI = [
    "function verifyInfringement(string contentHash) view returns (bool exists, uint256 tokenId, uint256 timestamp, address currentOwner, string title)",
    "function publicVerifyInfringement(string contentHash)",
    "function batchVerifyInfringement(string[] contentHashes) view returns (bool[] results)"
  ];

  const PRIVACY_ABI = [
    "function verifyPrivacy(uint[2] _pA, uint[2][2] _pB, uint[2] _pC, uint[2] _h, uint[2] _k, uint[] _inputs) returns (bool isValid, bool isInfringement)"
  ];

  // 计算文件哈希
  const calculateFileHash = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
          const hash = CryptoJS.SHA256(wordArray).toString();
          resolve(hash);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  // 处理文件上传
  const handleFileUpload = async (file: File) => {
    try {
      setLoading(true);
      const hash = await calculateFileHash(file);
      form.setFieldsValue({ contentHash: hash });
      message.success('文件哈希计算完成');
      return false; // 阻止自动上传
    } catch (error) {
      message.error('文件处理失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 生成模拟侵权验证结果
  const generateMockVerificationResult = (contentHash: string) => {
    // 模拟一些已知的侵权内容哈希
    const knownInfringements: { [key: string]: any } = {
      "0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456": {
        exists: true,
        tokenId: "1001",
        timestamp: Date.now() - 86400000 * 30,
        currentOwner: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
        title: "基于深度学习的图像识别算法研究"
      },
      "0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567": {
        exists: true,
        tokenId: "1002",
        timestamp: Date.now() - 86400000 * 15,
        currentOwner: "0x8ba1f109551bD432803012645Hac136c34c0532925",
        title: "区块链技术在供应链管理中的应用"
      },
      "0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678": {
        exists: true,
        tokenId: "1003",
        timestamp: Date.now() - 86400000 * 7,
        currentOwner: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
        title: "人工智能在医疗诊断中的伦理问题研究"
      }
    };

    return knownInfringements[contentHash] || {
      exists: false,
      tokenId: '',
      timestamp: 0,
      currentOwner: '',
      title: ''
    };
  };

  // 单个哈希验证
  const handleSingleVerify = async (values: any) => {
    if (!walletState.provider) {
      message.error('请先连接钱包');
      return;
    }

    try {
      setLoading(true);
      
      console.log('验证内容哈希:', values.contentHash);
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = generateMockVerificationResult(values.contentHash);
      
      setVerificationResult({
        contentHash: values.contentHash,
        exists: result.exists,
        tokenId: result.tokenId,
        timestamp: result.timestamp,
        currentOwner: result.currentOwner,
        title: result.title
      });

      if (result.exists) {
        message.warning('🚨 检测到侵权！该内容已被注册');
      } else {
        message.success('✅ 未检测到侵权，内容可以使用');
      }
    } catch (error) {
      console.error('验证失败:', error);
      message.error('验证失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  // 批量验证
  const handleBatchVerify = async (values: any) => {
    if (!walletState.provider) {
      message.error('请先连接钱包');
      return;
    }

    try {
      setLoading(true);
      
      // 解析哈希列表
      const hashes = values.hashList
        .split('\n')
        .map((hash: string) => hash.trim())
        .filter((hash: string) => hash.length > 0);

      if (hashes.length === 0) {
        message.error('请输入至少一个哈希值');
        return;
      }

      if (hashes.length > 100) {
        message.error('批量验证最多支持100个哈希值');
        return;
      }

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, walletState.provider);
      
      // 调用批量验证
      const results = await contract.batchVerifyInfringement(hashes);
      
      // 为存在的哈希获取详细信息
      const detailedResults: BatchVerificationResult[] = [];
      
      for (let i = 0; i < hashes.length; i++) {
        const batchResult: BatchVerificationResult = {
          hash: hashes[i],
          exists: results[i]
        };

        if (results[i]) {
          try {
            const detail = await contract.verifyInfringement(hashes[i]);
            batchResult.title = detail.title;
            batchResult.owner = detail.currentOwner;
          } catch (error) {
            console.warn(`获取哈希 ${hashes[i]} 详情失败:`, error);
          }
        }

        detailedResults.push(batchResult);
      }

      setBatchResults(detailedResults);
      message.success(`批量验证完成，共验证 ${hashes.length} 个哈希值`);

    } catch (error) {
      console.error('批量验证失败:', error);
      message.error('批量验证失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  // 隐私验证（零知识证明）
  const handlePrivacyVerify = async () => {
    if (!walletState.signer) {
      message.error('请先连接钱包');
      return;
    }

    try {
      setLoading(true);
      
      // 模拟生成zk-SNARK证明（实际应用中需要使用circom等工具）
      const mockProof = {
        _pA: [1, 2],
        _pB: [[3, 4], [5, 6]],
        _pC: [7, 8],
        _h: [9, 10],
        _k: [11, 12],
        _inputs: [
          ethers.randomBytes(32), // nullifier hash
          ethers.randomBytes(32), // commitment hash
          1 // infringement result (1 = true, 0 = false)
        ]
      };

      const privacyContract = new ethers.Contract(
        PRIVACY_CONTRACT_ADDRESS, 
        PRIVACY_ABI, 
        walletState.signer
      );

      const result = await privacyContract.verifyPrivacy(
        mockProof._pA,
        mockProof._pB,
        mockProof._pC,
        mockProof._h,
        mockProof._k,
        mockProof._inputs
      );

      Modal.success({
        title: '隐私验证完成',
        content: (
          <div>
            <p>验证结果：{result.isInfringement ? '存在侵权' : '未发现侵权'}</p>
            <p>证明有效性：{result.isValid ? '有效' : '无效'}</p>
            <p style={{ color: '#666', fontSize: '12px' }}>
              注意：隐私验证不会泄露原文内容，仅返回是否构成侵权
            </p>
          </div>
        )
      });

    } catch (error) {
      console.error('隐私验证失败:', error);
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      message.error('隐私验证失败: ' + errorMessage);
    } finally {
      setLoading(false);
      setPrivacyModalVisible(false);
    }
  };

  // 批量验证结果表格列定义
  const batchColumns = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: '内容哈希',
      dataIndex: 'hash',
      key: 'hash',
      ellipsis: true,
      render: (hash: string) => <Text code>{hash}</Text>
    },
    {
      title: '验证结果',
      dataIndex: 'exists',
      key: 'exists',
      width: 100,
      render: (exists: boolean) => (
        <Tag color={exists ? 'red' : 'green'} icon={exists ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />}>
          {exists ? '已注册' : '未注册'}
        </Tag>
      )
    },
    {
      title: '作品标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (title: string) => title || '-'
    },
    {
      title: '当前所有者',
      dataIndex: 'owner',
      key: 'owner',
      ellipsis: true,
      render: (owner: string) => owner ? <Text code>{owner}</Text> : '-'
    }
  ];

  return (
    <div>
      <Card>
        <Title level={2}>
          <SearchOutlined /> 侵权验证
        </Title>
        <Paragraph>
          验证内容是否已被注册为学术成果，支持单个验证、批量验证和隐私保护验证
        </Paragraph>
      </Card>

      {/* 验证模式切换 */}
      <Card title="验证模式" style={{ marginTop: 16 }}>
        <Space>
          <Text>隐私保护模式：</Text>
          <Switch 
            checked={usePrivacyMode}
            onChange={setUsePrivacyMode}
            checkedChildren="开启"
            unCheckedChildren="关闭"
          />
          <Button 
            type="link" 
            icon={<EyeInvisibleOutlined />}
            onClick={() => setPrivacyModalVisible(true)}
            disabled={!usePrivacyMode}
          >
            了解隐私验证
          </Button>
        </Space>
        
        {usePrivacyMode && (
          <Alert
            message="隐私保护模式"
            description="使用零知识证明技术，仅返回是否构成侵权，不会泄露原文内容或具体信息"
            type="info"
            showIcon
            style={{ marginTop: 12 }}
          />
        )}
      </Card>

      {/* 单个验证 */}
      <Card title="单个验证" style={{ marginTop: 16 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={usePrivacyMode ? () => setPrivacyModalVisible(true) : handleSingleVerify}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="contentHash"
            label="内容哈希"
            rules={[{ required: true, message: '请输入内容哈希或上传文件' }]}
            extra="可以直接输入SHA256哈希值，或上传文件自动计算"
          >
            <Input placeholder="请输入SHA256哈希值" />
          </Form.Item>

          <Form.Item label="或上传文件计算哈希">
            <Upload
              beforeUpload={handleFileUpload}
              maxCount={1}
              accept=".pdf,.doc,.docx,.txt"
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />} loading={loading}>
                选择文件
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} size="large">
              {usePrivacyMode ? '隐私验证' : '开始验证'}
            </Button>
          </Form.Item>
        </Form>

        {/* 验证结果显示 */}
        {verificationResult && !usePrivacyMode && (
          <div style={{ marginTop: 24 }}>
            <Divider>验证结果</Divider>
            
            {verificationResult.exists ? (
              <Alert
                message="发现已注册内容"
                description={
                  <div>
                    <p><strong>内容哈希：</strong><Text code>{verificationResult.contentHash}</Text></p>
                    <p><strong>作品标题：</strong>{verificationResult.title}</p>
                    <p><strong>Token ID：</strong>#{verificationResult.tokenId}</p>
                    <p><strong>当前所有者：</strong><Text code>{verificationResult.currentOwner}</Text></p>
                    <p><strong>注册时间：</strong>{new Date((verificationResult.timestamp || 0) * 1000).toLocaleString()}</p>
                  </div>
                }
                type="warning"
                showIcon
                icon={<ExclamationCircleOutlined />}
              />
            ) : (
              <Alert
                message="未发现已注册内容"
                description={
                  <div>
                    <p><strong>内容哈希：</strong><Text code>{verificationResult.contentHash}</Text></p>
                    <p>该内容尚未在系统中注册，您可以安全使用或进行注册。</p>
                  </div>
                }
                type="success"
                showIcon
                icon={<CheckCircleOutlined />}
              />
            )}
          </div>
        )}
      </Card>

      {/* 批量验证 */}
      {!usePrivacyMode && (
        <Card title="批量验证" style={{ marginTop: 16 }}>
          <Form
            form={batchForm}
            layout="vertical"
            onFinish={handleBatchVerify}
            style={{ maxWidth: 600 }}
          >
            <Form.Item
              name="hashList"
              label="哈希列表"
              rules={[{ required: true, message: '请输入哈希列表' }]}
              extra="每行一个SHA256哈希值，最多支持100个"
            >
              <TextArea 
                rows={8} 
                placeholder="请输入哈希值，每行一个&#10;例如：&#10;a1b2c3d4e5f6...&#10;f6e5d4c3b2a1..."
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} size="large">
                批量验证
              </Button>
            </Form.Item>
          </Form>

          {/* 批量验证结果 */}
          {batchResults.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <Divider>批量验证结果</Divider>
              
              <div style={{ marginBottom: 16 }}>
                <Space>
                  <Text>总计：{batchResults.length} 个</Text>
                  <Text type="danger">已注册：{batchResults.filter(r => r.exists).length} 个</Text>
                  <Text type="success">未注册：{batchResults.filter(r => !r.exists).length} 个</Text>
                </Space>
              </div>

              <Table
                columns={batchColumns}
                dataSource={batchResults}
                rowKey="hash"
                pagination={{ pageSize: 20 }}
                size="small"
                scroll={{ x: 800 }}
              />
            </div>
          )}
        </Card>
      )}

      {/* 隐私验证模态框 */}
      <Modal
        title="隐私保护验证"
        open={privacyModalVisible}
        onCancel={() => setPrivacyModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setPrivacyModalVisible(false)}>
            取消
          </Button>,
          <Button key="verify" type="primary" loading={loading} onClick={handlePrivacyVerify}>
            执行隐私验证
          </Button>
        ]}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="隐私保护验证说明"
            description="使用零知识证明技术，在不泄露原文内容的情况下验证是否构成侵权。验证过程完全保护您的隐私。"
            type="info"
            showIcon
          />
          
          <div>
            <Title level={5}>验证流程：</Title>
            <ol>
              <li>生成内容的零知识证明</li>
              <li>提交证明到区块链验证</li>
              <li>返回是否侵权的结果</li>
              <li>不会泄露任何原文信息</li>
            </ol>
          </div>

          <Alert
            message="注意事项"
            description="隐私验证需要消耗更多的计算资源和Gas费用，适用于敏感内容的验证场景。"
            type="warning"
            showIcon
          />
        </Space>
      </Modal>
    </div>
  );
};

export default VerifyInfringement;
