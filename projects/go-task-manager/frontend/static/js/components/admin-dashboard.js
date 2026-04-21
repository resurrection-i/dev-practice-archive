// 管理员仪表盘组件
const AdminDashboardComponent = {
    template: `
        <div class="container mt-4">
            <!-- 欢迎消息 -->
            <div class="row mb-4">
                <div class="col">
                    <div class="alert alert-info border-0 shadow-sm">
                        <div class="d-flex align-items-center">
                            <i class="fas fa-info-circle fa-2x me-3"></i>
                            <div>
                                <h4 class="alert-heading mb-1">欢迎使用管理控制台</h4>
                                <p class="mb-0">您可以在这里管理系统的用户和任务。</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 统计卡片 -->
            <div class="row mb-4">
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm bg-primary text-white h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="card-subtitle mb-2 text-white-50">用户总数</h6>
                                    <h2 class="card-title mb-0 display-4">{{ stats.userCount }}</h2>
                                </div>
                                <div class="rounded-circle bg-white bg-opacity-25 p-3">
                                    <i class="fas fa-users fa-2x text-white"></i>
                                </div>
                            </div>
                            <a href="#/admin/users" class="btn btn-light btn-sm mt-3">
                                <i class="fas fa-arrow-right"></i> 管理用户
                            </a>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm bg-success text-white h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="card-subtitle mb-2 text-white-50">任务总数</h6>
                                    <h2 class="card-title mb-0 display-4">{{ stats.taskCount }}</h2>
                                </div>
                                <div class="rounded-circle bg-white bg-opacity-25 p-3">
                                    <i class="fas fa-tasks fa-2x text-white"></i>
                                </div>
                            </div>
                            <a href="#/admin/tasks" class="btn btn-light btn-sm mt-3">
                                <i class="fas fa-arrow-right"></i> 管理任务
                            </a>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm bg-warning text-white h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="card-subtitle mb-2 text-white-50">待处理任务</h6>
                                    <h2 class="card-title mb-0 display-4">{{ stats.pendingTasks }}</h2>
                                </div>
                                <div class="rounded-circle bg-white bg-opacity-25 p-3">
                                    <i class="fas fa-clock fa-2x text-white"></i>
                                </div>
                            </div>
                            <a href="#/admin/tasks" class="btn btn-light btn-sm mt-3">
                                <i class="fas fa-arrow-right"></i> 查看待处理
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <!-- 最近用户 -->
                <div class="col-md-6 mb-4">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-0">
                            <div class="d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">
                                    <i class="fas fa-user-circle text-primary me-2"></i>最近用户
                                </h5>
                                <a href="#/admin/users" class="btn btn-primary btn-sm">
                                    查看全部
                                </a>
                            </div>
                        </div>
                        <div class="card-body p-0">
                            <div v-if="loading.users" class="text-center p-4">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">加载中...</span>
                                </div>
                            </div>
                            <div v-else-if="error.users" class="alert alert-danger m-3">
                                {{ error.users }}
                            </div>
                            <div v-else-if="recentUsers.length === 0" class="alert alert-info m-3">
                                暂无用户数据
                            </div>
                            <div v-else class="table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                    <thead class="bg-light">
                                        <tr>
                                            <th>用户名</th>
                                            <th>邮箱</th>
                                            <th>角色</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="user in recentUsers" :key="user.id">
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <div class="rounded-circle bg-light p-2 me-2">
                                                        <i class="fas fa-user text-primary"></i>
                                                    </div>
                                                    {{ user.username }}
                                                </div>
                                            </td>
                                            <td>
                                                <i class="fas fa-envelope text-muted me-1"></i>
                                                {{ user.email }}
                                            </td>
                                            <td>
                                                <span class="badge" :class="getRoleBadgeClass(user.role)">
                                                    {{ getRoleText(user.role) }}
                                                </span>
                                            </td>
                                            <td>
                                                <a :href="'#/admin/users/' + user.id" class="btn btn-sm btn-outline-primary">
                                                    <i class="fas fa-edit"></i>
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 最近任务 -->
                <div class="col-md-6 mb-4">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-0">
                            <div class="d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">
                                    <i class="fas fa-clipboard-list text-primary me-2"></i>最近任务
                                </h5>
                                <a href="#/admin/tasks" class="btn btn-primary btn-sm">
                                    查看全部
                                </a>
                            </div>
                        </div>
                        <div class="card-body p-0">
                            <div v-if="loading.tasks" class="text-center p-4">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">加载中...</span>
                                </div>
                            </div>
                            <div v-else-if="error.tasks" class="alert alert-danger m-3">
                                {{ error.tasks }}
                            </div>
                            <div v-else-if="recentTasks.length === 0" class="alert alert-info m-3">
                                暂无任务数据
                            </div>
                            <div v-else class="table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                    <thead class="bg-light">
                                        <tr>
                                            <th>标题</th>
                                            <th>状态</th>
                                            <th>创建者</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="task in recentTasks" :key="task.id">
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <div class="rounded-circle bg-light p-2 me-2">
                                                        <i class="fas fa-tasks text-primary"></i>
                                                    </div>
                                                    {{ task.title }}
                                                </div>
                                            </td>
                                            <td>
                                                <span class="badge" :class="getStatusClass(task.status)">
                                                    {{ getStatusText(task.status) }}
                                                </span>
                                            </td>
                                            <td>
                                                <i class="fas fa-user text-muted me-1"></i>
                                                {{ task.creator?.username || '未知' }}
                                            </td>
                                            <td>
                                                <a :href="'#/admin/tasks/' + task.id" class="btn btn-sm btn-outline-primary">
                                                    <i class="fas fa-edit"></i>
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    
    data() {
        return {
            stats: {
                userCount: 0,
                taskCount: 0,
                pendingTasks: 0
            },
            recentUsers: [],
            recentTasks: [],
            loading: {
                users: true,
                tasks: true
            },
            error: {
                users: null,
                tasks: null
            },
            refreshInterval: null
        }
    },
    
    computed: {
        isAdmin() {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    return user && (user.role === 'admin' || user.role === 3);
                } catch (e) {
                    console.error('解析用户数据失败', e);
                }
            }
            return false;
        }
    },
    
    mounted() {
        if (this.isAdmin) {
            this.loadStats();
            this.loadRecentUsers();
            this.loadRecentTasks();
            
            // 设置30秒自动刷新
            this.refreshInterval = setInterval(() => {
                this.loadStats();
                this.loadRecentUsers();
                this.loadRecentTasks();
            }, 30000);
        } else {
            window.location.hash = '#/dashboard';
        }
    },
    
    beforeUnmount() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    },
    
    methods: {
        async loadStats() {
            try {
                // 加载用户总数
                const usersResponse = await api.users.list();
                this.stats.userCount = usersResponse.data.length;
                
                // 加载任务总数和待处理任务
                const tasksResponse = await api.tasks.list();
                this.stats.taskCount = tasksResponse.data.length;
                this.stats.pendingTasks = tasksResponse.data.filter(task => {
                    return typeof task.status === 'number' ? task.status === 1 : task.status === 'pending';
                }).length;
            } catch (error) {
                console.error("加载统计数据失败:", error);
            }
        },
        
        async loadRecentUsers() {
            this.loading.users = true;
            try {
                const response = await api.users.list();
                // 取最近5个用户
                this.recentUsers = response.data.slice(0, 5);
                this.error.users = null;
            } catch (error) {
                console.error("加载用户数据失败:", error);
                this.error.users = "加载用户数据失败: " + (error.response?.data?.error || error.message);
            } finally {
                this.loading.users = false;
            }
        },
        
        async loadRecentTasks() {
            this.loading.tasks = true;
            try {
                const response = await api.tasks.list();
                // 取最近5个任务，按创建时间倒序
                this.recentTasks = response.data
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 5);
                this.error.tasks = null;
            } catch (error) {
                console.error("加载任务数据失败:", error);
                this.error.tasks = "加载任务数据失败: " + (error.response?.data?.error || error.message);
            } finally {
                this.loading.tasks = false;
            }
        },
        
        getRoleBadgeClass(role) {
            if (typeof role === 'number') {
                switch(role) {
                    case 1: return 'bg-danger';     // 管理员
                    case 2: return 'bg-info';       // 项目经理
                    case 3: return 'bg-secondary';  // 普通用户
                    default: return 'bg-secondary';
                }
            }
            
            switch(role) {
                case 'user': return 'bg-secondary';
                case 'admin': return 'bg-danger';
                case 'manager': return 'bg-info';
                default: return 'bg-secondary';
            }
        },
        
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
        },
        
        getStatusClass(status) {
            if (typeof status === 'number') {
                switch(status) {
                    case 1: return 'bg-warning';   // 待处理
                    case 2: return 'bg-primary';   // 进行中
                    case 3: return 'bg-success';   // 已完成
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
        
        getStatusText(status) {
            if (typeof status === 'number') {
                switch(status) {
                    case 1: return '待处理';
                    case 2: return '进行中';
                    case 3: return '已完成';
                    default: return '未知';
                }
            }
            
            switch(status) {
                case 'pending': return '待处理';
                case 'in_progress': return '进行中';
                case 'completed': return '已完成';
                default: return status || '未知';
            }
        }
    }
}; 