import React from 'react';
import './CandidatesList.css';

const CandidatesList = ({ candidates, loading, onVote }) => {
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>加载候选人数据中...</p>
      </div>
    );
  }

  if (candidates.length === 0) {
    return <div className="no-candidates">暂无候选人数据</div>;
  }

  return (
    <div className="candidates-list">
      {candidates.map(candidate => (
        <div key={candidate.id} className="candidate-card">
          <div className="candidate-info">
            <div className="candidate-name">{candidate.name}</div>
            <div className="vote-count">票数: {candidate.votes}</div>
          </div>
          <button 
            className="vote-button"
            onClick={() => onVote(candidate.id)}
          >
            投票
          </button>
        </div>
      ))}
    </div>
  );
};

export default CandidatesList;