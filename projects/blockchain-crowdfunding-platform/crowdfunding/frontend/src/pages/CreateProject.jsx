import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import WalletContext from '../utils/WalletContext';
import { getContract, createProject } from '../utils/contractService';
import ConnectWallet from '../components/ConnectWallet';

const CreateProject = () => {
  const navigate = useNavigate();
  const { provider, signer, account, userInfo } = useContext(WalletContext);
  
  // 表单状态
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  
  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 验证表单
    if (!name.trim() || !description.trim() || !goal || goal <= 0 || !duration || duration <= 0) {
      setError('请填写所有必填项，并确保目标金额和时间为正数');
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
      
      // 获取合约实例
      const contract = getContract(provider, signer);
      if (!contract) {
        throw new Error('无法连接到合约');
      }
      
      // 创建项目
      const tx = await createProject(contract, name, description, goal, parseInt(duration));
      setTransactionHash(tx.hash);
      
      // 等待交易确认
      await tx.wait();
      
      // 跳转回首页
      navigate('/');
    } catch (err) {
      console.error('创建项目失败:', err);
      setError(`创建项目失败: ${err.message || '未知错误'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 如果未连接钱包或未获取签名者，显示连接提示
  if (!account || !signer) {
    return (
      <div className="container py-5">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card shadow border-0 rounded-4">
              <div className="card-body text-center py-5">
                <h2 className="mb-4 fw-bold text-primary">请先连接您的钱包</h2>
                <p className="lead mb-4 text-secondary">您需要连接 MetaMask 钱包才能创建众筹项目</p>
                <div className="d-flex justify-content-center">
                  <ConnectWallet message="连接钱包以继续" className="btn btn-lg btn-primary rounded-pill px-4 py-3 shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-5 fw-bold text-primary mb-3">创建新项目</h1>
          <p className="lead text-secondary">填写以下信息创建您的众筹项目，所有字段均为必填</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-4 mb-4">
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger d-flex align-items-center rounded-3 mb-4" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{error}</div>
                </div>
              )}
              
              {transactionHash && (
                <div className="alert alert-success d-flex align-items-center rounded-3 mb-4" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <div>
                    <p className="mb-1 fw-bold">交易已提交！</p>
                    <p className="mb-0 small">交易哈希：
                      <a 
                        href={`https://etherscan.io/tx/${transactionHash}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ms-1 text-break"
                      >
                        {transactionHash}
                      </a>
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="form-label fw-semibold">项目名称 <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control form-control-lg rounded-3"
                    id="name"
                    placeholder="输入项目名称（如：智能家居设备）"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="form-label fw-semibold">项目描述 <span className="text-danger">*</span></label>
                  <textarea
                    className="form-control form-control-lg rounded-3"
                    id="description"
                    rows="6"
                    placeholder="详细描述您的项目，包括目标、用途和实施计划..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label htmlFor="goal" className="form-label fw-semibold">目标金额（ETH）<span className="text-danger">*</span></label>
                    <div className="input-group input-group-lg">
                      <input
                        type="number"
                        className="form-control rounded-start-3"
                        id="goal"
                        min="0.01"
                        step="0.01"
                        placeholder="1.5"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                      <span className="input-group-text rounded-end-3 bg-light">ETH</span>
                    </div>
                    <div className="form-text">设置您希望筹集的以太币金额</div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="duration" className="form-label fw-semibold">项目持续时间（天）<span className="text-danger">*</span></label>
                    <div className="input-group input-group-lg">
                      <input
                        type="number"
                        className="form-control rounded-start-3"
                        id="duration"
                        min="1"
                        max="365"
                        placeholder="30"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                      <span className="input-group-text rounded-end-3 bg-light">天</span>
                    </div>
                    <div className="form-text">设置项目的募资期限，最长 365 天</div>
                  </div>
                </div>

                <div className="d-flex gap-3 mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg px-4 rounded-pill" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        创建中...
                      </>
                    ) : '创建项目'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary btn-lg px-4 rounded-pill" 
                    onClick={() => navigate('/')}
                    disabled={isSubmitting}
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-primary text-white py-3 rounded-top-4">
              <h5 className="card-title mb-0 fw-bold">
                <i className="bi bi-info-circle-fill me-2"></i>
                项目创建须知
              </h5>
            </div>
            <div className="card-body p-4">
              <ul className="list-group list-group-flush">
                <li className="list-group-item border-0 d-flex align-items-center py-3 px-0">
                  <i className="bi bi-currency-exchange text-primary fs-4 me-3"></i>
                  <div>所有交易都使用 <strong>ETH</strong> 进行</div>
                </li>
                <li className="list-group-item border-0 d-flex align-items-center py-3 px-0">
                  <i className="bi bi-fuel-pump text-primary fs-4 me-3"></i>
                  <div>创建项目需支付少量 <strong>Gas 费用</strong></div>
                </li>
                <li className="list-group-item border-0 d-flex align-items-center py-3 px-0">
                  <i className="bi bi-lock-fill text-primary fs-4 me-3"></i>
                  <div>项目一旦创建就<strong>无法修改</strong></div>
                </li>
                <li className="list-group-item border-0 d-flex align-items-center py-3 px-0">
                  <i className="bi bi-cash-coin text-primary fs-4 me-3"></i>
                  <div>项目接收资金后，需要通过<strong>资金请求系统</strong>提取</div>
                </li>
                <li className="list-group-item border-0 d-flex align-items-center py-3 px-0">
                  <i className="bi bi-people-fill text-primary fs-4 me-3"></i>
                  <div>所有资金请求需获得<strong>支持者投票批准</strong></div>
                </li>
              </ul>
              
              <div className="alert alert-info rounded-3 mt-3 mb-0">
                <div className="d-flex">
                  <i className="bi bi-lightbulb-fill text-primary fs-5 me-2"></i>
                  <div>
                    <strong>提示：</strong>使用清晰的项目名称和详细的描述可以提高项目的成功率。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject; 