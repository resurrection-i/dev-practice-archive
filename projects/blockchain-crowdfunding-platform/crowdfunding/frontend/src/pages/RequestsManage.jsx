import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import WalletContext from '../utils/WalletContext';
import {
  getContract,
  getProject,
  getRequests,
  getContribution,
  createFundingRequest,
  approveRequest,
  finalizeRequest,
  hasApproved,
  getContributors,
  isAddressContributor,
  getCurrentSigner
} from '../utils/contractService';
import ConnectWallet from '../components/ConnectWallet';

const RequestsManage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { provider, signer, account, userInfo } = useContext(WalletContext);

  // 状态
  const [project, setProject] = useState(null);
  const [requests, setRequests] = useState([]);
  const [contribution, setContribution] = useState('0');
  const [userApprovals, setUserApprovals] = useState({});
  const [contributors, setContributors] = useState([]); // 贡献者列表
  const [isUserContributor, setIsUserContributor] = useState(false); // 当前用户是否为贡献者
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(null); // null: pending, true: yes, false: no
  const [walletStatus, setWalletStatus] = useState(''); // 钱包状态信息

  // 新请求表单状态
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  // 加载项目和请求数据
  useEffect(() => {
    const loadData = async () => {
      // 必须等待 provider 和 account 加载完成
      if (!provider || !account) {
        setLoading(false);
        // 如果没有账户信息，则视为无权限，除非稍后账户信息加载完成并触发 effect 重跑
        setPermissionGranted(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        setWalletStatus(`使用钱包地址: ${account}`);
        
        const contract = getContract(provider, signer);
        if (!contract) throw new Error("无法连接到合约");

        // 记录当前操作账户，用于Debug
        try {
          const currentAddress = await signer.getAddress();
          console.log(`当前操作账户: ${currentAddress}`);
          if (currentAddress.toLowerCase() !== account.toLowerCase()) {
            console.warn(`账户不匹配！WalletContext: ${account}, 当前签名者: ${currentAddress}`);
          }
        } catch (err) {
          console.error('获取签名者地址失败:', err);
        }

        const projectData = await getProject(contract, id);
        setProject(projectData);
        
        const requestsData = await getRequests(contract, id);
        setRequests(requestsData);

        // 检查用户贡献 - 首先尝试使用 getContribution 函数
        const userContribution = await getContribution(contract, id, account);
        setContribution(userContribution);
        
        // 直接检查贡献是否大于0
        const hasContributed = parseFloat(userContribution) > 0;
        
        console.log(`用户地址: ${account}`);
        console.log(`用户贡献: ${userContribution} ETH`);
        console.log(`是否有贡献: ${hasContributed}`);

        // 获取所有贡献者地址
        let contributorsData = [];
        try {
          contributorsData = await getContributors(contract, id);
          setContributors(contributorsData || []);
          
          // 调试信息
          console.log(`贡献者列表: `, contributorsData);
        } catch (err) {
          console.error('获取贡献者列表失败:', err);
        }

        // 检查用户是否为贡献者 - 多种方法检查
        let userIsContributor = hasContributed;
        
        if (!userIsContributor && contributorsData && contributorsData.length > 0) {
          // 如果 getContribution 没有检测到贡献，尝试在贡献者列表中查找（不区分大小写）
          userIsContributor = contributorsData.some(
            addr => addr.toLowerCase() === account.toLowerCase()
          );
          console.log(`通过地址列表匹配结果: ${userIsContributor}`);
        }
        
        if (!userIsContributor) {
          // 如果以上方法都没检测到，尝试使用合约函数 isAddressContributor
          try {
            const isContributor = await isAddressContributor(contract, id, account);
            userIsContributor = userIsContributor || isContributor;
            console.log(`通过合约函数检测结果: ${isContributor}`);
          } catch (err) {
            console.error('检查贡献者身份失败:', err);
          }
        }
        
        setIsUserContributor(userIsContributor);
        console.log(`最终判定用户是否为贡献者: ${userIsContributor}`);

        const approvals = {};
        for (const req of requestsData) {
          approvals[req.id] = await hasApproved(contract, id, req.id, account);
        }
        setUserApprovals(approvals);
        
        if (projectData.creator.toLowerCase() === account.toLowerCase()) {
          setRecipient(account);
        }

        // 在所有数据加载后进行权限判断
        const isCreator = account && projectData.creator.toLowerCase() === account.toLowerCase();
        const isSupporter = userIsContributor; // 使用我们确定的贡献者状态
        setPermissionGranted(isCreator || isSupporter);
        
        console.log(`用户是创建者: ${isCreator}`);
        console.log(`用户是支持者: ${isSupporter}`);
        console.log(`权限授予: ${isCreator || isSupporter}`);

      } catch (err) {
        console.error('加载数据失败:', err);
        setError('无法加载资金请求，请确认您有权限访问或刷新页面。');
        setPermissionGranted(false);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, provider, signer, account]);

  // 创建新的资金请求
  const handleCreateRequest = async (e) => {
    e.preventDefault();
    
    if (!signer || !account || !project) {
      setError('请先连接钱包');
      return;
    }

    if (!description.trim() || !amount || parseFloat(amount) <= 0 || !recipient) {
      setError('请填写所有必填字段，并确保金额为正数');
      return;
    }

    // 检查钱包地址是否匹配
    if (userInfo && userInfo.primaryWalletAddress) {
      if (account.toLowerCase() !== userInfo.primaryWalletAddress.toLowerCase()) {
        setError(`⚠️ 钱包地址不匹配！\n当前连接的钱包: ${account}\n账户绑定的钱包: ${userInfo.primaryWalletAddress}\n\n请切换到正确的钱包地址，或使用正确的账户登录。`);
        return;
      }
    }

    try {
      setIsSubmitting(true);
      setError('');
      setTransactionHash('');

      // 获取最新的签名者
      try {
        const { signer: currentSigner, address: currentAddress } = await getCurrentSigner(provider, account);
        
        // 创建合约实例
        const contract = getContract(provider, currentSigner);
        if (!contract) throw new Error("需要签名者来执行交易");
  
        setWalletStatus(`使用账户 ${currentAddress} 创建请求...`);
        const tx = await createFundingRequest(contract, id, description, amount, recipient);
        setTransactionHash(tx.hash);
        
        await tx.wait();
        console.log('资金请求创建成功:', tx.hash);
  
        // 刷新请求列表
        const requestsData = await getRequests(contract, id);
        setRequests(requestsData);
  
        setDescription('');
        setAmount('');
        setShowRequestForm(false);
        setWalletStatus(`资金请求创建成功`);
      } catch (error) {
        if (error.message.includes('钱包地址已变更')) {
          setError('检测到钱包账户已变更，请刷新页面');
        } else {
          throw error;
        }
      }
    } catch (err) {
      console.error('创建请求失败:', err);
      setError(`创建请求失败: ${err.reason || err.message || '未知错误'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 批准资金请求
  const handleApprove = async (requestId) => {
    // 检查钱包地址是否匹配
    if (userInfo && userInfo.primaryWalletAddress) {
      if (account.toLowerCase() !== userInfo.primaryWalletAddress.toLowerCase()) {
        alert(`⚠️ 钱包地址不匹配！\n当前连接的钱包: ${account}\n账户绑定的钱包: ${userInfo.primaryWalletAddress}\n\n请切换到正确的钱包地址，或使用正确的账户登录。`);
        return;
      }
    }

    try {
      setWalletStatus(`正在批准请求 #${requestId}...`);
      
      // 获取最新的签名者
      const { signer: currentSigner, address: currentAddress } = await getCurrentSigner(provider, account);
      
      // 创建合约实例
      const contract = getContract(provider, currentSigner);
      if (!contract) throw new Error("需要签名者来执行交易");
      
      const tx = await approveRequest(contract, id, requestId);
      console.log(`批准交易已提交: ${tx.hash}`);
      
      await tx.wait();
      console.log(`批准交易已确认: ${tx.hash}`);
      
      // 更新数据
      const newApprovals = { ...userApprovals, [requestId]: true };
      setUserApprovals(newApprovals);

      const updatedRequests = await getRequests(contract, id);
      setRequests(updatedRequests);
      
      setWalletStatus(`已批准请求 #${requestId}`);
    } catch (err) {
      console.error(`批准请求 #${requestId} 失败:`, err);
      setWalletStatus('');
      alert(err.reason || err.message || '批准失败');
    }
  };

  // 完成资金请求
  const handleFinalizeRequest = async (requestId) => {
    if (!signer || !account) {
      setError('请先连接钱包');
      return;
    }

    // 检查钱包地址是否匹配
    if (userInfo && userInfo.primaryWalletAddress) {
      if (account.toLowerCase() !== userInfo.primaryWalletAddress.toLowerCase()) {
        setError(`⚠️ 钱包地址不匹配！\n当前连接的钱包: ${account}\n账户绑定的钱包: ${userInfo.primaryWalletAddress}\n\n请切换到正确的钱包地址，或使用正确的账户登录。`);
        return;
      }
    }

    try {
      setIsSubmitting(true);
      setError('');
      setTransactionHash('');
      setWalletStatus(`正在执行请求 #${requestId}...`);

      // 获取最新的签名者
      const { signer: currentSigner, address: currentAddress } = await getCurrentSigner(provider, account);
      
      // 创建合约实例
      const contract = getContract(provider, currentSigner);
      if (!contract) throw new Error("需要签名者来执行交易");

      const tx = await finalizeRequest(contract, id, requestId);
      setTransactionHash(tx.hash);
      console.log(`执行交易已提交: ${tx.hash}`);
      
      await tx.wait();
      console.log(`执行交易已确认: ${tx.hash}`);

      // 更新数据
      const requestsData = await getRequests(contract, id);
      setRequests(requestsData);
      
      const projectData = await getProject(contract, id);
      setProject(projectData);
      
      setWalletStatus(`已成功执行请求 #${requestId}`);
    } catch (err) {
      console.error('完成请求失败:', err);
      setError(`完成请求失败: ${err.message || '未知错误'}`);
      setWalletStatus('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 刷新页面数据
  const refreshData = async () => {
    if (!provider || !account) return;
    
    try {
      setLoading(true);
      setError('');
      setWalletStatus('正在刷新数据...');
      
      // 获取当前签名者地址
      try {
        const currentAddress = await signer.getAddress();
        if (currentAddress.toLowerCase() !== account.toLowerCase()) {
          console.warn(`账户不匹配，请刷新页面! Context: ${account}, Current: ${currentAddress}`);
          setError('检测到钱包账户变更，请刷新页面');
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('获取签名者地址失败:', err);
      }

      const contract = getContract(provider, signer);
      if (!contract) throw new Error("无法连接到合约");

      // 重新加载所有数据
      const projectData = await getProject(contract, id);
      setProject(projectData);
      
      const requestsData = await getRequests(contract, id);
      setRequests(requestsData);
      
      const userContribution = await getContribution(contract, id, account);
      setContribution(userContribution);

      // 重新判断用户身份
      const isCreator = account && projectData.creator.toLowerCase() === account.toLowerCase();
      const isSupporter = parseFloat(userContribution) > 0;
      setPermissionGranted(isCreator || isSupporter);
      setIsUserContributor(isSupporter);

      // 更新审批状态
      const approvals = {};
      for (const req of requestsData) {
        approvals[req.id] = await hasApproved(contract, id, req.id, account);
      }
      setUserApprovals(approvals);
      
      setWalletStatus('数据刷新成功');
    } catch (err) {
      console.error('刷新数据失败:', err);
      setError('无法刷新数据，请尝试刷新页面');
    } finally {
      setLoading(false);
      setTimeout(() => setWalletStatus(''), 3000);
    }
  };

  // 显示载入中
  if (loading || permissionGranted === null) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">载入中...</span>
        </div>
        <p className="mt-3">载入资金请求...</p>
      </div>
    );
  }

  // 显示错误
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h4 className="alert-heading">载入失败</h4>
          <p>{error}</p>
          <hr />
          <div className="d-flex">
            <button className="btn btn-outline-danger me-2" onClick={() => window.location.reload()}>
              重新载入
            </button>
            <Link to={`/project/${id}`} className="btn btn-primary">
              返回项目详情
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 权限判断
  if (permissionGranted === false) {
    // 如果未连接钱包，显示连接提示
    if (!account) {
      return (
        <div className="container py-5">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <div className="card shadow-sm">
                <div className="card-body text-center py-5">
                  <h2 className="mb-4">请先连接您的钱包</h2>
                  <p className="lead mb-4">您需要连接 MetaMask 钱包才能查看资金请求</p>
                  <ConnectWallet message="连接钱包以继续" className="btn btn-lg btn-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    // 如果已连接但无权限
    return (
       <div className="container py-5">
        <div className="alert alert-danger">
          <h4 className="alert-heading">访问被拒绝</h4>
          <p>只有项目创建者和支持者可以查看资金请求。</p>
          <hr />
          <Link to={`/project/${id}`} className="btn btn-primary">
            返回项目详情
          </Link>
        </div>
       </div>
    );
  }

  // 如果找不到项目
  if (!project) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          <h4 className="alert-heading">项目不存在</h4>
          <p>找不到 ID 为 {id} 的项目。</p>
          <hr />
          <Link to="/" className="btn btn-primary">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const isCreator = project && account && project.creator.toLowerCase() === account.toLowerCase();
  // 检查用户是否是贡献者（通过总合判断）
  const isSupporter = isUserContributor || parseFloat(contribution) > 0;

  // 调试信息：帮助排查权限问题
  console.log('=== 权限调试信息 ===');
  console.log('项目创建者地址:', project?.creator);
  console.log('当前连接钱包:', account);
  console.log('用户登录信息:', userInfo);
  console.log('是否为创建者:', isCreator);
  console.log('是否为支持者:', isSupporter);
  console.log('==================');

  // 如果页面加载完毕但用户没有被识别为贡献者，显示警告
  const showContributorWarning = !loading && account && parseFloat(contribution) > 0 && !isSupporter;

  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb bg-transparent p-0">
          <li className="breadcrumb-item"><Link to="/">首页</Link></li>
          <li className="breadcrumb-item"><Link to={`/project/${id}`}>{project?.name || '项目详情'}</Link></li>
          <li className="breadcrumb-item active" aria-current="page">资金请求管理</li>
        </ol>
      </nav>

      {/* 钱包状态信息 */}
      {walletStatus && (
        <div className="alert alert-info alert-dismissible fade show mb-4">
          <i className="bi bi-info-circle me-2"></i>
          {walletStatus}
          <button type="button" className="btn-close" onClick={() => setWalletStatus('')} aria-label="Close"></button>
        </div>
      )}

      {/* 用户身份信息 */}
      <div className="alert alert-light mb-4 d-flex justify-content-between align-items-center">
        <div>
          <strong>当前钱包账户:</strong> {account.slice(0, 8)}...{account.slice(-6)}
          {isCreator && <span className="badge bg-primary ms-2">创建者</span>}
          {isSupporter && <span className="badge bg-success ms-2">贡献者 ({contribution} ETH)</span>}
        </div>
        <div>
          <button onClick={refreshData} className="btn btn-sm btn-outline-secondary me-2" disabled={loading}>
            <i className="bi bi-arrow-clockwise me-1"></i>
            刷新状态
          </button>
          <button onClick={() => window.location.reload()} className="btn btn-sm btn-outline-primary">
            <i className="bi bi-arrow-counterclockwise me-1"></i>
            重新加载
          </button>
        </div>
      </div>

      {showContributorWarning && (
        <div className="alert alert-warning mb-4">
          <strong>警告:</strong> 系统检测到您已捐款 {contribution} ETH，但无法正确识别您的贡献者身份。
          这可能是由于钱包地址不匹配或系统错误导致。请尝试刷新页面或联系管理员处理。
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-5 fw-bold">资金请求</h1>
        {isCreator && (
          <button 
            className="btn btn-primary rounded-pill" 
            onClick={() => setShowRequestForm(!showRequestForm)}
          >
            <i className={`bi ${showRequestForm ? 'bi-x' : 'bi-plus-circle'} me-2`}></i>
            {showRequestForm ? '取消' : '创建新请求'}
          </button>
        )}
      </div>
      
      {/* 贡献者信息展示 */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title">项目信息</h5>
          <div className="row">
            <div className="col-md-4">
              <p className="mb-1"><strong>目标金额:</strong> {project?.goal} ETH</p>
              <p className="mb-1"><strong>当前金额:</strong> {project?.currentAmount} ETH</p>
            </div>
            <div className="col-md-4">
              <p className="mb-1"><strong>贡献者数量:</strong> {project?.contributorsCount}</p>
              <p className="mb-1"><strong>您的贡献:</strong> {contribution} ETH</p>
            </div>
            <div className="col-md-4">
              <p className="mb-1">
                <strong>您的身份:</strong> {' '}
                {isCreator ? <span className="badge bg-primary">创建者</span> : ''}
                {isSupporter ? <span className="badge bg-success ms-1">贡献者</span> : ''}
                {!isCreator && !isSupporter ? <span className="badge bg-secondary">访客</span> : ''}
              </p>
              <p className="mb-1"><strong>请求通过要求:</strong> 超过一半贡献者批准</p>
            </div>
          </div>
        </div>
      </div>

      {showRequestForm && (
        <div className="card shadow-sm border-0 rounded-4 mb-4">
          <div className="card-body p-4">
            <h5 className="card-title fw-bold mb-3">创建新的资金请求</h5>
            <form onSubmit={handleCreateRequest}>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">描述</label>
                <textarea 
                  id="description" 
                  className="form-control" 
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required 
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="amount" className="form-label">金额 (ETH)</label>
                  <input 
                    type="number" 
                    id="amount" 
                    className="form-control" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0.001"
                    step="any"
                    required 
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="recipient" className="form-label">接收地址</label>
                  <input
                    type="text"
                    className="form-control"
                    id="recipient"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? '提交中...' : '提交请求'}
              </button>
            </form>
          </div>
        </div>
      )}

      {requests.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4">
          <i className="bi bi-inbox display-1 text-secondary"></i>
          <h3 className="mt-4">暂无资金请求</h3>
          {isCreator && !showRequestForm && (
             <p className="text-secondary mt-3">您可以点击右上角按钮创建第一个资金请求</p>
          )}
        </div>
      ) : (
        <div className="list-group">
          {requests.map(req => (
            <div key={req.id} className="list-group-item list-group-item-action flex-column align-items-start mb-3 border-0 shadow-sm rounded-4 p-4">
              <div className="d-flex w-100 justify-content-between mb-2">
                <h5 className="mb-1 fw-bold">{req.description}</h5>
                <small>
                  {req.completed ? 
                    <span className="badge bg-success">已执行</span> : 
                    <span className="badge bg-warning text-dark">待处理</span>
                  }
                </small>
              </div>
              <p className="mb-1"><strong>金额:</strong> {req.amount} ETH</p>
              <p className="mb-2 text-muted small"><strong>接收地址:</strong> {req.recipient}</p>
              
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="progress flex-grow-1 me-3" style={{ height: '25px' }}>
                  <div 
                    className="progress-bar bg-success" 
                    role="progressbar"
                    style={{ 
                      width: `${(req.approvalCount / project.contributorsCount) * 100}%` 
                    }}
                    aria-valuenow={req.approvalCount}
                    aria-valuemin="0"
                    aria-valuemax={project.contributorsCount}
                  >
                    <span className="fw-bold">
                      {req.approvalCount} / {project.contributorsCount}
                    </span>
                  </div>
                </div>
                
                {!req.completed && (
                  <div className="btn-group" role="group">
                    {isSupporter && !isCreator && (
                      <button 
                        className={`btn ${userApprovals[req.id] ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => handleApprove(req.id)}
                        disabled={userApprovals[req.id]}
                      >
                        {userApprovals[req.id] ? '已批准' : '批准'}
                      </button>
                    )}
                    {isCreator && (
                      <button 
                        className="btn btn-success" 
                        onClick={() => handleFinalizeRequest(req.id)}
                        disabled={req.approvalCount * 2 <= project.contributorsCount}
                        title={req.approvalCount * 2 <= project.contributorsCount ? 
                          "需要超过一半贡献者批准才能执行" : "批准数已满足要求，可以执行"}
                      >
                        执行
                      </button>
                    )}
                  </div>
                )}
              </div>
              {!req.completed && isCreator && (
                <div className="mt-2 text-muted small">
                  {req.approvalCount * 2 <= project.contributorsCount ? 
                    `还需要${Math.ceil(project.contributorsCount/2) - req.approvalCount}位贡献者批准才能执行` : 
                    "已有足够批准，可以执行请求"
                  }
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsManage; 