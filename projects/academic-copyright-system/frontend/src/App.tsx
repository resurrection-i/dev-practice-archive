import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu, Button, message, Avatar, Dropdown } from 'antd';
import { 
  HomeOutlined, 
  FileProtectOutlined, 
  SwapOutlined, 
  SearchOutlined,
  UserOutlined,
  WalletOutlined
} from '@ant-design/icons';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

import HomePage from './components/HomePage';
import RegisterWork from './components/RegisterWork';
import TransferCopyright from './components/TransferCopyright';
import VerifyInfringement from './components/VerifyInfringement';
import MyWorks from './components/MyWorks';
import './App.css';

const { Header, Content, Sider } = Layout;

interface WalletState {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  connected: boolean;
}

const App: React.FC = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    account: null,
    provider: null,
    signer: null,
    connected: false
  });
  
  const [loading, setLoading] = useState(false);

  // 连接钱包
  const connectWallet = async () => {
    try {
      setLoading(true);
      
      // 检测MetaMask
      const provider = await detectEthereumProvider();
      if (!provider) {
        message.error('请安装MetaMask钱包');
        return;
      }

      // 请求连接账户
      if (!window.ethereum) {
        message.error('未检测到以太坊提供者');
        return;
      }
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await ethProvider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        message.error('未找到账户');
        return;
      }

      const signer = await ethProvider.getSigner();
      const account = await signer.getAddress();

      setWalletState({
        account,
        provider: ethProvider,
        signer,
        connected: true
      });

      message.success(`钱包连接成功: ${account.slice(0, 6)}...${account.slice(-4)}`);
      
    } catch (error: any) {
      console.error('连接钱包失败:', error);
      message.error('连接钱包失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 断开钱包连接
  const disconnectWallet = () => {
    setWalletState({
      account: null,
      provider: null,
      signer: null,
      connected: false
    });
    message.info('钱包已断开连接');
  };

  // 监听账户变化
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          connectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  // 菜单项
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: '/register',
      icon: <FileProtectOutlined />,
      label: <Link to="/register">注册作品</Link>,
    },
    {
      key: '/transfer',
      icon: <SwapOutlined />,
      label: <Link to="/transfer">版权转让</Link>,
    },
    {
      key: '/verify',
      icon: <SearchOutlined />,
      label: <Link to="/verify">侵权验证</Link>,
    },
    {
      key: '/my-works',
      icon: <UserOutlined />,
      label: <Link to="/my-works">我的作品</Link>,
    },
  ];

  // 用户菜单
  const userMenuItems = [
    {
      key: 'disconnect',
      label: '断开连接',
      onClick: disconnectWallet,
    },
  ];

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: '#001529'
        }}>
          <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
            学术版权存证系统
          </div>
          
          <div>
            {walletState.connected ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Button type="primary" icon={<Avatar size="small" icon={<UserOutlined />} />}>
                  {walletState.account?.slice(0, 6)}...{walletState.account?.slice(-4)}
                </Button>
              </Dropdown>
            ) : (
              <Button 
                type="primary" 
                icon={<WalletOutlined />}
                loading={loading}
                onClick={connectWallet}
              >
                连接钱包
              </Button>
            )}
          </div>
        </Header>

        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['/']}
              style={{ height: '100%', borderRight: 0 }}
              items={menuItems}
            />
          </Sider>

          <Layout style={{ padding: '24px' }}>
            <Content style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: '#fff',
              borderRadius: 8
            }}>
              <Routes>
                <Route path="/" element={<HomePage walletState={walletState} />} />
                <Route path="/register" element={<RegisterWork walletState={walletState} />} />
                <Route path="/transfer" element={<TransferCopyright walletState={walletState} />} />
                <Route path="/verify" element={<VerifyInfringement walletState={walletState} />} />
                <Route path="/my-works" element={<MyWorks walletState={walletState} />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
