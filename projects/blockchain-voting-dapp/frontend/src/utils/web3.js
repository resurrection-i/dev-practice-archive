import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../config/contract";

// 连接钱包
export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error("请安装MetaMask钱包扩展");
  }
  
  // 请求账户访问
  const accounts = await window.ethereum.request({ 
    method: 'eth_requestAccounts'
  });
  
  if (!accounts || accounts.length === 0) {
    throw new Error("用户拒绝了连接请求");
  }
  
  return accounts[0];
};

// 获取合约实例 (适应 ethers.js v6)
export const getContract = () => {
  if (!window.ethereum) {
    throw new Error("请安装MetaMask钱包扩展");
  }
  
  // ethers.js v6 使用 BrowserProvider 替代 Web3Provider
  const provider = new ethers.BrowserProvider(window.ethereum);
  
  // 异步获取 signer，但这是一个同步函数，所以我们返回一个函数
  return async () => {
    const signer = await provider.getSigner();
    return new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );
  };
};

// 获取候选人数据
export const loadCandidates = async () => {
  try {
    // 由于 getContract 现在返回一个异步函数，需要调用它获取合约实例
    const getContractInstance = getContract();
    const contract = await getContractInstance();
    
    // 方法1: 使用getCandidates()直接获取所有候选人
    const allCandidates = await contract.getCandidates();
    return allCandidates.map(candidate => ({
      id: candidate.id.toString(),
      name: candidate.name,
      votes: candidate.voteCount.toString()
    }));
    
    /* 
    // 方法2: 使用getCandidatesCount和getCandidate逐个获取
    const count = await contract.getCandidatesCount();
    
    const candidates = [];
    for (let i = 0; i < count; i++) {
      const [id, name, votes] = await contract.getCandidate(i);
      candidates.push({
        id: id.toString(),
        name,
        votes: votes.toString()
      });
    }
    
    return candidates;
    */
  } catch (error) {
    console.error("加载候选人数据失败:", error);
    throw error;
  }
};

// 投票函数
export const castVote = async (candidateId) => {
  try {
    // 由于 getContract 现在返回一个异步函数，需要调用它获取合约实例
    const getContractInstance = getContract();
    const contract = await getContractInstance();
    
    const tx = await contract.vote(candidateId);
    
    // ethers.js v6 中等待交易确认的方式
    await tx.wait();
    
    return tx.hash;
  } catch (error) {
    console.error("投票失败:", error);
    throw error;
  }
};