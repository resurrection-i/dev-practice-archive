// 调试帮助工具
(function() {
    // 创建调试按钮
    function createDebugButton() {
        const button = document.createElement('button');
        button.innerText = 'Debug用户信息';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#ff5722';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        
        button.addEventListener('click', debugUserInfo);
        
        document.body.appendChild(button);
    }
    
    // 显示用户信息
    function debugUserInfo() {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                console.log('===== 用户信息 =====');
                console.log('原始用户对象:', user);
                console.log('用户ID:', user.id);
                console.log('用户名:', user.username);
                console.log('角色字段:', user.role);
                console.log('角色ID字段:', user.role_id);
                
                // 检查isAdmin逻辑
                const isAdminByRole = user.role === 'admin';
                const isAdminByRoleNum = user.role === 2;
                const isAdminByRoleId = user.role_id === 2;
                
                console.log('isAdmin检查:');
                console.log('- role === "admin":', isAdminByRole);
                console.log('- role === 2:', isAdminByRoleNum);
                console.log('- role_id === 2:', isAdminByRoleId);
                console.log('最终结果:', isAdminByRole || isAdminByRoleNum || isAdminByRoleId);
                
                // 强制修复user数据
                const fixedUser = {
                    ...user,
                    role_id: user.role_id || null,
                    role: user.role || null
                };
                
                if (user.role_id === 2 && typeof user.role !== 'string') {
                    fixedUser.role = 'admin';
                    console.log('修复后的用户对象:', fixedUser);
                    localStorage.setItem('user', JSON.stringify(fixedUser));
                    alert('已尝试修复用户角色数据，请刷新页面！');
                } else if (user.role === 2 && !user.role_id) {
                    fixedUser.role_id = 2;
                    console.log('修复后的用户对象:', fixedUser);
                    localStorage.setItem('user', JSON.stringify(fixedUser));
                    alert('已尝试修复用户角色ID数据，请刷新页面！');
                } else {
                    console.log('无需修复用户数据');
                }
            } else {
                console.log('未找到用户数据');
            }
        } catch (error) {
            console.error('调试用户信息时出错:', error);
        }
    }
    
    // 页面加载完成后添加调试按钮
    document.addEventListener('DOMContentLoaded', createDebugButton);
})();

// Debug helper functions

// Log the current user data structure
function logUserData() {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User data structure:', userData);
    console.log('User ID:', userData.id);
    console.log('Username:', userData.username);
    console.log('Email:', userData.email);
    console.log('Role ID:', userData.role_id);
    console.log('Role:', userData.role);
    
    return userData;
}

// Debug function to check API requests
function debugApiRequest(endpoint, method, data) {
    console.log(`Debug API Request to ${endpoint} (${method}):`, data);
    return data;
} 