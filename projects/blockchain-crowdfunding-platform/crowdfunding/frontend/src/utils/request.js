import axios from 'axios';

// 根据环境自动选择API地址
const baseURL = import.meta.env.MODE === 'development' 
  ? '/api'  // 开发环境：使用Vite代理
  : 'http://localhost:8080/api';  // 生产环境：直接访问后端（需要CORS）

const request = axios.create({
  baseURL,
  timeout: 10000
});

// 请求拦截器 - 添加Token
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理响应
request.interceptors.response.use(
  response => {
    const res = response.data;
    
    console.log('后端响应:', res); // 添加日志
    
    // 如果返回的code不是200，认为是错误
    if (res.code !== 200) {
      console.error('接口错误:', res.message);
      alert(res.message || '请求失败');
      return Promise.reject(new Error(res.message || '请求失败'));
    }
    
    // 返回data部分
    return res.data;
  },
  error => {
    console.error('响应错误详情:', error);
    console.error('响应状态:', error.response?.status);
    console.error('响应数据:', error.response?.data);
    
    // 处理401未授权
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      alert('登录已过期，请重新登录');
      window.location.href = '/login';
    } else {
      const message = error.response?.data?.message || error.message || '网络错误';
      alert(message);
    }
    
    return Promise.reject(error);
  }
);

export default request;
