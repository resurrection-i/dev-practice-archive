import React from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';

const ProjectCard = ({ project }) => {
  const { id, name, description, goal, currentAmount, deadline, completed, contributorsCount } = project;
  
  const progressPercent = Math.min((parseFloat(currentAmount) / parseFloat(goal)) * 100, 100).toFixed(1);
  const isSuccessful = parseFloat(currentAmount) >= parseFloat(goal);
  const isExpired = new Date() > deadline;
  
  const getStatusBadge = () => {
    if (completed) return <span className="badge bg-secondary">已完成</span>;
    if (isSuccessful) return <span className="badge bg-success">目标达成</span>;
    if (isExpired) return <span className="badge bg-danger">已结束</span>;
    return <span className="badge bg-primary">进行中</span>;
  };
  
  // 计算剩余时间
  const getRemainingTime = () => {
    if (isExpired) return '已结束';
    
    const now = new Date();
    const diff = deadline - now;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days}天${hours}小时`;
    } else if (hours > 0) {
      return `${hours}小时`;
    } else {
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${minutes}分钟`;
    }
  };
  
  // 截断描述文本
  const truncateDescription = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Link to={`/project/${id}`} className="card h-100 text-decoration-none shadow-sm project-card border-0 rounded-4">
      {/* 项目状态标签 - 绝对定位在卡片右上角 */}
      <div className="position-absolute top-0 end-0 m-3">
        {getStatusBadge()}
      </div>
      
      {/* 项目卡片内容 */}
      <div className="card-body p-4">
        <h5 className="card-title fw-bold mb-2 text-truncate">
          {name}
        </h5>
        
        <div className="d-flex align-items-center text-muted mb-3">
          <i className="bi bi-people-fill me-1"></i>
          <small>{contributorsCount} 位支持者</small>
          
          <div className="mx-2">•</div>
          
          <i className="bi bi-clock-fill me-1"></i>
          <small>{getRemainingTime()}</small>
        </div>
        
        <p className="card-text text-secondary mb-4" style={{ minHeight: '3rem' }}>
          {truncateDescription(description)}
        </p>
        
        {/* 进度条 */}
        <div className="mb-2">
          <div className="progress rounded-pill" style={{ height: '10px' }}>
            <div 
              className={`progress-bar ${isSuccessful ? 'bg-success' : ''}`}
              role="progressbar" 
              style={{ width: `${progressPercent}%` }}
              aria-valuenow={progressPercent} 
              aria-valuemin="0" 
              aria-valuemax="100"
            ></div>
          </div>
        </div>
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h6 className="fw-bold mb-0">{Number(currentAmount).toFixed(2)} ETH</h6>
            <small className="text-muted">已筹集</small>
          </div>
          <div className="text-end">
            <h6 className="fw-bold mb-0">{progressPercent}%</h6>
            <small className="text-muted">目标 {Number(goal).toFixed(2)} ETH</small>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard; 