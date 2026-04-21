// 创建Vue应用
const { createApp, ref, computed, onMounted, watch } = Vue;

// 路由配置
const routes = {
    '/': DashboardComponent,
    '/dashboard': DashboardComponent,
    '/login': LoginComponent,
    '/register': RegisterComponent,
    '/tasks': TaskListComponent,
    '/task/:id': TaskDetailComponent,
    '/create-task': CreateTaskComponent,
    '/profile': ProfileComponent,
    '/admin': AdminDashboardComponent,
    '/admin/users': AdminUsersComponent,
    '/admin/tasks': AdminTasksComponent
};

// 当前应用实例和组件
let currentApp = null;
let navbar = null;

// 路由处理函数 - 确保为全局函数
window.handleRoute = function() {
    const hash = window.location.hash || '#/';
    const path = hash.slice(1); // 移除 '#' 符号

    console.log('处理路由:', path);

    // 检查用户权限
    const user = utils.getCurrentUser();
    console.log('handleRoute获取到的用户:', user);
    
    const isAdmin = utils.isAdmin(user);
    console.log('handleRoute中isAdmin判断:', isAdmin, {
        byRole: user?.role === 'admin',
        byRoleNum: user?.role === 1,
        byRoleId: user?.role_id === 1,
        role: user?.role,
        role_id: user?.role_id
    });

    // 如果是管理员路径，检查权限
    if (path.startsWith('/admin')) {
        if (!isAdmin) {
            console.warn('非管理员尝试访问管理路径');
            alert('您没有权限访问管理员界面');
            window.location.hash = '#/dashboard';
            return;
        } else {
            console.log('管理员成功访问管理路径');
        }
    }

    // 查找匹配的路由
    let matchedComponent = null;
    let params = {};

    // 尝试精确匹配
    if (routes[path]) {
        matchedComponent = routes[path];
    } else {
        // 尝试参数路由匹配
        for (const routePath in routes) {
            if (routePath.includes(':')) {
                const routeParts = routePath.split('/');
                const pathParts = path.split('/');
                
                if (routeParts.length === pathParts.length) {
                    let match = true;
                    for (let i = 0; i < routeParts.length; i++) {
                        if (routeParts[i].startsWith(':')) {
                            params[routeParts[i].slice(1)] = pathParts[i];
                        } else if (routeParts[i] !== pathParts[i]) {
                            match = false;
                            break;
                        }
                    }
                    if (match) {
                        matchedComponent = routes[routePath];
                        break;
                    }
                }
            }
        }
    }

    if (matchedComponent) {
        console.log('找到匹配组件，准备挂载');

        // 清理之前的应用实例
        if (currentApp) {
            const appElement = document.querySelector('#app');
            // 卸载之前的应用
            currentApp.unmount();
            // 重新创建挂载点
            appElement.innerHTML = '';
        }
        
        // 创建新的应用实例
        const app = createApp(matchedComponent);
        app.config.globalProperties.$route = { params };
        app.config.globalProperties.$utils = utils; // 添加工具函数到全局属性
        
        // 挂载新应用
        currentApp = app;
        currentApp.mount('#app');
        
        console.log('组件挂载完成');
        
        // 更新导航栏
        if (navbar) {
            navbar.$forceUpdate(); // 强制更新导航栏
        }
    } else {
        console.warn('未找到匹配的路由:', path);
        window.location.hash = '#/';
    }
};

// 监听路由变化
window.addEventListener('hashchange', window.handleRoute);
window.addEventListener('load', window.handleRoute);

// 初始化导航栏
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM加载完成，初始化导航栏');
    const navApp = createApp(Navbar);
    navApp.config.globalProperties.$utils = utils; // 添加工具函数到全局属性
    navbar = navApp.mount('#navbar');
    
    // 初始导航之后加载路由
    window.handleRoute();
});