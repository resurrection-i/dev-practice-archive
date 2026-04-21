// API基础URL
const API_BASE_URL = 'http://localhost:8000/api';

// API客户端
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// 请求拦截器 - 添加认证token
apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`发送请求: ${config.method.toUpperCase()} ${config.url}`, config);
        return config;
    },
    error => {
        console.error('请求拦截器错误:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器 - 处理错误
apiClient.interceptors.response.use(
    response => {
        console.log(`响应成功: ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
        return response;
    },
    error => {
        if (error.response) {
            console.error(`响应错误 [${error.response.status}]: ${error.config.method.toUpperCase()} ${error.config.url}`, error.response.data);
            
            // 详细记录请求数据
            if (error.config && error.config.data) {
                try {
                    const requestData = JSON.parse(error.config.data);
                    console.error('请求数据:', requestData);
                } catch (e) {
                    console.error('请求数据 (非JSON):', error.config.data);
                }
            }
            
            // 记录响应错误详情
            if (error.response.data && error.response.data.error) {
                console.error('错误详情:', error.response.data.error);
            }
        } else if (error.request) {
            console.error(`请求未响应: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.request);
        } else {
            console.error('请求配置错误:', error.message);
        }
        
        // 如果是未授权错误，跳转到登录页
        if (error.response && error.response.status === 401) {
            // 清除token和用户信息
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // 跳转到登录页
            window.location.href = '/#/login';
        }
        
        return Promise.reject(error);
    }
);

// API模块
const api = {
    // 认证相关
    auth: {
        login: (username, password) => {
            return apiClient.post('/login', { username, password });
        },
        register: (username, password, email) => {
            return apiClient.post('/register', { username, password, email });
        }
    },
    
    // 用户相关
    users: {
        list: () => {
            return apiClient.get('/users');
        },
        get: (id) => {
            return apiClient.get(`/users/${id}`);
        },
        update: (id, userData) => {
            return apiClient.put(`/users/${id}`, userData);
        },
        delete: (id) => {
            return apiClient.delete(`/users/${id}`);
        }
    },
    
    // 任务相关
    tasks: {
        create: (taskData) => {
            return apiClient.post('/tasks', taskData);
        },
        list: () => {
            return apiClient.get('/tasks');
        },
        get: (id) => {
            return apiClient.get(`/tasks/${id}`);
        },
        update: (id, taskData) => {
            return apiClient.put(`/tasks/${id}`, taskData);
        },
        updateStatus: (id, status) => {
            // 确保状态是数字类型
            const statusValue = typeof status === 'number' ? status : parseInt(status) || 1;
            return apiClient.put(`/tasks/${id}/status`, { status: statusValue });
        },
        assign: (id, assigneeId) => {
            return apiClient.put(`/tasks/${id}/assign`, { assignee_id: assigneeId });
        },
        delete: (id) => {
            return apiClient.delete(`/tasks/${id}`);
        },
        getHistory: (id) => {
            return apiClient.get(`/tasks/${id}/history`);
        }
    }
}; 