import React, { useContext, useState } from 'react';
import WalletContext from '../utils/WalletContext';

const ConnectWallet = ({ message = '连接钱包', className = 'btn btn-primary' }) => {
  const { connectWallet, disconnectWallet, account, balance, loading } = useContext(WalletContext);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatBalance = (bal) => {
    return parseFloat(bal).toFixed(4);
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setError('');
      await connectWallet();
    } catch (err) {
      console.error('连接钱包失败:', err);
      setError(err.message || '连接钱包失败，请确保已安装 MetaMask');
    } finally {
      setIsConnecting(false);
    }
  };

  if (loading) {
    return (
      <button className={className} disabled>
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        加载中...
      </button>
    );
  }

  if (!account) {
    return (
      <div>
        <button 
          className={`${className} d-flex align-items-center justify-content-center`} 
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              正在连接...
            </>
          ) : (
            <>
              <i className="bi bi-wallet2 me-2"></i>
              {message}
            </>
          )}
        </button>
        
        {error && (
          <div className="alert alert-danger mt-2 p-2 small rounded-3" role="alert">
            <div className="d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <div>{error}</div>
            </div>
            <div className="mt-1 small">
              <a 
                href="https://metamask.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="alert-link"
              >
                安装 MetaMask
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="wallet-info">
      <i className="bi bi-wallet2"></i>
      <span className="wallet-address">{formatAddress(account)}</span>
      <span className="badge bg-success">{formatBalance(balance)} ETH</span>
      <button className="btn btn-sm btn-outline-dark ms-2" onClick={disconnectWallet}>
        <i className="bi bi-box-arrow-right"></i>
      </button>
    </div>
  );
};

export default ConnectWallet; 