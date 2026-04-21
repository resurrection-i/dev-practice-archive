// 任务列表组件
const TaskListComponent = {
    template: `
        <div class="container mt-4">
            <div class="row mb-4">
                <div class="col">
                    <h2><i class="fas fa-tasks"></i> 任务列表</h2>
                </div>
                <div class="col-auto">
                    <a href="#/dashboard" class="btn btn-outline-secondary me-2">
                        <i class="fas fa-arrow-left"></i> 返回
                    </a>
                    <button class="btn btn-primary" @click="createTask">
                        <i class="fas fa-plus"></i> 创建任务
                    </button>
                </div>
            </div>

            <!-- 筛选器 -->
            <div class="row mb-4">
                <div class="col-md-3">
                    <select class="form-select" v-model="filters.status">
                        <option value="">所有状态</option>
                        <option value="1">待处理</option>
                        <option value="2">进行中</option>
                        <option value="3">已完成</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <select class="form-select" v-model="filters.priority">
                        <option value="">所有优先级</option>
                        <option value="1">低优先级</option>
                        <option value="2">中优先级</option>
                        <option value="3">高优先级</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <input type="text" class="form-control" v-model="filters.search" placeholder="搜索任务...">
                </div>
                <div class="col-md-2">
                    <button class="btn btn-secondary w-100" @click="resetFilters">
                        <i class="fas fa-undo"></i> 重置
                    </button>
                </div>
            </div>

            <!-- 任务列表 -->
            <div class="card">
                <div class="card-body p-0">
                    <div v-if="loading" class="text-center p-4">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">加载中...</span>
                        </div>
                    </div>
                    <div v-else-if="filteredTasks.length === 0" class="text-center p-4">
                        暂无任务
                    </div>
                    <table v-else class="table table-hover mb-0">
                        <thead>
                            <tr>
                                <th>标题</th>
                                <th>优先级</th>
                                <th>状态</th>
                                <th>截止日期</th>
                                <th>创建者</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="task in filteredTasks" :key="task.id">
                                <td>{{ task.title }}</td>
                                <td>
                                    <span class="badge" :class="getPriorityClass(task.priority)">
                                        {{ getPriorityText(task.priority) }}
                                    </span>
                                </td>
                                <td>
                                    <span class="badge" :class="getStatusClass(task.status)">
                                        {{ getStatusText(task.status) }}
                                    </span>
                                </td>
                                <td>{{ formatDate(task.due_date) }}</td>
                                <td>{{ task.creator?.username || '未知' }}</td>
                                <td>
                                    <div class="btn-group">
                                        <button class="btn btn-sm btn-outline-primary" @click="viewTask(task)">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-success" @click="updateStatus(task)">
                                            <i class="fas fa-sync-alt"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            tasks: [],
            loading: true,
            filters: {
                status: '',
                priority: '',
                search: ''
            }
        }
    },
    computed: {
        filteredTasks() {
            return this.tasks.filter(task => {
                // 状态筛选
                if (this.filters.status && String(task.status) !== this.filters.status) {
                    return false;
                }
                
                // 优先级筛选
                if (this.filters.priority && String(task.priority) !== this.filters.priority) {
                    return false;
                }
                
                // 搜索筛选
                if (this.filters.search) {
                    const searchTerm = this.filters.search.toLowerCase();
                    return task.title.toLowerCase().includes(searchTerm) ||
                           task.description?.toLowerCase().includes(searchTerm);
                }
                
                return true;
            });
        }
    },
    mounted() {
        this.loadTasks();
    },
    methods: {
        async loadTasks() {
            this.loading = true;
            try {
                const response = await api.tasks.list();
                const currentUser = utils.getCurrentUser();
                
                // 根据用户角色过滤任务
                if (utils.isAdmin(currentUser) || utils.isManager(currentUser)) {
                    // 管理员和项目经理可以看到所有任务
                    this.tasks = response.data;
                } else {
                    // 普通用户只能看到分配给自己的任务
                    this.tasks = response.data.filter(task => 
                        task.assignee_id === currentUser.id || 
                        task.creator_id === currentUser.id
                    );
                }
            } catch (error) {
                console.error('加载任务列表失败:', error);
                alert('加载任务列表失败，请重试');
            } finally {
                this.loading = false;
            }
        },
        resetFilters() {
            this.filters = {
                status: '',
                priority: '',
                search: ''
            };
        },
        createTask() {
            window.location.hash = '#/create-task';
        },
        viewTask(task) {
            window.location.hash = `#/task/${task.id}`;
        },
        async updateStatus(task) {
            let newStatus;
            if (typeof task.status === 'number') {
                newStatus = task.status === 3 ? 1 : task.status + 1;
            } else {
                switch (task.status) {
                    case 'completed': newStatus = 1; break;
                    case 'pending': newStatus = 2; break;
                    case 'in_progress': newStatus = 3; break;
                    default: newStatus = 1;
                }
            }
            
            try {
                await api.tasks.updateStatus(task.id, newStatus);
                task.status = newStatus;
                // 触发任务更新事件
                window.dispatchEvent(new CustomEvent('taskUpdated', {
                    detail: { taskId: task.id, newStatus }
                }));
            } catch (error) {
                console.error('更新任务状态失败:', error);
                alert('更新任务状态失败，请重试');
            }
        },
        getPriorityClass(priority) {
            // 处理数字优先级
            if (typeof priority === 'number') {
                switch(priority) {
                    case 1: return 'bg-success';   // 低优先级
                    case 2: return 'bg-warning';   // 中优先级
                    case 3: return 'bg-danger';    // 高优先级
                    default: return 'bg-secondary';
                }
            }
            
            // 处理字符串优先级
            switch(priority) {
                case 'low': return 'bg-success';
                case 'medium': return 'bg-warning';
                case 'high': return 'bg-danger';
                default: return 'bg-secondary';
            }
        },
        getPriorityText(priority) {
            // 处理数字优先级
            if (typeof priority === 'number') {
                switch(priority) {
                    case 1: return '低';
                    case 2: return '中';
                    case 3: return '高';
                    default: return '未知';
                }
            }
            
            // 处理字符串优先级
            switch(priority) {
                case 'low': return '低';
                case 'medium': return '中';
                case 'high': return '高';
                default: return priority || '未知';
            }
        },
        getStatusClass(status) {
            // 处理数字状态
            if (typeof status === 'number') {
                switch(status) {
                    case 1: return 'bg-warning';   // 待处理
                    case 2: return 'bg-primary';   // 进行中
                    case 3: return 'bg-success';   // 已完成
                    default: return 'bg-secondary';
                }
            }
            
            // 处理字符串状态
            switch(status) {
                case 'pending': return 'bg-warning';
                case 'in_progress': return 'bg-primary';
                case 'completed': return 'bg-success';
                default: return 'bg-secondary';
            }
        },
        getStatusText(status) {
            // 处理数字状态
            if (typeof status === 'number') {
                switch(status) {
                    case 1: return '待处理';
                    case 2: return '进行中';
                    case 3: return '已完成';
                    default: return '未知';
                }
            }
            
            // 处理字符串状态
            switch(status) {
                case 'pending': return '待处理';
                case 'in_progress': return '进行中';
                case 'completed': return '已完成';
                default: return status || '未知';
            }
        },
        formatDate(dateString) {
            if (!dateString) return '无截止日期';
            const date = new Date(dateString);
            return date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
};