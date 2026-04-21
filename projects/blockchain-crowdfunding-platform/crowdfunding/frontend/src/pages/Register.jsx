import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    realName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // 验证密码
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      setLoading(false);
      return;
    }
    
    // 验证密码长度
    if (formData.password.length < 6) {
      setError('密码长度至少6位');
      setLoading(false);
      return;
    }
    
    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      alert('注册成功！请登录');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || '注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-5">
              <h3 className="card-title text-center mb-4">
                <i className="bi bi-person-plus me-2 text-primary"></i>
                用户注册
              </h3>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-person me-2"></i>
                    用户名 <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                    minLength={3}
                    maxLength={50}
                    placeholder="3-50个字符"
                    autoFocus
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-envelope me-2"></i>
                    邮箱 <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    placeholder="your@email.com"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-lock me-2"></i>
                    密码 <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    minLength={6}
                    maxLength={20}
                    placeholder="至少6个字符"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-lock-fill me-2"></i>
                    确认密码 <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                    placeholder="再次输入密码"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="form-label">
                    <i className="bi bi-person-badge me-2"></i>
                    真实姓名
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.realName}
                    onChange={(e) => setFormData({...formData, realName: e.target.value})}
                    placeholder="选填"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      注册中...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus me-2"></i>
                      注册
                    </>
                  )}
                </button>
                
                <div className="text-center">
                  <Link to="/login" className="text-decoration-none">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    已有账号? 立即登录
                  </Link>
                </div>
              </form>
            </div>
          </div>
          
          <div className="text-center mt-3">
            <Link to="/" className="text-muted text-decoration-none">
              <i className="bi bi-arrow-left me-1"></i>
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
