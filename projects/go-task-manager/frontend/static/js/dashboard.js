// 仪表盘组件
const DashboardComponent = {
    template: `
        <div class="container mt-4">
            <div class="row">
                <div class="col-md-12 mb-4">
                    <h2><i class="fas fa-tachometer-alt"></i> 仪表盘</h2>
                </div>
            </div>
            <div class="row">
                <!-- 任务统计卡片 -->
                <div class="col-md-3 mb-4">
                    <div class="card bg-primary text-white">
                        <div class="card-body">
                            <h5 class="card-title">
                                <i class="fas fa-tasks"></i> 总任务数
                            </h5>
                            <h2 class="card-text">{{ stats.total }}</h2>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-4">
                    <div class="card bg-warning text-white">
                        <div class="card-body">
                            <h5 class="card-title">
                                <i class="fas fa-clock"></i> 进行中
                            </h5>
                            <h2 class="card-text">{{ stats.inProgress }}</h2>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-4">
                    <div class="card bg-success text-white">
                        <div class="card-body">
                            <h5 class="card-title">
                                <i class="fas fa-check-circle"></i> 已完成
                            </h5>
                            <h2 class="card-text">{{ stats.completed }}</h2>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-4">
                    <div class="card bg-danger text-white">
                        <div class="card-body">
                            <h5 class="card-title">
                                <i class="fas fa-exclamation-circle"></i> 待处理
                            </h5>
                            <h2 class="card-text">{{ stats.pending }}</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <!-- 最近任务列表 -->
                <div class="col-md-8 mb-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0"><i class="fas fa-list"></i> 最近任务</h5>
                        </div>
                        <div class="card-body">
                            <div v-if="recentTasks.length === 0" class="text-center py-3">
                                暂无任务
                            </div>
                            <ul v-else class="list-group list-group-flush">
                                <li v-for="task in recentTasks" :key="task.id" class="list-group-item">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 class="mb-1">{{ task.title }}</h6>
                                            <small class="text-muted">
                                                <i class="fas fa-calendar"></i> {{ formatDate(task.created_at) }}
                                            </small>
                                        </div>
                                        <div>
                                            <span :class="getStatusBadgeClass(task.status)" class="badge">
                                                {{ task.status }}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- 任务优先级分布 -->
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0"><i class="fas fa-chart-pie"></i> 优先级分布</h5>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <div class="d-flex justify-content-between mb-1">
                                    <span>高优先级</span>
                                    <span class="text-danger">{{ stats.highPriority }}</span>
                                </div>
                                <div class="progress">
                                    <div class="progress-bar bg-danger" :style="{ width: getPriorityPercentage('high') + '%' }"></div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="d-flex justify-content-between mb-1">
                                    <span>中优先级</span>
                                    <span class="text-warning">{{ stats.mediumPriority }}</span>
                                </div>
                                <div class="progress">
                                    <div class="progress-bar bg-warning" :style="{ width: getPriorityPercentage('medium') + '%' }"></div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="d-flex justify-content-between mb-1">
                                    <span>低优先级</span>
                                    <span class="text-success">{{ stats.lowPriority }}</span>
                                </div>
                                <div class="progress">
                                    <div class="progress-bar bg-success" :style="{ width: getPriorityPercentage('low') + '%' }"></div>
                                </div>
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
                total: 0,
                inProgress: 0,
                completed: 0,
                pending: 0,
                highPriority: 0,
                mediumPriority: 0,
                lowPriority: 0
            },
            recentTasks: [],
            refreshInterval: null
        }
    },
    mounted() {
        this.loadDashboardData();
        // 设置30秒自动刷新
        this.refreshInterval = setInterval(() => {
            this.loadDashboardData();
        }, 30000);
        
        // 监听任务更新事件
        window.addEventListener('taskUpdated', this.handleTaskUpdate);
    },
    beforeUnmount() {
        // 清理定时器和事件监听
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        window.removeEventListener('taskUpdated', this.handleTaskUpdate);
    },
    methods: {
        async loadDashboardData() {
            try {
                const response = await api.tasks.list();
                const tasks = response.data;
                
                // 计算统计数据
                this.stats.total = tasks.length;
                this.stats.inProgress = tasks.filter(t => {
                    return typeof t.status === 'number' ? t.status === 2 : t.status === 'in_progress'
                }).length;
                this.stats.completed = tasks.filter(t => {
                    return typeof t.status === 'number' ? t.status === 3 : t.status === 'completed'
                }).length;
                this.stats.pending = tasks.filter(t => {
                    return typeof t.status === 'number' ? t.status === 1 : t.status === 'pending'
                }).length;
                
                this.stats.highPriority = tasks.filter(t => {
                    return typeof t.priority === 'number' ? t.priority === 3 : t.priority === 'high'
                }).length;
                this.stats.mediumPriority = tasks.filter(t => {
                    return typeof t.priority === 'number' ? t.priority === 2 : t.priority === 'medium'
                }).length;
                this.stats.lowPriority = tasks.filter(t => {
                    return typeof t.priority === 'number' ? t.priority === 1 : t.priority === 'low'
                }).length;

                // 获取最近的5个任务
                this.recentTasks = tasks
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 5);
            } catch (error) {
                console.error('加载仪表盘数据失败:', error);
            }
        },
        handleTaskUpdate() {
            // 任务更新时刷新数据
            this.loadDashboardData();
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        getStatusBadgeClass(status) {
            const classes = {
                'pending': 'bg-secondary',
                'in_progress': 'bg-warning',
                'completed': 'bg-success'
            };
            return classes[status] || 'bg-secondary';
        },
        getPriorityPercentage(priority) {
            const total = this.stats.highPriority + this.stats.mediumPriority + this.stats.lowPriority;
            if (total === 0) return 0;
            
            switch (priority) {
                case 'high':
                    return (this.stats.highPriority / total) * 100;
                case 'medium':
                    return (this.stats.mediumPriority / total) * 100;
                case 'low':
                    return (this.stats.lowPriority / total) * 100;
                default:
                    return 0;
            }
        }
    }
};