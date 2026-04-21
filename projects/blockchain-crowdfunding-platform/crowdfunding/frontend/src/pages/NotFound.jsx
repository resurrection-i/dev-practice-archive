import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container py-5 text-center">
      <div className="mb-4">
        <h1 className="display-1 fw-bold">404</h1>
        <p className="fs-3">
          <span className="text-danger">糟糕！</span> 页面不存在
        </p>
        <p className="lead">
          您请求的页面不存在或已被移除
        </p>
      </div>
      <Link to="/" className="btn btn-primary">
        返回首页
      </Link>
    </div>
  );
};

export default NotFound; 