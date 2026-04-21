import React, { useState, useEffect } from 'react';
import { connectWallet, getContract, loadCandidates, castVote } from '../utils/web3';
import './VotingPage.css';

function VotingPage() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [account, setAccount] = useState('');
  const [votingStatus, setVotingStatus] = useState('idle'); // idle | voting | success | error
  const [votingError, setVotingError] = useState('');
  const [hasVoted, setHasVoted] = useState(false);

  // 初始化
  useEffect(() => {
    const initVoting = async () => {
      try {
        // 连接钱包
        const walletAddress = await connectWallet();
        setAccount(walletAddress);
        
        // 获取合约实例 (适配 ethers.js v6)
        const getContractInstance = getContract();
        const contract = await getContractInstance();
        
        // 检查用户是否已投票
        const voted = await contract.hasVoted(walletAddress);
        setHasVoted(voted);
        
        // 加载候选人列表
        const candidatesList = await loadCandidates();
        setCandidates(candidatesList);
      } catch (error) {
        console.error("初始化投票页面失败:", error);
      }
    };

    initVoting();
  }, []);

  // 处理投票
  const handleVote = async () => {
    if (!selectedCandidate) {
      alert("请先选择候选人");
      return;
    }
    
    try {
      setVotingStatus('voting');
      
      // 使用web3.js中的castVote函数进行投票
      const txHash = await castVote(selectedCandidate.id);
      
      // 更新状态
      setVotingStatus('success');
      setHasVoted(true);
      
      // 更新候选人票数
      const updatedCandidates = candidates.map(cand => 
        cand.id === selectedCandidate.id 
          ? {...cand, votes: (parseInt(cand.votes) + 1).toString()} 
          : cand
      );
      
      setCandidates(updatedCandidates);
      
      alert(`投票成功！交易哈希: ${txHash}`);
      
    } catch (error) {
      console.error("投票失败:", error);
      setVotingStatus('error');
      setVotingError(error.message);
    }
  };

  return (
    <div className="voting-page">
      <div className="wallet-info">
        <div className="status">{account ? "已连接" : "未连接"}</div>
        {account && (
          <div className="address">{account.slice(0, 6)}...{account.slice(-4)}</div>
        )}
      </div>
      
      <div className="candidates-section">
        <h3>候选人列表</h3>
        {hasVoted ? (
          <div className="vote-confirmed">
            ✅ 您已完成投票，谢谢参与！
          </div>
        ) : (
          <>
            <div className="candidates-list">
              {candidates.map(candidate => (
                <div 
                  key={candidate.id} 
                  className={`candidate-card ${selectedCandidate?.id === candidate.id ? 'selected' : ''}`}
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <div className="candidate-name">{candidate.name}</div>
                  <div className="candidate-votes">票数: {candidate.votes}</div>
                </div>
              ))}
            </div>
            
            <div className="vote-actions">
              {selectedCandidate && (
                <div className="selected-info">
                  已选择: {selectedCandidate.name}
                </div>
              )}
              
              <button 
                className="vote-btn"
                onClick={handleVote}
                disabled={votingStatus === 'voting' || !selectedCandidate}
              >
                {votingStatus === 'voting' ? '投票中...' : '确认投票'}
              </button>
              
              {votingStatus === 'error' && (
                <div className="error-message">
                  投票失败: {votingError}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VotingPage;