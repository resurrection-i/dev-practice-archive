import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import WalletContext from '../utils/WalletContext';
import { getContract, getProject, fundProject, getContribution } from '../utils/contractService';
import { ethers } from 'ethers';
import ConnectWallet from '../components/ConnectWallet';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { provider, signer, account, userInfo } = useContext(WalletContext);
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contribution, setContribution] = useState('0');
  const [fundAmount, setFundAmount] = useState('');
  const [isFunding, setIsFunding] = useState(false);
  const [transactionInProgress, setTransactionInProgress] = useState(false);

  useEffect(() => {
    const loadProjectDetails = async () => {
      if (!provider) return;

      try {
        setLoading(true);
        setError('');
        const contract = getContract(provider, signer);
        if (!contract) throw new Error("无法连接到合约");

        const projectDetails = await getProject(contract, id);
        setProject(projectDetails);

        if (account) {
          const userContribution = await getContribution(contract, id, account);
          setContribution(userContribution);
        }
      } catch (err) {
        console.error('加载项目详情失败:', err);
        setError('无法加载项目详情，请确认项目ID是否正确或刷新页面。');
      } finally {
        setLoading(false);
      }
    };
    
    loadProjectDetails();
  }, [id, provider, signer, account]);

  const handleFundProject = async (e) => {
    e.preventDefault();
    if (!fundAmount || parseFloat(fundAmount) <= 0) {
      setError('请输入有效的捐款金额');
      return;
    }

    if (!signer || !account) {
      setError('请先连接您的钱包');
      return;
    }

    // 检查钱包地址是否匹配
    if (userInfo && userInfo.primaryWalletAddress) {
      if (account.toLowerCase() !== userInfo.primaryWalletAddress.toLowerCase()) {
        setError(`⚠️ 钱包地址不匹配！\n当前连接的钱包: ${account}\n账户绑定的钱包: ${userInfo.primaryWalletAddress}\n\n请切换到正确的钱包地址，或使用正确的账户登录。`);
        return;
      }
    }

    setIsFunding(true);
    setTransactionInProgress(true);
    setError('');
    
    try {
      // 重新获取最新的签名者，确保使用当前连接的钱包账户
      const currentSigner = await provider.getSigner();
      const currentSignerAddress = await currentSigner.getAddress();
      
      console.log(`准备使用账户 ${currentSignerAddress} 执行捐款交易`);
      
      // 确保当前连接的账户与 WalletContext 中的账户一致
      if (currentSignerAddress.toLowerCase() !== account.toLowerCase()) {
        console.warn(`检测到钱包账户不匹配! Context: ${account}, Current: ${currentSignerAddress}`);
        setError(`检测到钱包账户变更，请刷新页面后再试`);
        setIsFunding(false);
        setTransactionInProgress(false);
        return;
      }
      
      // 使用最新的签名者创建合约实例
      const contract = getContract(provider, currentSigner);
      if (!contract) throw new Error("需要签名者来执行交易");
      
      // 显示捐款金额和接收者地址
      console.log(`执行捐款: ${fundAmount} ETH 到项目 ${id}`);
      
      const tx = await fundProject(contract, id, fundAmount);
      console.log('捐款交易已提交:', tx.hash);
      
      await tx.wait();
      console.log('捐款交易已确认');
      
      // 刷新项目数据和用户贡献
      const updatedProject = await getProject(contract, id);
      setProject(updatedProject);
      
      // 使用最新的钱包地址获取贡献
      const userContribution = await getContribution(contract, id, currentSignerAddress);
      setContribution(userContribution);
      setFundAmount('');
      
      // 显示成功消息
      alert('捐款成功！感谢您的支持');
    } catch (err) {
      console.error('捐款失败:', err);
      setError(err.reason || err.message || '捐款失败，请稍后重试');
    } finally {
      setIsFunding(false);
      setTransactionInProgress(false);
    }
  };

  const isSuccessful = project && parseFloat(project.currentAmount) >= parseFloat(project.goal);

  const getStatusBadge = (p) => {
    if (!p) return null;
    if (p.completed) return <span className="badge bg-secondary fs-6">已完成</span>;
    if (isSuccessful) return <span className="badge bg-success fs-6">目标达成</span>;
    if (new Date() > p.deadline) return <span className="badge bg-danger fs-6">已结束</span>;
    return <span className="badge bg-primary fs-6">进行中</span>;
  };
  
  const progressPercent = project ? Math.min((parseFloat(project.currentAmount) / parseFloat(project.goal)) * 100, 100).toFixed(1) : 0;

  const isCreator = project && account && project.creator.toLowerCase() === account.toLowerCase();
  const isSupporter = parseFloat(contribution) > 0;

  // 重新加载钱包信息
  const refreshWalletInfo = async () => {
    if (provider && account) {
      try {
        const contract = getContract(provider, signer);
        if (contract) {
          const userContribution = await getContribution(contract, id, account);
          setContribution(userContribution);
        }
      } catch (error) {
        console.error("刷新钱包信息失败:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">加载中...</span>
        </div>
        <p className="mt-3 text-secondary">正在加载项目详情...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex align-items-center rounded-3" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        <div>{error}</div>
        <button className="btn btn-sm btn-outline-danger ms-auto" onClick={() => window.location.reload()}>
          刷新页面
        </button>
      </div>
    );
  }
  
  if (!project) {
    return <div className="text-center py-5">未找到项目。</div>;
  }

  return (
    <div className="container py-5">
      {/* 导航和标题 */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0 bg-transparent">
            <li className="breadcrumb-item"><Link to="/">首页</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{project.name}</li>
          </ol>
        </nav>
        <div>
          <button onClick={refreshWalletInfo} className="btn btn-outline-secondary rounded-pill me-2">
            <i className="bi bi-arrow-clockwise me-1"></i>
            刷新
          </button>
          {(isCreator || isSupporter) && (
            <Link to={`/requests/${id}`} className="btn btn-outline-primary rounded-pill">
              <i className="bi bi-card-checklist me-2"></i>
              {isCreator ? '管理资金请求' : '查看资金请求'}
            </Link>
          )}
        </div>
      </div>

      {/* 用户身份信息 */}
      {account && (
        <div className="alert alert-info mb-4 d-flex justify-content-between align-items-center">
          <div>
            <strong>当前钱包账户:</strong> {account.slice(0, 8)}...{account.slice(-6)}
            {isCreator && <span className="badge bg-primary ms-2">创建者</span>}
            {isSupporter && <span className="badge bg-success ms-2">贡献者 ({contribution} ETH)</span>}
          </div>
          <button className="btn btn-sm btn-outline-info" onClick={() => window.location.reload()}>
            切换账户后刷新
          </button>
        </div>
      )}

      <div className="row g-5">
        {/* 左侧：项目详情 */}
        <div className="col-lg-8">
          <div className="d-flex align-items-center mb-3">
            <h1 className="display-5 fw-bold me-3">{project.name}</h1>
            {getStatusBadge(project)}
          </div>
          
          <div className="d-flex align-items-center text-muted mb-4">
            <i className="bi bi-person-fill me-2"></i>
            <span>创建者:</span>
            <span className="ms-2 text-break" title={project.creator}>{`${project.creator.slice(0, 8)}...${project.creator.slice(-6)}`}</span>
          </div>

          <div className="card shadow-sm border-0 rounded-4 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">项目描述</h5>
              <p className="text-secondary" style={{ whiteSpace: 'pre-wrap' }}>{project.description}</p>
            </div>
          </div>
          
          <div className="card shadow-sm border-0 rounded-4">
             <div className="card-body p-4">
                <h5 className="fw-bold mb-3">项目动态</h5>
                <p className="text-secondary">此处将来可以展示项目的更新、里程碑等信息。</p>
             </div>
          </div>
        </div>

        {/* 右侧：众筹信息和操作 */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 rounded-4 sticky-top" style={{ top: '100px' }}>
            <div className="card-body p-4">
              <div className="mb-3">
                <div className="progress rounded-pill" style={{ height: '12px' }}>
                  <div 
                    className="progress-bar"
                    role="progressbar" 
                    style={{ width: `${progressPercent}%` }}
                    aria-valuenow={progressPercent} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
              
              <div className="mb-4">
                <h2 className="fw-bold mb-1">{project.currentAmount} <span className="fs-5 text-muted">ETH</span></h2>
                <span className="text-secondary">已筹集，目标 {project.goal} ETH</span>
              </div>
              
              <div className="d-flex justify-content-around text-center mb-4">
                <div>
                  <h5 className="fw-bold mb-0">{progressPercent}%</h5>
                  <small className="text-muted">进度</small>
                </div>
                <div>
                  <h5 className="fw-bold mb-0">{project.contributorsCount}</h5>
                  <small className="text-muted">支持者</small>
                </div>
                <div>
                  <h5 className="fw-bold mb-0">{new Date() > project.deadline ? '已结束' : `${Math.ceil((project.deadline - new Date()) / (1000 * 60 * 60 * 24))} 天`}</h5>
                  <small className="text-muted">剩余时间</small>
                </div>
              </div>
              
              <hr />

              {/* 捐款区域 */}
              {!project.completed && new Date() < project.deadline && !isSuccessful ? (
                account ? (
                  <form onSubmit={handleFundProject}>
                    <div className="mb-3">
                      <label htmlFor="fundAmount" className="form-label fw-semibold">支持该项目 (ETH)</label>
                      <div className="input-group">
                        <input
                          type="number"
                          id="fundAmount"
                          className="form-control"
                          value={fundAmount}
                          onChange={(e) => setFundAmount(e.target.value)}
                          placeholder="0.1"
                          min="0.001"
                          step="any"
                          required
                          disabled={isFunding || transactionInProgress}
                        />
                         <span className="input-group-text">ETH</span>
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-primary w-100 rounded-pill"
                      disabled={isFunding || transactionInProgress}
                    >
                      {isFunding ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          处理中...
                        </>
                      ) : '立即支持'}
                    </button>
                    <div className="text-center text-muted mt-2">
                      <small>将使用当前连接的钱包账户进行捐款</small>
                    </div>
                    {isCreator && (
                      <div className="text-center small text-info mt-2">
                        您是项目创建者
                      </div>
                    )}
                    {isSupporter && !isCreator && (
                      <div className="text-center small text-success mt-2">
                        您已支持 {contribution} ETH
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="text-center">
                    <p className="mb-2">连接钱包以支持项目</p>
                    <ConnectWallet message="连接钱包" btnProps={{ className: "btn btn-primary rounded-pill w-100" }} />
                  </div>
                )
              ) : (
                <div className="text-center py-3">
                  {isSuccessful ? (
                    <div className="text-success">
                      <i className="bi bi-check-circle-fill display-1"></i>
                      <h4 className="mt-3">众筹成功!</h4>
                      <p className="text-secondary mb-0">感谢您的支持</p>
                    </div>
                  ) : (
                    <div className="text-secondary">
                      <i className="bi bi-lock-fill display-1"></i>
                      <h4 className="mt-3">众筹已结束</h4>
                      <p className="mb-0">该项目不再接受捐款</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails; 