import React, { useContext } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import WalletContext from '../utils/WalletContext';
import ConnectWallet from './ConnectWallet';

const Header = () => {
  const { account, userInfo, handleBindWallet, setUserInfo } = useContext(WalletContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  // 判断是否在登录或注册页面
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setUserInfo(null); // 清除WalletContext中的用户信息
    navigate('/login');
  };
  
  // 格式化地址显示
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="sticky-top shadow-sm bg-white">
      <nav className="navbar navbar-expand-lg navbar-light py-3">
        <div className="container">
          {/* 品牌 Logo */}
          <Link className="navbar-brand d-flex align-items-center" to={isAuthPage ? "/login" : "/"}>
            <i className="bi bi-cash-coin text-primary fs-3 me-2"></i>
            <span className="fw-bold fs-4">区块链众筹</span>
          </Link>
          
          {/* 登录/注册页面只显示Logo，不显示其他内容 */}
          {!isAuthPage && (
            <>
              {/* 移动端折叠按钮 */}
              <button 
                className="navbar-toggler border-0" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarNav"
                aria-controls="navbarNav" 
                aria-expanded="false" 
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              
              {/* 导航菜单 */}
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <NavLink 
                      className={({isActive}) => 
                        `nav-link px-3 ${isActive ? 'active fw-semibold' : ''}`
                      } 
                      to="/"
                    >
                      首页
                    </NavLink>
                  </li>
                  {account && (
                    <>
                      <li className="nav-item">
                        <NavLink 
                          className={({isActive}) => 
                            `nav-link px-3 ${isActive ? 'active fw-semibold' : ''}`
                          } 
                          to="/create"
                        >
                          创建项目
                        </NavLink>
                      </li>
                    </>
                  )}
                  <li className="nav-item">
                    <a 
                      className="nav-link px-3" 
                      href="https://ethereum.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      了解区块链
                      <i className="bi bi-box-arrow-up-right ms-1 small"></i>
                    </a>
                  </li>
                </ul>
                
                {/* 用户信息和钱包连接/显示区域 */}
                <div className="d-flex align-items-center gap-3">
                  {/* 用户信息显示 */}
                  {userInfo ? (
                    <div className="d-flex align-items-center">
                      <div className="d-flex align-items-center me-3">
                        <i className="bi bi-person-circle text-primary fs-5 me-2"></i>
                        <div>
                          <div className="fw-bold text-primary">{userInfo.username}</div>
                          {userInfo.primaryWalletAddress && (
                            <div className="small text-muted">
                              <i className="bi bi-wallet2 me-1"></i>
                              {formatAddress(userInfo.primaryWalletAddress)}
                            </div>
                          )}
                        </div>
                      </div>
                      <button 
                        className="btn btn-outline-danger btn-sm rounded-pill"
                        onClick={handleLogout}
                        title="退出登录"
                      >
                        <i className="bi bi-box-arrow-right me-1"></i>
                        退出
                      </button>
                    </div>
                  ) : (
                    <Link to="/login" className="btn btn-outline-primary rounded-pill">
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      登录
                    </Link>
                  )}
                  
                  {/* 钱包连接显示和绑定按钮 - 只在登录后显示 */}
                  {userInfo && (
                    <>
                      {account ? (
                        <div className="d-flex align-items-center gap-2">
                          <div className="badge bg-success rounded-pill px-3 py-2">
                            <i className="bi bi-wallet2 me-2"></i>
                            {formatAddress(account)}
                          </div>
                          {/* 如果已登录但未绑定钱包，显示绑定按钮 */}
                          {!userInfo.primaryWalletAddress && (
                            <button 
                              className="btn btn-warning btn-sm rounded-pill"
                              onClick={handleBindWallet}
                              title="绑定此钱包到您的账户"
                            >
                              <i className="bi bi-link-45deg me-1"></i>
                              绑定钱包
                            </button>
                          )}
                        </div>
                      ) : (
                        <ConnectWallet className="btn btn-primary rounded-pill shadow-sm" />
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
