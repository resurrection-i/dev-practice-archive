// 工具函数和常量
const utils = {
    // 判断用户是否是管理员
    isAdmin(user) {
        if (!user) return false;
        // role_id = 1 或 role = 'admin' 表示管理员
        return user.role === 'admin' || user.role_id === 1 || user.role === 1;
    },

    // 判断用户是否是项目经理
    isManager(user) {
        if (!user) return false;
        // role_id = 2 或 role = 'manager' 表示项目经理
        return user.role === 'manager' || user.role_id === 2 || user.role === 2;
    },

    // 判断用户是否是普通用户
    isRegularUser(user) {
        if (!user) return false;
        // role_id = 3 表示普通用户
        return user.role === 'user' || user.role_id === 3 || user.role === 3;
    },

    // 获取当前登录用户信息
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        
        try {
            const user = JSON.parse(userStr);
            console.log('getCurrentUser from utils:', user); // 添加调试日志
            return user;
        } catch (e) {
            console.error('解析用户数据失败:', e);
            return null;
        }
    },

    // 格式化日期
    formatDate(dateString, includeTime = true) {
        if (!dateString) return '无日期';
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };
        
        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }
        
        return date.toLocaleString('zh-CN', options);
    },

    // 格式化日期为输入框格式
    formatDateForInput(date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();
        
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        
        return [year, month, day].join('-');
    },

    // 获取状态样式类
    getStatusClass(status) {
        if (typeof status === 'number') {
            switch(status) {
                case 1: return 'bg-warning';   // 待处理
                case 2: return 'bg-primary';   // 进行中
                case 3: return 'bg-success';   // 已完成
                case 4: return 'bg-danger';    // 已删除
                default: return 'bg-secondary';
            }
        }
        
        switch(status) {
            case 'pending': return 'bg-warning';
            case 'in_progress': return 'bg-primary';
            case 'completed': return 'bg-success';
            default: return 'bg-secondary';
        }
    },

    // 获取状态文本
    getStatusText(status) {
        if (typeof status === 'number') {
            switch(status) {
                case 1: return '待处理';
                case 2: return '进行中';
                case 3: return '已完成';
                case 4: return '已删除';
                default: return '未知';
            }
        }
        
        switch(status) {
            case 'pending': return '待处理';
            case 'in_progress': return '进行中';
            case 'completed': return '已完成';
            default: return status || '未知';
        }
    },

    // 获取优先级样式类
    getPriorityClass(priority) {
        if (typeof priority === 'number') {
            switch(priority) {
                case 1: return 'bg-success';   // 低优先级
                case 2: return 'bg-warning';   // 中优先级
                case 3: return 'bg-danger';    // 高优先级
                default: return 'bg-secondary';
            }
        }
        
        switch(priority) {
            case 'low': return 'bg-success';
            case 'medium': return 'bg-warning';
            case 'high': return 'bg-danger';
            default: return 'bg-secondary';
        }
    },

    // 获取优先级文本
    getPriorityText(priority) {
        if (typeof priority === 'number') {
            switch(priority) {
                case 1: return '低';
                case 2: return '中';
                case 3: return '高';
                default: return '未知';
            }
        }
        
        switch(priority) {
            case 'low': return '低';
            case 'medium': return '中';
            case 'high': return '高';
            default: return priority || '未知';
        }
    },

    // 获取角色样式类
    getRoleBadgeClass(role) {
        if (typeof role === 'number') {
            switch(role) {
                case 1: return 'bg-danger';     // 管理员
                case 2: return 'bg-warning';    // 项目经理
                case 3: return 'bg-info';       // 普通用户
                default: return 'bg-secondary';
            }
        }
        
        switch(role) {
            case 'admin': return 'bg-danger';
            case 'manager': return 'bg-warning';
            case 'user': return 'bg-info';
            default: return 'bg-secondary';
        }
    },

    // 获取角色文本
    getRoleText(role) {
        if (typeof role === 'number') {
            switch(role) {
                case 1: return '管理员';
                case 2: return '项目经理';
                case 3: return '普通用户';
                default: return '未知';
            }
        }
        
        switch(role) {
            case 'user': return '普通用户';
            case 'admin': return '管理员';
            case 'manager': return '项目经理';
            default: return role || '未知';
        }
    }
}; 