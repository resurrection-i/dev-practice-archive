import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Select, 
  Upload, 
  message, 
  Steps, 
  Typography,
  Space,
  Divider,
  Tag,
  Alert
} from 'antd';
import { 
  UploadOutlined, 
  FileProtectOutlined, 
  CheckCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface WalletState {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  connected: boolean;
}

interface RegisterWorkProps {
  walletState: WalletState;
}

interface WorkForm {
  title: string;
  authors: string[];
  workType: string;
  description: string;
  keywords: string[];
  file?: File;
}

const RegisterWork: React.FC<RegisterWorkProps> = ({ walletState }) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fileHash, setFileHash] = useState<string>('');
  const [workData, setWorkData] = useState<WorkForm | null>(null);
  const [registrationResult, setRegistrationResult] = useState<any>(null);

  // 合约地址（实际部署时需要更新）
  const CONTRACT_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  
  // 合约ABI（简化版本）
  const CONTRACT_ABI = [
    "function registerWork(string contentHash, string title, string[] authors, string workType, string metadata) returns (uint256)",
    "event WorkRegistered(uint256 indexed tokenId, string indexed contentHash, address indexed author, string title, uint256 timestamp)"
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
      setFileHash(hash);
      message.success('文件哈希计算完成');
      return false; // 阻止自动上传
    } catch (error) {
      message.error('文件处理失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 提交基本信息
  const handleBasicInfoSubmit = async (values: any) => {
    try {
      const authors = values.authors.split(',').map((author: string) => author.trim());
      const keywords = values.keywords ? values.keywords.split(',').map((kw: string) => kw.trim()) : [];
      
      const formData: WorkForm = {
        title: values.title,
        authors,
        workType: values.workType,
        description: values.description,
        keywords,
        file: values.file?.file
      };

      setWorkData(formData);
      
      if (formData.file) {
        await handleFileUpload(formData.file);
      }
      
      setCurrentStep(1);
    } catch (error) {
      message.error('信息验证失败');
    }
  };

  // 确认并注册到区块链
  const handleRegisterToBlockchain = async () => {
    if (!walletState.connected || !walletState.signer || !workData) {
      message.error('请先连接钱包');
      return;
    }

    try {
      setLoading(true);

      // 创建合约实例
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, walletState.signer);

      // 准备元数据
      const metadata = JSON.stringify({
        title: workData.title,
        authors: workData.authors,
        description: workData.description,
        keywords: workData.keywords,
        timestamp: Date.now(),
        registrant: walletState.account
      });

      // 调用智能合约注册作品
      const tx = await contract.registerWork(
        fileHash || CryptoJS.SHA256(workData.title + workData.description).toString(),
        workData.title,
        workData.authors,
        workData.workType,
        metadata
      );

      message.loading('交易提交中，请等待确认...', 0);

      // 等待交易确认
      const receipt = await tx.wait();
      
      message.destroy();
      message.success('作品注册成功！');

      // 解析事件获取Token ID
      const event = receipt.events?.find((e: any) => e.event === 'WorkRegistered');
      const tokenId = event?.args?.tokenId?.toString();

      setRegistrationResult({
        tokenId,
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        contentHash: fileHash,
        timestamp: Date.now()
      });

      setCurrentStep(2);

    } catch (error) {
      message.destroy();
      console.error('注册失败:', error);
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      message.error('注册失败: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 重新开始
  const handleRestart = () => {
    form.resetFields();
    setCurrentStep(0);
    setFileHash('');
    setWorkData(null);
    setRegistrationResult(null);
  };

  const steps = [
    {
      title: '基本信息',
      content: 'basic-info',
      icon: <FileProtectOutlined />
    },
    {
      title: '确认注册',
      content: 'confirm',
      icon: <CheckCircleOutlined />
    },
    {
      title: '完成',
      content: 'result',
      icon: <CheckCircleOutlined />
    }
  ];

  if (!walletState.connected) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <FileProtectOutlined style={{ fontSize: '64px', color: '#ccc', marginBottom: 16 }} />
          <Title level={3}>请先连接钱包</Title>
          <Paragraph>需要连接以太坊钱包才能注册学术作品</Paragraph>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <Title level={2}>
          <FileProtectOutlined /> 注册学术作品
        </Title>
        <Paragraph>
          将您的学术成果注册到区块链上，生成不可篡改的版权存证记录
        </Paragraph>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Steps current={currentStep} items={steps} style={{ marginBottom: 32 }} />

        {currentStep === 0 && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleBasicInfoSubmit}
            style={{ maxWidth: 600 }}
          >
            <Form.Item
              name="title"
              label="作品标题"
              rules={[{ required: true, message: '请输入作品标题' }]}
            >
              <Input placeholder="请输入学术作品的完整标题" />
            </Form.Item>

            <Form.Item
              name="authors"
              label="作者列表"
              rules={[{ required: true, message: '请输入作者信息' }]}
              extra="多个作者请用逗号分隔，如：张三,李四,王五"
            >
              <Input placeholder="请输入所有作者姓名" />
            </Form.Item>

            <Form.Item
              name="workType"
              label="作品类型"
              rules={[{ required: true, message: '请选择作品类型' }]}
            >
              <Select placeholder="请选择作品类型">
                <Option value="paper">学术论文</Option>
                <Option value="patent">专利申请</Option>
                <Option value="book">学术著作</Option>
                <Option value="report">研究报告</Option>
                <Option value="thesis">学位论文</Option>
                <Option value="other">其他</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="作品描述"
              rules={[{ required: true, message: '请输入作品描述' }]}
            >
              <TextArea 
                rows={4} 
                placeholder="请简要描述作品内容、研究方法、主要贡献等"
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Form.Item
              name="keywords"
              label="关键词"
              extra="多个关键词请用逗号分隔"
            >
              <Input placeholder="请输入相关关键词" />
            </Form.Item>

            <Form.Item
              name="file"
              label="上传文件（可选）"
              extra="支持PDF、DOC、DOCX格式，用于生成内容哈希"
            >
              <Upload
                beforeUpload={handleFileUpload}
                maxCount={1}
                accept=".pdf,.doc,.docx"
              >
                <Button icon={<UploadOutlined />} loading={loading}>
                  选择文件
                </Button>
              </Upload>
            </Form.Item>

            {fileHash && (
              <Alert
                message="文件哈希已生成"
                description={`SHA256: ${fileHash}`}
                type="success"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                下一步
              </Button>
            </Form.Item>
          </Form>
        )}

        {currentStep === 1 && workData && (
          <div style={{ maxWidth: 600 }}>
            <Title level={4}>确认注册信息</Title>
            
            <Card size="small" style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>作品标题：</Text>
                  <Text>{workData.title}</Text>
                </div>
                
                <div>
                  <Text strong>作者：</Text>
                  <Space wrap>
                    {workData.authors.map((author, index) => (
                      <Tag key={index} color="blue">{author}</Tag>
                    ))}
                  </Space>
                </div>
                
                <div>
                  <Text strong>作品类型：</Text>
                  <Tag color="green">{workData.workType}</Tag>
                </div>
                
                <div>
                  <Text strong>描述：</Text>
                  <Paragraph style={{ marginBottom: 0 }}>{workData.description}</Paragraph>
                </div>
                
                {workData.keywords && workData.keywords.length > 0 && (
                  <div>
                    <Text strong>关键词：</Text>
                    <Space wrap>
                      {workData.keywords.map((keyword, index) => (
                        <Tag key={index}>{keyword}</Tag>
                      ))}
                    </Space>
                  </div>
                )}
                
                {fileHash && (
                  <div>
                    <Text strong>内容哈希：</Text>
                    <Text code>{fileHash}</Text>
                  </div>
                )}
              </Space>
            </Card>

            <Alert
              message="注册须知"
              description="注册后将在区块链上生成不可篡改的存证记录，请确认信息无误后提交。注册需要支付少量Gas费用。"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Space>
              <Button onClick={() => setCurrentStep(0)}>
                返回修改
              </Button>
              <Button 
                type="primary" 
                onClick={handleRegisterToBlockchain}
                loading={loading}
                size="large"
              >
                确认注册到区块链
              </Button>
            </Space>
          </div>
        )}

        {currentStep === 2 && registrationResult && (
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
            <CheckCircleOutlined 
              style={{ fontSize: '64px', color: '#52c41a', marginBottom: 16 }} 
            />
            
            <Title level={3} style={{ color: '#52c41a' }}>
              注册成功！
            </Title>
            
            <Paragraph>
              您的学术作品已成功注册到区块链，获得永久的版权保护。
            </Paragraph>

            <Card size="small" style={{ textAlign: 'left', marginBottom: 24 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>NFT Token ID：</Text>
                  <Text code>#{registrationResult.tokenId}</Text>
                </div>
                
                <div>
                  <Text strong>交易哈希：</Text>
                  <Text code style={{ wordBreak: 'break-all' }}>
                    {registrationResult.txHash}
                  </Text>
                </div>
                
                <div>
                  <Text strong>区块高度：</Text>
                  <Text>{registrationResult.blockNumber}</Text>
                </div>
                
                <div>
                  <Text strong>注册时间：</Text>
                  <Text>{new Date(registrationResult.timestamp).toLocaleString()}</Text>
                </div>
              </Space>
            </Card>

            <Space>
              <Button onClick={handleRestart}>
                注册新作品
              </Button>
              <Button type="primary" href="/my-works">
                查看我的作品
              </Button>
            </Space>
          </div>
        )}
      </Card>
    </div>
  );
};

export default RegisterWork;
