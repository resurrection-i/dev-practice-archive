import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import WalletContext from '../utils/WalletContext';
import { getContract, getAllProjects } from '../utils/contractService';
import ProjectCard from '../components/ProjectCard';
import ConnectWallet from '../components/ConnectWallet';

const Home = () => {
  const { provider, signer, account, loading: walletLoading } = useContext(WalletContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'ongoing', 'completed'

  // 加载项目列表
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError('');
        
        // 确保 provider 和 signer 都已初始化
        if (!provider || !signer) {
          setLoading(false);
          return; // 等待初始化完成
        }
        
        const contract = getContract(provider, signer);
        if (!contract) {
          throw new Error('无法连接到合约');
        }
        
        const projectsList = await getAllProjects(contract);
        setProjects(projectsList.reverse()); // 最近的项目排在前面
      } catch (err) {
        console.error('加载项目失败:', err);
        setError('加载项目失败，请检查网络连接或刷新页面');
      } finally {
        setLoading(false);
      }
    };
    
    loadProjects();
  }, [provider, signer]);

  // 筛选项目
  const filteredProjects = projects.filter(p => {
    const isSuccessful = parseFloat(p.currentAmount) >= parseFloat(p.goal);
    const isExpired = new Date() > p.deadline;

    if (filter === 'ongoing') {
      return !p.completed && !isSuccessful && !isExpired;
    }
    if (filter === 'completed') {
      return p.completed || isSuccessful || isExpired;
    }
    return true; // 'all'
  });

  // 按截止日期排序（活跃项目优先）
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const now = new Date();
    const aActive = a.deadline > now && !a.completed;
    const bActive = b.deadline > now && !b.completed;
    
    // 首先按状态排序（活跃 > 已完成）
    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;
    
    // 然后按截止日期排序（即将结束的优先）
    if (aActive && bActive) return a.deadline - b.deadline;
    
    // 已完成的项目按完成时间倒序
    return b.deadline - a.deadline;
  });

  return (
    <div className="container py-5">
      {/* 头部区域 */}
      <div className="row mb-5">
        <div className="col-lg-8">
          <h1 className="display-4 fw-bold text-primary mb-3">区块链众筹平台</h1>
          <p className="lead text-secondary mb-4">支持创新项目，通过区块链技术实现透明、安全的众筹</p>
          
          <div className="d-flex flex-wrap gap-3">
            {account ? (
              <Link to="/create" className="btn btn-primary btn-lg rounded-pill px-4 shadow-sm">
                <i className="bi bi-plus-circle me-2"></i>
                创建新项目
              </Link>
            ) : (
              <ConnectWallet message="连接钱包以创建项目" className="btn btn-primary btn-lg rounded-pill px-4 shadow-sm" />
            )}
            
            <a href="https://ethereum.org" target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary btn-lg rounded-pill px-4">
              <i className="bi bi-info-circle me-2"></i>
              了解区块链
            </a>
          </div>
        </div>
        
        <div className="col-lg-4 d-none d-lg-block">
          <div className="card bg-light border-0 rounded-4 shadow-sm h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-lightning-charge-fill text-warning me-2"></i>
                平台优势
              </h5>
              <ul className="list-unstyled">
                <li className="mb-3 d-flex">
                  <i className="bi bi-check-circle-fill text-success me-2 mt-1"></i>
                  <span>智能合约保证资金安全透明</span>
                </li>
                <li className="mb-3 d-flex">
                  <i className="bi bi-check-circle-fill text-success me-2 mt-1"></i>
                  <span>支持者参与决策资金使用</span>
                </li>
                <li className="mb-3 d-flex">
                  <i className="bi bi-check-circle-fill text-success me-2 mt-1"></i>
                  <span>去中心化运作，无中间商抽成</span>
                </li>
                <li className="d-flex">
                  <i className="bi bi-check-circle-fill text-success me-2 mt-1"></i>
                  <span>区块链技术确保交易不可篡改</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* 项目筛选和列表 */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <h2 className="h3 fw-bold mb-3 mb-md-0">探索项目</h2>
            
            <div className="btn-group" role="group" aria-label="项目筛选">
              <button 
                type="button" 
                className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('all')}
              >
                全部项目
              </button>
              <button 
                type="button" 
                className={`btn ${filter === 'ongoing' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('ongoing')}
              >
                进行中
              </button>
              <button 
                type="button" 
                className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('completed')}
              >
                已完成
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 加载状态 */}
      {(loading || walletLoading) && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">加载中...</span>
          </div>
          <p className="mt-3 text-secondary">正在加载项目，请稍候...</p>
        </div>
      )}

      {/* 未连接钱包提示 */}
      {!loading && !walletLoading && !provider && (
        <div className="text-center py-5 bg-light rounded-4">
          <i className="bi bi-wallet2 display-1 text-secondary"></i>
          <h3 className="mt-4 mb-3">请先连接钱包</h3>
          <p className="text-secondary mb-4">连接 MetaMask 钱包以查看和创建众筹项目</p>
          <ConnectWallet message="连接钱包" className="btn btn-primary rounded-pill px-4" />
        </div>
      )}

      {/* 错误提示 */}
      {error && !loading && !walletLoading && (
        <div className="alert alert-danger d-flex align-items-center rounded-3" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{error}</div>
        </div>
      )}

      {/* 无项目提示 */}
      {!loading && !walletLoading && !error && provider && sortedProjects.length === 0 && (
        <div className="text-center py-5 bg-light rounded-4">
          <i className="bi bi-inbox display-1 text-secondary"></i>
          <h3 className="mt-4 mb-3">暂无项目</h3>
          <p className="text-secondary mb-4">
            {filter !== 'all' ? '当前筛选条件下没有找到项目' : '成为第一个创建众筹项目的人吧！'}
          </p>
          {account ? (
            <Link to="/create" className="btn btn-primary rounded-pill px-4">
              <i className="bi bi-plus-circle me-2"></i>
              创建新项目
            </Link>
          ) : (
            <ConnectWallet message="连接钱包以创建项目" className="btn btn-primary rounded-pill px-4" />
          )}
        </div>
      )}

      {/* 项目列表 */}
      {!loading && !error && sortedProjects.length > 0 && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {sortedProjects.map(project => (
            <div className="col" key={project.id}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home; 