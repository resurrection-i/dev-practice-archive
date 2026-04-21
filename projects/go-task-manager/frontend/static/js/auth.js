// 认证相关功能
const auth = {
    // 登录方法
    async login(username, password) {
        try {
            const response = await api.auth.login(username, password);
            if (response.data && response.data.token) {
                // 获取原始用户数据
                const userData = response.data.user;
                console.log('API返回的原始用户数据:', userData);
                
                // 构建一个规范化的用户对象
                const normalizedUser = {
                    ...userData
                };
                
                // 确保role_id字段存在且有效
                if (typeof normalizedUser.role_id !== 'number') {
                    // 如果没有role_id但有role名称，根据role设置role_id
                    if (normalizedUser.role) {
                        const roleMap = {
                            'admin': 1,    // 管理员 -> 1
                            'manager': 2,  // 项目经理 -> 2
                            'user': 3      // 普通用户 -> 3
                        };
                        normalizedUser.role_id = roleMap[normalizedUser.role] || 3;
                    } else {
                        // 默认设置为普通用户
                        normalizedUser.role_id = 3;
                    }
                }
                
                // 调试输出
                console.log('存储到localStorage的用户数据:', normalizedUser);
                
                // 保存token和用户信息
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(normalizedUser));
                
                return { success: true };
            } else {
                return { success: false, message: '登录失败，请重试' };
            }
        } catch (error) {
            console.error('登录失败:', error);
            const errorMsg = error.response?.data?.error || '用户名或密码错误';
            return { success: false, message: errorMsg };
        }
    },
    
    // 注册方法
    async register(username, password, email) {
        try {
            const response = await api.auth.register(username, password, email);
            return { success: true };
        } catch (error) {
            console.error('注册失败:', error);
            const errorMsg = error.response?.data?.error || '注册失败，请重试';
            return { success: false, message: errorMsg };
        }
    },
    
    // 退出登录
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // 先设置跳转目标，然后刷新页面
        window.location.href = '#/login';
        setTimeout(() => {
            window.location.reload();
        }, 100);
    },
    
    // 检查是否已登录
    isAuthenticated() {
        return !!localStorage.getItem('token');
    },
    
    // 获取当前用户信息
    getUser() {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        
        try {
            const user = JSON.parse(userStr);
            console.log('auth.getUser:', user);
            return user;
        } catch (e) {
            console.error('解析用户数据失败', e);
            return null;
        }
    },
    
    // 检查权限
    hasPermission(permission) {
        const user = this.getUser();
        if (!user) return false;
        
        // 管理员拥有所有权限
        const isAdmin = user.role === 'admin' || user.role === 1 || user.role_id === 1;
        console.log('hasPermission检查:', {
            user,
            isAdmin,
            byRole: user.role === 'admin',
            byRoleNum: user.role === 1, 
            byRoleId: user.role_id === 1
        });
        
        if (isAdmin) {
            return true;
        }
        
        // 项目经理拥有特定权限
        if (user.role === 'manager' || user.role === 2 || user.role_id === 2) {
            // 项目经理可以管理任务和查看报告
            if (permission === 'manage_tasks' || permission === 'view_reports') {
                return true;
            }
        }
        
        // TODO: 根据实际权限系统实现更细粒度的权限检查
        return false;
    }
};

// 验证相关功能

// 验证用户是否已登录
function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

// 获取当前登录用户信息
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
        const user = JSON.parse(userStr);
        console.log('getCurrentUser:', user); // 添加调试日志
        return user;
    } catch (e) {
        console.error('解析用户数据失败', e);
        return null;
    }
}

// 保存用户信息和令牌
function setAuthInfo(user, token) {
    // 确保用户对象包含所有必要信息
    const userToSave = {
        ...user,
        role: user.role || 'user'
    };
    
    localStorage.setItem('user', JSON.stringify(userToSave));
    localStorage.setItem('token', token);
    console.log('Saved auth info:', userToSave); // 添加调试日志
}

// 清除认证信息
function clearAuth() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
} 