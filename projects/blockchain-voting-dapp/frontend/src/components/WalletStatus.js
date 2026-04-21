import React from 'react';
import './WalletStatus.css';

const WalletStatus = ({ isConnected }) => {
  return (
    <div className="wallet-status">
      <div className="status-indicator-wrapper">
        <div className={`status-indicator ${isConnected ? 'connected' : ''}`}></div>
        <span>{isConnected ? '已连接' : '未连接'}</span>
      </div>
    </div>
  );
};

export default WalletStatus;