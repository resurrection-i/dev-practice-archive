import { ethers } from 'ethers';
import contractConfig from '../contracts/contractConfig.json';

/**
 * 获取最新的签名者并验证其地址
 * @param {ethers.Provider} provider - Provider 实例
 * @param {string} [expectedAddress] - 期望的签名者地址（如果提供）
 * @returns {Promise<{signer: ethers.Signer, address: string}>} - 签名者和地址
 */
export const getCurrentSigner = async (provider, expectedAddress = null) => {
  try {
    if (!provider) {
      throw new Error('缺少 Provider');
    }

    // 获取最新的签名者
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    // 如果提供了期望地址，验证是否匹配
    if (expectedAddress && address.toLowerCase() !== expectedAddress.toLowerCase()) {
      console.warn(`检测到钱包地址不匹配: 期望 ${expectedAddress}, 但获取到 ${address}`);
      throw new Error('钱包地址已变更，请刷新页面');
    }
    
    return { signer, address };
  } catch (error) {
    console.error('获取当前签名者失败:', error);
    throw error;
  }
};

/**
 * 获取合约实例
 * @param {ethers.Provider} provider - Provider 实例
 * @param {ethers.Signer} signer - 必须提供的 Signer 实例
 * @returns {ethers.Contract} - 合约实例
 */
export const getContract = (provider, signer) => {
  // 尝试从配置加载合约
  try {
    const { address, abi } = contractConfig;
    
    if (!address || !abi) {
      throw new Error('合约配置不完整');
    }

    // 必须使用 signer 创建合约实例才能发送交易
    if (!signer) {
      throw new Error('需要连接钱包才能创建项目');
    }
    
    return new ethers.Contract(address, abi, signer);
  } catch (error) {
    console.error('获取合约实例失败:', error);
    throw error;
  }
};

/**
 * 创建新众筹项目
 * @param {ethers.Contract} contract - 合约实例
 * @param {string} name - 项目名称
 * @param {string} description - 项目描述
 * @param {string} goal - 目标金额(ETH)
 * @param {number} durationDays - 项目持续天数
 * @returns {Promise<ethers.TransactionResponse>} - 交易响应
 */
export const createProject = async (contract, name, description, goal, durationDays) => {
  if (!contract) throw new Error('合约未初始化');
  
  try {
    // 转换目标金额为 wei 单位
    const goalInWei = ethers.parseEther(goal.toString());
    
    // 调用合约方法创建项目
    const tx = await contract.createProject(name, description, goalInWei, durationDays);
    await tx.wait(); // 等待交易确认
    return tx;
  } catch (error) {
    console.error('创建项目失败:', error);
    throw error;
  }
};

/**
 * 获取所有项目
 * @param {ethers.Contract} contract - 合约实例
 * @returns {Promise<Array>} - 项目列表
 */
export const getAllProjects = async (contract) => {
  if (!contract) throw new Error('合约未初始化');
  
  try {
    // 获取项目总数
    const count = await contract.projectsCount();
    
    // 获取每个项目的详细信息
    const projects = [];
    for (let i = 1; i <= count; i++) {
      const project = await contract.projects(i);
      projects.push({
        id: Number(project.id),
        name: project.name,
        description: project.description,
        creator: project.creator,
        goal: ethers.formatEther(project.goal),
        currentAmount: ethers.formatEther(project.currentAmount),
        deadline: new Date(Number(project.deadline) * 1000), // 转换为 JavaScript 日期
        completed: project.completed,
        contributorsCount: Number(project.contributorsCount)
      });
    }
    
    return projects;
  } catch (error) {
    console.error('获取项目列表失败:', error);
    throw error;
  }
};

/**
 * 获取单个项目详情
 * @param {ethers.Contract} contract - 合约实例
 * @param {number} projectId - 项目ID
 * @returns {Promise<Object>} - 项目详情
 */
export const getProject = async (contract, projectId) => {
  if (!contract) throw new Error('合约未初始化');
  
  try {
    const project = await contract.projects(projectId);
    return {
      id: Number(project.id),
      name: project.name,
      description: project.description,
      creator: project.creator,
      goal: ethers.formatEther(project.goal),
      currentAmount: ethers.formatEther(project.currentAmount),
      deadline: new Date(Number(project.deadline) * 1000),
      completed: project.completed,
      contributorsCount: Number(project.contributorsCount)
    };
  } catch (error) {
    console.error(`获取项目 ${projectId} 失败:`, error);
    throw error;
  }
};

/**
 * 向项目捐款
 * @param {ethers.Contract} contract - 合约实例
 * @param {number} projectId - 项目ID
 * @param {string} amount - 捐款金额(ETH)
 * @returns {Promise<ethers.TransactionResponse>} - 交易响应
 */
export const fundProject = async (contract, projectId, amount) => {
  if (!contract) throw new Error('合约未初始化');
  
  try {
    // 记录当前交易发起人地址，用于调试
    const signerAddress = await contract.runner.getAddress();
    console.log(`交易发起人: ${signerAddress}`);
    
    // 转换金额为 wei 单位
    const amountInWei = ethers.parseEther(amount.toString());
    console.log(`捐款金额: ${amount} ETH (${amountInWei.toString()} wei)`);
    
    // 调用合约方法捐款
    const tx = await contract.fundProject(projectId, { value: amountInWei });
    console.log(`交易已提交: ${tx.hash}`);
    
    await tx.wait(); // 等待交易确认
    console.log(`交易已确认: ${tx.hash}`);
    
    return tx;
  } catch (error) {
    console.error(`向项目 ${projectId} 捐款失败:`, error);
    throw error;
  }
};

/**
 * 获取用户对项目的捐款金额
 * @param {ethers.Contract} contract - 合约实例
 * @param {number} projectId - 项目ID
 * @param {string} address - 用户地址
 * @returns {Promise<string>} - 捐款金额(ETH)
 */
export const getContribution = async (contract, projectId, address) => {
  if (!contract) throw new Error('合约未初始化');
  
  try {
    const contribution = await contract.getContribution(projectId, address);
    return ethers.formatEther(contribution);
  } catch (error) {
    console.error(`获取用户 ${address} 对项目 ${projectId} 的捐款失败:`, error);
    throw error;
  }
};

/**
 * 创建资金请求
 * @param {ethers.Contract} contract - 合约实例
 * @param {number} projectId - 项目ID
 * @param {string} description - 请求描述
 * @param {string} amount - 请求金额(ETH)
 * @param {string} recipient - 接收地址
 * @returns {Promise<ethers.TransactionResponse>} - 交易响应
 */
export const createFundingRequest = async (contract, projectId, description, amount, recipient) => {
  if (!contract) throw new Error('合约未初始化');
  
  try {
    // 转换金额为 wei 单位
    const amountInWei = ethers.parseEther(amount.toString());
    
    // 调用合约方法创建资金请求
    const tx = await contract.createFundingRequest(projectId, description, amountInWei, recipient);
    await tx.wait(); // 等待交易确认
    return tx;
  } catch (error) {
    console.error(`创建项目 ${projectId} 的资金请求失败:`, error);
    throw error;
  }
};

/**
 * 获取项目的所有资金请求
 * @param {ethers.Contract} contract - 合约实例
 * @param {number} projectId - 项目ID
 * @returns {Promise<Array>} - 请求列表
 */
export const getRequests = async (contract, projectId) => {
  if (!contract) throw new Error('合约未初始化');
  
  try {
    // 获取请求总数
    const count = await contract.requestsCount(projectId);
    
    // 获取每个请求的详细信息
    const requests = [];
    for (let i = 1; i <= count; i++) {
      const request = await contract.fundingRequests(projectId, i);
      requests.push({
        id: Number(request.id),
        description: request.description,
        amount: ethers.formatEther(request.amount),
        recipient: request.recipient,
        completed: request.completed,
        approvalCount: Number(request.approvalCount)
      });
    }
    
    return requests;
  } catch (error) {
    console.error(`获取项目 ${projectId} 的请求列表失败:`, error);
    throw error;
  }
};

/**
 * 批准资金请求
 * @param {ethers.Contract} contract - 合约实例
 * @param {number} projectId - 项目ID
 * @param {number} requestId - 请求ID
 * @returns {Promise<ethers.TransactionResponse>} - 交易响应
 */
export const approveRequest = async (contract, projectId, requestId) => {
  if (!contract) throw new Error('合约未初始化');
  
  try {
    // 调用合约方法批准请求
    const tx = await contract.approveRequest(projectId, requestId);
    await tx.wait(); // 等待交易确认
    return tx;
  } catch (error) {
    console.error(`批准项目 ${projectId} 的请求 ${requestId} 失败:`, error);
    throw error;
  }
};

/**
 * 执行资金请求
 * @param {ethers.Contract} contract - 合约实例
 * @param {number} projectId - 项目ID
 * @param {number} requestId - 请求ID
 * @returns {Promise<ethers.TransactionResponse>} - 交易响应
 */
export const finalizeRequest = async (contract, projectId, requestId) => {
  if (!contract) throw new Error('合约未初始化');
  
  try {
    // 调用合约方法执行请求
    const tx = await contract.finalizeRequest(projectId, requestId);
    await tx.wait(); // 等待交易确认
    return tx;
  } catch (error) {
    console.error(`执行项目 ${projectId} 的请求 ${requestId} 失败:`, error);
    throw error;
  }
};

/**
 * 完成项目
 * @param {ethers.Contract} contract - 合约实例
 * @param {number} projectId - 项目ID
 * @returns {Promise<ethers.TransactionResponse>} - 交易响应
 */
export const completeProject = async (contract, projectId) => {
  if (!contract) throw new Error('合约未初始化');
  
  try {
    // 调用合约方法完成项目
    const tx = await contract.completeProject(projectId);
    await tx.wait(); // 等待交易确认
    return tx;
  } catch (error) {
    console.error(`完成项目 ${projectId} 失败:`, error);
    throw error;
  }
};

// 查询某个地址是否已批准某资金请求
export async function hasApproved(contract, projectId, requestId, approver) {
  if (!contract) throw new Error('Contract instance is required');
  return await contract.hasApproved(projectId, requestId, approver);
}

/**
 * 获取项目的所有贡献者地址
 * @param {ethers.Contract} contract - 合约实例
 * @param {number} projectId - 项目ID
 * @returns {Promise<Array<string>>} - 贡献者地址数组
 */
export const getContributors = async (contract, projectId) => {
  if (!contract) throw new Error('合约未初始化');
  
  try {
    const contributors = await contract.getContributors(projectId);
    return contributors;
  } catch (error) {
    console.error(`获取项目 ${projectId} 的贡献者列表失败:`, error);
    throw error;
  }
};

/**
 * 检查地址是否为项目贡献者
 * @param {ethers.Contract} contract - 合约实例
 * @param {number} projectId - 项目ID
 * @param {string} address - 待检查地址
 * @returns {Promise<boolean>} - 是否为贡献者
 */
export const isAddressContributor = async (contract, projectId, address) => {
  if (!contract) throw new Error('合约未初始化');
  
  try {
    const isContributor = await contract.isAddressContributor(projectId, address);
    return isContributor;
  } catch (error) {
    console.error(`检查地址 ${address} 是否为项目 ${projectId} 的贡献者失败:`, error);
    throw error;
  }
}; 