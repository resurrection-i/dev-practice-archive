import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import VotingPage from './components/VotingPage';
import ResultChart from './components/ResultChart';
import './App.css';

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState('');

  // 检查MetaMask连接状态
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          // 检查是否已经连接账户
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setWalletConnected(true);
          }
          
          // 监听账户变更
          window.ethereum.on('accountsChanged', (newAccounts) => {
            if (newAccounts.length > 0) {
              setAccount(newAccounts[0]);
              setWalletConnected(true);
            } else {
              setAccount('');
              setWalletConnected(false);
            }
          });
          
          // 监听链变更
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });
        } catch (error) {
          console.error("MetaMask连接检查失败:", error);
        }
      }
    };
    
    checkConnection();
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1>区块链投票系统</h1>
          <nav className="main-nav">
            <Link to="/vote" className="nav-link">投票</Link>
            <Link to="/results" className="nav-link">结果</Link>
          </nav>
          <div className={`wallet-status ${walletConnected ? 'connected' : 'disconnected'}`}>
            {walletConnected ? (
              <div className="wallet-info">
                <span className="status-badge">已连接</span>
                <span className="wallet-address">
                  {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                </span>
              </div>
            ) : (
              <div className="wallet-info">
                <span className="status-badge disconnected">未连接</span>
                <span className="wallet-prompt">请连接MetaMask钱包</span>
              </div>
            )}
          </div>
        </header>
        
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/vote" replace />} />
            <Route path="/vote" element={<VotingPage />} />
            <Route path="/results" element={<ResultChart />} />
          </Routes>
        </div>
        
        <footer className="app-footer">
          <p>区块链投票演示系统 © {new Date().getFullYear()}</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;