const Navbar = {
    template: `
        <nav class="navbar navbar-expand-lg navbar-dark navbar-custom">
            <div class="container">
                <a class="navbar-brand" href="#/">任务管理系统</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item" v-if="isAuthenticated">
                            <a class="nav-link" :class="{ active: currentPath === '/dashboard' }" href="#/dashboard" @click="updateCurrentPath('/dashboard')">仪表盘</a>
                        </li>
                        <li class="nav-item" v-if="isAuthenticated">
                            <a class="nav-link" :class="{ active: currentPath === '/tasks' }" href="#/tasks" @click="updateCurrentPath('/tasks')">任务列表</a>
                        </li>
                        <li class="nav-item" v-if="isAdmin">
                            <a class="nav-link" :class="{ active: currentPath.startsWith('/admin') }" href="#/admin" @click="updateCurrentPath('/admin')">管理后台</a>
                        </li>
                    </ul>
                    <ul class="navbar-nav">
                        <li class="nav-item dropdown" v-if="isAuthenticated">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                                {{ username }}
                                <span v-if="isAdmin" class="badge bg-danger ms-1">管理员</span>
                                <span v-else-if="isManager" class="badge bg-info ms-1">项目经理</span>
                            </a>
                            <div class="dropdown-menu dropdown-menu-end">
                                <a class="dropdown-item" href="#/profile" @click="updateCurrentPath('/profile')">个人信息</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="#" @click.prevent="logout">退出登录</a>
                            </div>
                        </li>
                        <li class="nav-item" v-else>
                            <a class="nav-link" href="#/login" @click="updateCurrentPath('/login')">登录</a>
                        </li>
                        <li class="nav-item" v-if="!isAuthenticated">
                            <a class="nav-link" href="#/register" @click="updateCurrentPath('/register')">注册</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    `,
    
    data() {
        return {
            currentPath: window.location.hash.slice(1) || '/',
            user: null
        }
    },
    
    computed: {
        isAuthenticated() {
            return !!localStorage.getItem('token');
        },
        isAdmin() {
            const user = this.$utils.getCurrentUser();
            console.log('Current user:', user);
            const isAdmin = this.$utils.isAdmin(user);
            console.log('Is admin:', isAdmin);
            return isAdmin;
        },
        isManager() {
            const user = this.$utils.getCurrentUser();
            console.log('Current user:', user);
            const isManager = this.$utils.isManager(user);
            console.log('Is manager:', isManager);
            return isManager;
        },
        username() {
            const user = this.$utils.getCurrentUser();
            return user ? user.username : '未知用户';
        }
    },
    
    mounted() {
        this.checkAuth();
        window.addEventListener('hashchange', this.onHashChange);
        console.log('Navbar mounted, current user:', this.$utils.getCurrentUser());
    },

    unmounted() {
        window.removeEventListener('hashchange', this.onHashChange);
    },
    
    methods: {
        checkAuth() {
            const token = localStorage.getItem('token');
            if (!token) {
                if (!window.location.hash.includes('/login')) {
                    window.location.hash = '#/login';
                }
            }
        },
        
        logout() {
            auth.logout();
        },

        updateCurrentPath(path) {
            this.currentPath = path;
            console.log('Updating path to:', path);
            console.log('Current user:', this.$utils.getCurrentUser());
            console.log('Is admin:', this.isAdmin);
            
            setTimeout(() => {
                if (typeof handleRoute === 'function') {
                    handleRoute();
                }
            }, 10);
        },

        onHashChange() {
            this.currentPath = window.location.hash.slice(1) || '/';
        }
    }
}; 