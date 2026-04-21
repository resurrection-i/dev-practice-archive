import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ethers } from 'ethers';

// 页面组件
import Home from './pages/Home';
import CreateProject from './pages/CreateProject';
import ProjectDetails from './pages/ProjectDetails';
import RequestsManage from './pages/RequestsManage';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';

// 通用组件
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import WalletContext from './utils/WalletContext';
import { getUserInfo, bindWallet } from './api/auth';

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState('0');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [networkName, setNetworkName] = useState('');
  const [loading, setLoading] = useState(true);
  const [wrongNetwork, setWrongNetwork] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // 检查用户登录状态
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUserInfo()
        .then(data => {
          setUserInfo(data);
        })
        .catch(err => {
          console.error('获取用户信息失败:', err);
          localStorage.removeItem('token');
        });
    }
  }, []);

  // 检查钱包连接
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        // 检查 MetaMask 是否安装
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);

          // 监听钱包切换事件
          window.ethereum.on('accountsChanged', handleAccountsChanged);
          window.ethereum.on('chainChanged', handleChainChanged);

          // 检查是否已连接
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            const currentAccount = accounts[0].address;
            setAccount(currentAccount);

            // 获取余额
            const balance = await provider.getBalance(currentAccount);
            setBalance(ethers.formatEther(balance));

            // 获取签名者
            const signer = await provider.getSigner();
            setSigner(signer);

            // 获取网络信息
            const network = await provider.getNetwork();
            setNetworkName(network.name);
            
            // 检查是否连接到正确的网络 (Hardhat 本地网络 chainId: 31337)
            setWrongNetwork(network.chainId !== 31337n);
          }
        } else {
          console.log('请安装 MetaMask!');
        }
      } catch (error) {
        console.error('钱包连接错误:', error);
      } finally {
        setLoading(false);
      }
    };

    checkWalletConnection();

    // 清理事件监听
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // 处理账户变更
  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      // 用户登出
      setAccount(null);
      setBalance('0');
      setSigner(null);
      setWrongNetwork(false);
    } else {
      // 新账户
      const newAccount = accounts[0];
      setAccount(newAccount);

      if (provider) {
        const balance = await provider.getBalance(newAccount);
        setBalance(ethers.formatEther(balance));
        const signer = await provider.getSigner();
        setSigner(signer);
        
        // 检查网络
        const network = await provider.getNetwork();
        setNetworkName(network.name);
        setWrongNetwork(network.chainId !== 31337n);
      }
    }
  };

  // 处理链变更
  const handleChainChanged = async (chainId) => {
    // 检查新链 ID
    const newChainId = parseInt(chainId, 16);
    setWrongNetwork(newChainId !== 31337);
    
    // 如果连接到正确网络，重新获取网络信息
    if (newChainId === 31337 && provider) {
      const network = await provider.getNetwork();
      setNetworkName(network.name);
    }
  };

  // 连接钱包
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        // 请求账户访问权限
        await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        // 更新状态
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);

        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const newAccount = accounts[0].address;
          setAccount(newAccount);

          // 获取余额
          const balance = await provider.getBalance(newAccount);
          setBalance(ethers.formatEther(balance));

          // 获取签名者
          const signer = await provider.getSigner();
          setSigner(signer);

          // 获取网络信息
          const network = await provider.getNetwork();
          setNetworkName(network.name);
          setWrongNetwork(network.chainId !== 31337n);
        }
      } else {
        alert('请安装 MetaMask!');
      }
    } catch (error) {
      console.error('连接钱包失败:', error);
    }
  };

  // 断开钱包连接
  const disconnectWallet = () => {
    setAccount(null);
    setBalance('0');
    setSigner(null);
    setWrongNetwork(false);
  };

  // 绑定钱包地址
  const handleBindWallet = async () => {
    if (!userInfo) {
      alert('请先登录！');
      return;
    }
    if (!account) {
      alert('请先连接钱包！');
      return;
    }

    try {
      await bindWallet(account);
      // 重新获取用户信息
      const updatedUserInfo = await getUserInfo();
      setUserInfo(updatedUserInfo);
      alert('钱包绑定成功！');
    } catch (error) {
      console.error('绑定钱包失败:', error);
      alert('绑定钱包失败，请重试');
    }
  };

  // 将钱包状态封装为上下文值
  const walletContextValue = {
    account,
    balance,
    provider,
    signer,
    networkName,
    connectWallet,
    disconnectWallet,
    handleBindWallet,
    loading,
    wrongNetwork,
    userInfo,
    setUserInfo
  };

  return (
    <WalletContext.Provider value={walletContextValue}>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        
        {/* 网络错误提示 */}
        {wrongNetwork && account && (
          <div className="alert alert-warning alert-dismissible fade show m-3" role="alert">
            <div className="d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <div>
                <strong>网络错误：</strong>请切换到 Hardhat 本地网络 (Chain ID: 31337)
                <br />
                <small className="text-muted">
                  当前网络: {networkName} | 
                  <a href="https://hardhat.org/hardhat-network/" target="_blank" rel="noopener noreferrer" className="ms-1">
                    如何配置？
                  </a>
                </small>
              </div>
            </div>
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        )}
        
        <main className="flex-grow-1">
          <div className="container py-4">
            <Routes>
              {/* 公开路由 */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* 受保护的路由 - 需要登录 */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/create" element={
                <ProtectedRoute>
                  <CreateProject />
                </ProtectedRoute>
              } />
              <Route path="/project/:id" element={
                <ProtectedRoute>
                  <ProjectDetails />
                </ProtectedRoute>
              } />
              <Route path="/requests/:id" element={
                <ProtectedRoute>
                  <RequestsManage />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </WalletContext.Provider>
  );
}

export default App;
