import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-light py-5 mt-auto">
      <div className="container">
        <div className="row g-4">
          {/* 左侧：品牌和简介 */}
          <div className="col-lg-4 mb-3">
            <div className="d-flex align-items-center mb-3">
              <i className="bi bi-cash-coin text-primary fs-3 me-2"></i>
              <h5 className="fw-bold mb-0">区块链众筹平台</h5>
            </div>
            <p className="text-secondary mb-3">
              基于以太坊区块链技术的去中心化众筹平台，为创新项目提供透明、安全的融资渠道。
            </p>
            <div className="d-flex gap-2">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-dark rounded-circle" aria-label="GitHub">
                <i className="bi bi-github"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary rounded-circle" aria-label="Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary rounded-circle" aria-label="Discord">
                <i className="bi bi-discord"></i>
              </a>
            </div>
          </div>
          
          {/* 中间：快速链接 */}
          <div className="col-sm-6 col-lg-4 mb-3">
            <h6 className="fw-bold mb-3">快速链接</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-decoration-none text-secondary">
                  <i className="bi bi-house-door me-2"></i>首页
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/create" className="text-decoration-none text-secondary">
                  <i className="bi bi-plus-circle me-2"></i>创建项目
                </Link>
              </li>
              <li className="mb-2">
                <a href="https://ethereum.org" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-secondary">
                  <i className="bi bi-info-circle me-2"></i>了解区块链
                </a>
              </li>
              <li>
                <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-secondary">
                  <i className="bi bi-wallet2 me-2"></i>安装 MetaMask
                </a>
              </li>
            </ul>
          </div>
          
          {/* 右侧：资源 */}
          <div className="col-sm-6 col-lg-4 mb-3">
            <h6 className="fw-bold mb-3">相关资源</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="https://ethereum.org/developers" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-secondary">
                  <i className="bi bi-code-slash me-2"></i>开发者文档
                </a>
              </li>
              <li className="mb-2">
                <a href="https://hardhat.org" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-secondary">
                  <i className="bi bi-gear me-2"></i>Hardhat 框架
                </a>
              </li>
              <li className="mb-2">
                <a href="https://docs.ethers.org" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-secondary">
                  <i className="bi bi-book me-2"></i>Ethers.js 文档
                </a>
              </li>
              <li>
                <a href="https://soliditylang.org" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-secondary">
                  <i className="bi bi-file-earmark-code me-2"></i>Solidity 语言
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* 分隔线 */}
        <hr className="my-4" />
        
        {/* 版权信息 */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center">
          <p className="text-muted mb-2 mb-sm-0">
            &copy; {new Date().getFullYear()} 区块链众筹平台 | 使用 MIT 许可证
          </p>
          <div>
            <a href="#privacy" className="text-decoration-none text-secondary me-3">
              <small>隐私政策</small>
            </a>
            <a href="#terms" className="text-decoration-none text-secondary">
              <small>使用条款</small>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 