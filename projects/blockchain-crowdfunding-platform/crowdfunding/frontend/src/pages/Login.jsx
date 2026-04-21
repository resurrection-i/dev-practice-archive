import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, getUserInfo } from '../api/auth';
import WalletContext from '../utils/WalletContext';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserInfo } = useContext(WalletContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await login(formData);
      console.log('登录返回数据:', data);
      
      // 保存token
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        
        // 立即获取并更新用户信息
        try {
          const userInfo = await getUserInfo();
          console.log('获取到的用户信息:', userInfo);
          setUserInfo(userInfo);
          alert('登录成功！');
          navigate('/');
        } catch (userErr) {
          console.error('获取用户信息失败:', userErr);
          // 即使获取用户信息失败，也允许登录
          alert('登录成功！');
          navigate('/');
          window.location.reload();
        }
      } else {
        setError('登录返回数据格式错误');
      }
    } catch (err) {
      console.error('登录错误:', err);
      setError(err.response?.data?.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body p-5">
              <h3 className="card-title text-center mb-4">
                <i className="bi bi-box-arrow-in-right me-2 text-primary"></i>
                用户登录
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
                    用户名
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                    placeholder="请输入用户名"
                    autoFocus
                  />
                </div>
                
                <div className="mb-4">
                  <label className="form-label">
                    <i className="bi bi-lock me-2"></i>
                    密码
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    placeholder="请输入密码"
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
                      登录中...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      登录
                    </>
                  )}
                </button>
                
                <div className="text-center">
                  <Link to="/register" className="text-decoration-none">
                    <i className="bi bi-person-plus me-1"></i>
                    还没有账号? 立即注册
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

export default Login;
