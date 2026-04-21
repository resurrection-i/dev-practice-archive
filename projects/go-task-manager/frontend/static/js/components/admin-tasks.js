// 任务管理组件
const AdminTasksComponent = {
    template: `
        <div class="container mt-4">
            <!-- 页面标题 -->
            <div class="row mb-4">
                <div class="col-md-8">
                    <div class="d-flex align-items-center">
                        <div class="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                            <i class="fas fa-tasks fa-2x text-primary"></i>
                        </div>
                        <div>
                            <h2 class="mb-1">任务管理</h2>
                            <p class="text-muted mb-0">管理和监控所有任务</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 text-end">
                    <a href="#/admin" class="btn btn-outline-secondary me-2">
                        <i class="fas fa-arrow-left me-2"></i>返回
                    </a>
                    <a href="#/create-task" class="btn btn-primary">
                        <i class="fas fa-plus me-2"></i>创建任务
                    </a>
                </div>
            </div>

            <!-- 过滤和搜索 -->
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label class="form-label text-muted small">任务状态</label>
                            <select class="form-select" v-model="filters.status">
                                <option value="">所有状态</option>
                                <option value="1">待处理</option>
                                <option value="2">进行中</option>
                                <option value="3">已完成</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label text-muted small">优先级</label>
                            <select class="form-select" v-model="filters.priority">
                                <option value="">所有优先级</option>
                                <option value="1">低</option>
                                <option value="2">中</option>
                                <option value="3">高</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted small">搜索任务</label>
                            <div class="input-group">
                                <span class="input-group-text bg-white border-end-0">
                                    <i class="fas fa-search text-muted"></i>
                                </span>
                                <input type="text" class="form-control border-start-0" v-model="filters.search" placeholder="输入关键词搜索...">
                                <button class="btn btn-outline-secondary" type="button" @click="resetFilters">
                                    <i class="fas fa-sync-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 任务列表 -->
            <div class="card border-0 shadow-sm">
                <div class="card-body p-0">
                    <div v-if="loading" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">加载中...</span>
                        </div>
                        <p class="mt-3 text-muted">加载任务数据中...</p>
                    </div>
                    <div v-else-if="filteredTasks.length === 0" class="text-center py-5">
                        <div class="text-muted">
                            <i class="fas fa-inbox fa-3x mb-3"></i>
                            <p>暂无任务数据</p>
                        </div>
                    </div>
                    <div v-else>
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="bg-light">
                                    <tr>
                                        <th>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" v-model="selectAll" @change="toggleSelectAll">
                                            </div>
                                        </th>
                                        <th @click="sort('title')" style="cursor: pointer">
                                            标题 <i class="fas" :class="getSortIcon('title')"></i>
                                        </th>
                                        <th @click="sort('priority')" style="cursor: pointer">
                                            优先级 <i class="fas" :class="getSortIcon('priority')"></i>
                                        </th>
                                        <th @click="sort('status')" style="cursor: pointer">
                                            状态 <i class="fas" :class="getSortIcon('status')"></i>
                                        </th>
                                        <th @click="sort('due_date')" style="cursor: pointer">
                                            截止日期 <i class="fas" :class="getSortIcon('due_date')"></i>
                                        </th>
                                        <th @click="sort('created_at')" style="cursor: pointer">
                                            创建日期 <i class="fas" :class="getSortIcon('created_at')"></i>
                                        </th>
                                        <th>指派给</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="task in paginatedTasks" :key="task.id">
                                        <td>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" v-model="selectedTasks" :value="task.id">
                                            </div>
                                        </td>
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <div class="rounded-circle bg-light p-2 me-2">
                                                    <i class="fas fa-tasks text-primary"></i>
                                                </div>
                                                {{ task.title }}
                                            </div>
                                        </td>
                                        <td>
                                            <span :class="getPriorityBadgeClass(task.priority)" class="badge">
                                                {{ getPriorityText(task.priority) }}
                                            </span>
                                        </td>
                                        <td>
                                            <span :class="getStatusBadgeClass(task.status)" class="badge">
                                                {{ getStatusText(task.status) }}
                                            </span>
                                        </td>
                                        <td>{{ formatDate(task.due_date) }}</td>
                                        <td>{{ formatDate(task.created_at) }}</td>
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <div class="rounded-circle bg-light p-2 me-2">
                                                    <i class="fas fa-user text-primary"></i>
                                                </div>
                                                {{ task.assignee ? task.assignee.username : '未指派' }}
                                            </div>
                                        </td>
                                        <td>
                                            <div class="btn-group">
                                                <a :href="'#/task/' + task.id" class="btn btn-sm btn-outline-primary" title="查看详情">
                                                    <i class="fas fa-eye"></i>
                                                </a>
                                                <button class="btn btn-sm btn-outline-success" @click="updateStatus(task)" title="更新状态">
                                                    <i class="fas fa-check"></i>
                                                </button>
                                                <button class="btn btn-sm btn-outline-danger" @click="deleteTask(task)" title="删除任务">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- 批量操作 -->
                        <div class="p-3 bg-light border-top" v-if="selectedTasks.length > 0">
                            <div class="d-flex align-items-center">
                                <span class="me-3">
                                    <i class="fas fa-check-square text-primary me-2"></i>
                                    已选择 {{ selectedTasks.length }} 项
                                </span>
                                <div class="btn-group">
                                    <button class="btn btn-outline-primary btn-sm" @click="batchAssign">
                                        <i class="fas fa-user-edit me-1"></i>批量指派
                                    </button>
                                    <button class="btn btn-outline-success btn-sm" @click="batchUpdateStatus">
                                        <i class="fas fa-check me-1"></i>批量更新状态
                                    </button>
                                    <button class="btn btn-outline-danger btn-sm" @click="batchDelete">
                                        <i class="fas fa-trash me-1"></i>批量删除
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- 分页 -->
                        <div class="p-3 d-flex justify-content-between align-items-center border-top">
                            <div class="text-muted small">
                                显示 {{ startIndex + 1 }} 到 {{ endIndex }} 条，共 {{ filteredTasks.length }} 条
                            </div>
                            <nav v-if="totalPages > 1">
                                <ul class="pagination pagination-sm mb-0">
                                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                        <a class="page-link" href="#" @click.prevent="currentPage--">
                                            <i class="fas fa-chevron-left"></i>
                                        </a>
                                    </li>
                                    <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
                                        <a class="page-link" href="#" @click.prevent="currentPage = page">{{ page }}</a>
                                    </li>
                                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                        <a class="page-link" href="#" @click.prevent="currentPage++">
                                            <i class="fas fa-chevron-right"></i>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
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
            },
            sortKey: 'created_at',
            sortOrder: 'desc',
            currentPage: 1,
            pageSize: 10,
            selectedTasks: [],
            selectAll: false
        }
    },
    computed: {
        filteredTasks() {
            return this.tasks.filter(task => {
                let matchesStatus = true;
                if (this.filters.status) {
                    // 处理数字和字符串格式
                    const statusFilter = parseInt(this.filters.status);
                    if (typeof task.status === 'number') {
                        matchesStatus = task.status === statusFilter;
                    } else {
                        const statusMap = { '1': 'pending', '2': 'in_progress', '3': 'completed' };
                        matchesStatus = task.status === statusMap[this.filters.status];
                    }
                }
                
                let matchesPriority = true;
                if (this.filters.priority) {
                    // 处理数字和字符串格式
                    const priorityFilter = parseInt(this.filters.priority);
                    if (typeof task.priority === 'number') {
                        matchesPriority = task.priority === priorityFilter;
                    } else {
                        const priorityMap = { '1': 'low', '2': 'medium', '3': 'high' };
                        matchesPriority = task.priority === priorityMap[this.filters.priority];
                    }
                }
                
                const matchesSearch = !this.filters.search || 
                    task.title.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                    (task.description && task.description.toLowerCase().includes(this.filters.search.toLowerCase())) ||
                    (task.assignee && task.assignee.username.toLowerCase().includes(this.filters.search.toLowerCase()));
                
                return matchesStatus && matchesPriority && matchesSearch;
            }).sort((a, b) => {
                const modifier = this.sortOrder === 'asc' ? 1 : -1;
                
                // 特殊处理日期
                if (this.sortKey === 'due_date' || this.sortKey === 'created_at') {
                    const dateA = new Date(a[this.sortKey] || 0);
                    const dateB = new Date(b[this.sortKey] || 0);
                    return (dateA - dateB) * modifier;
                }
                
                // 其他字段
                if (a[this.sortKey] < b[this.sortKey]) return -1 * modifier;
                if (a[this.sortKey] > b[this.sortKey]) return 1 * modifier;
                return 0;
            });
        },
        paginatedTasks() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.filteredTasks.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.filteredTasks.length / this.pageSize);
        },
        startIndex() {
            return (this.currentPage - 1) * this.pageSize;
        },
        endIndex() {
            return Math.min(this.startIndex + this.pageSize, this.filteredTasks.length);
        }
    },
    mounted() {
        this.loadTasks();
    },
    methods: {
        getSortIcon(key) {
            if (this.sortKey === key) {
                return this.sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
            }
            return 'fa-sort';
        },
        async loadTasks() {
            this.loading = true;
            try {
                const response = await api.tasks.list();
                this.tasks = response.data;
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
            this.currentPage = 1;
        },
        sort(key) {
            if (this.sortKey === key) {
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortKey = key;
                this.sortOrder = 'asc';
            }
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
        async deleteTask(task) {
            if (!confirm(`确定要删除任务"${task.title}"吗？`)) return;
            
            try {
                await api.tasks.delete(task.id);
                this.tasks = this.tasks.filter(t => t.id !== task.id);
            } catch (error) {
                console.error('删除任务失败:', error);
                alert('删除任务失败，请重试');
            }
        },
        toggleSelectAll() {
            if (this.selectAll) {
                this.selectedTasks = this.paginatedTasks.map(task => task.id);
            } else {
                this.selectedTasks = [];
            }
        },
        async batchUpdateStatus() {
            if (this.selectedTasks.length === 0) return;
            
            const statusOptions = [
                { value: 1, text: '待处理' },
                { value: 2, text: '进行中' },
                { value: 3, text: '已完成' }
            ];
            
            const status = prompt(`为选中的 ${this.selectedTasks.length} 个任务设置状态：\n1 - 待处理\n2 - 进行中\n3 - 已完成\n\n请输入数字：`);
            
            if (!status || !['1', '2', '3'].includes(status)) {
                alert('无效的状态值');
                return;
            }
            
            const statusValue = parseInt(status);
            
            try {
                for (const taskId of this.selectedTasks) {
                    await api.tasks.updateStatus(taskId, statusValue);
                    
                    // 更新本地数据
                    const task = this.tasks.find(t => t.id === taskId);
                    if (task) task.status = statusValue;
                }
                
                alert(`成功更新 ${this.selectedTasks.length} 个任务的状态`);
                this.selectedTasks = [];
                this.selectAll = false;
            } catch (error) {
                console.error('批量更新状态失败:', error);
                alert('批量更新状态失败，请重试');
            }
        },
        async batchDelete() {
            if (this.selectedTasks.length === 0) return;
            
            if (!confirm(`确定要删除选中的 ${this.selectedTasks.length} 个任务吗？`)) return;
            
            try {
                for (const taskId of this.selectedTasks) {
                    await api.tasks.delete(taskId);
                }
                
                // 更新本地数据
                this.tasks = this.tasks.filter(task => !this.selectedTasks.includes(task.id));
                this.selectedTasks = [];
                this.selectAll = false;
                
                alert(`成功删除 ${this.selectedTasks.length} 个任务`);
            } catch (error) {
                console.error('批量删除失败:', error);
                alert('批量删除失败，请重试');
            }
        },
        async batchAssign() {
            if (this.selectedTasks.length === 0) return;
            
            try {
                // 获取用户列表
                const response = await api.users.list();
                const users = response.data;
                
                let userOptions = '';
                users.forEach(user => {
                    userOptions += `${user.id} - ${user.username}\n`;
                });
                
                const assigneeId = prompt(`为选中的 ${this.selectedTasks.length} 个任务指派用户：\n${userOptions}\n请输入用户ID：`);
                
                if (!assigneeId) {
                    alert('操作已取消');
                    return;
                }
                
                const userId = parseInt(assigneeId);
                const user = users.find(u => u.id === userId);
                
                if (!user) {
                    alert('无效的用户ID');
                    return;
                }
                
                for (const taskId of this.selectedTasks) {
                    await api.tasks.assign(taskId, userId);
                    
                    // 更新本地数据
                    const task = this.tasks.find(t => t.id === taskId);
                    if (task) {
                        task.assignee_id = userId;
                        task.assignee = {
                            id: user.id,
                            username: user.username
                        };
                    }
                }
                
                alert(`成功为 ${this.selectedTasks.length} 个任务指派给用户 ${user.username}`);
                this.selectedTasks = [];
                this.selectAll = false;
            } catch (error) {
                console.error('批量指派失败:', error);
                alert('批量指派失败，请重试');
            }
        },
        formatDate(dateString) {
            if (!dateString) return '无日期';
            const date = new Date(dateString);
            return date.toLocaleDateString('zh-CN');
        },
        getPriorityBadgeClass(priority) {
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
        getStatusBadgeClass(status) {
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