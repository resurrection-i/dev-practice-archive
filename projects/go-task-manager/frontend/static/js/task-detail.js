// 任务详情组件
const TaskDetailComponent = {
    template: `
        <div class="container mt-4">
            <div class="row">
                <div class="col-md-8 offset-md-2">
                    <div class="card">
                        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <h4 class="mb-0">
                                <i class="fas fa-tasks"></i> 任务详情
                            </h4>
                            <div>
                                <button class="btn btn-light btn-sm me-2" @click="goBack">
                                    <i class="fas fa-arrow-left"></i> 返回
                                </button>
                                <button class="btn btn-light btn-sm" @click="toggleEdit" v-if="!isEditing">
                                    <i class="fas fa-edit"></i> 编辑
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div v-if="loading" class="text-center py-5">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">加载中...</span>
                                </div>
                                <p class="mt-3">加载中...</p>
                            </div>
                            <div v-else>
                                <!-- 查看模式 -->
                                <div v-if="!isEditing">
                                    <div class="row mb-4">
                                        <div class="col-md-3">
                                            <strong>任务标题：</strong>
                                        </div>
                                        <div class="col-md-9">
                                            {{ task.title }}
                                        </div>
                                    </div>
                                    <div class="row mb-4">
                                        <div class="col-md-3">
                                            <strong>任务描述：</strong>
                                        </div>
                                        <div class="col-md-9">
                                            {{ task.description }}
                                        </div>
                                    </div>
                                    <div class="row mb-4">
                                        <div class="col-md-3">
                                            <strong>优先级：</strong>
                                        </div>
                                        <div class="col-md-9">
                                            <span :class="getPriorityBadgeClass(task.priority)" class="badge">
                                                {{ getPriorityText(task.priority) }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="row mb-4">
                                        <div class="col-md-3">
                                            <strong>状态：</strong>
                                        </div>
                                        <div class="col-md-9">
                                            <span :class="getStatusBadgeClass(task.status)" class="badge">
                                                {{ getStatusText(task.status) }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="row mb-4">
                                        <div class="col-md-3">
                                            <strong>指派给：</strong>
                                        </div>
                                        <div class="col-md-9">
                                            {{ task.assignee ? task.assignee.username : '未指派' }}
                                        </div>
                                    </div>
                                    <div class="row mb-4">
                                        <div class="col-md-3">
                                            <strong>截止日期：</strong>
                                        </div>
                                        <div class="col-md-9">
                                            {{ formatDate(task.due_date) }}
                                        </div>
                                    </div>
                                    <div class="row mb-4">
                                        <div class="col-md-3">
                                            <strong>创建时间：</strong>
                                        </div>
                                        <div class="col-md-9">
                                            {{ formatDate(task.created_at) }}
                                        </div>
                                    </div>
                                    <div class="row mb-4">
                                        <div class="col-md-3">
                                            <strong>创建者：</strong>
                                        </div>
                                        <div class="col-md-9">
                                            {{ task.creator ? task.creator.username : '未知' }}
                                        </div>
                                    </div>
                                </div>

                                <!-- 编辑模式 -->
                                <form v-else @submit.prevent="saveTask">
                                    <div class="mb-3">
                                        <label class="form-label">任务标题</label>
                                        <input type="text" class="form-control" v-model="editedTask.title" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">任务描述</label>
                                        <textarea class="form-control" v-model="editedTask.description" rows="3" required></textarea>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label">优先级</label>
                                            <select class="form-select" v-model="editedTask.priority">
                                                <option value="1">低</option>
                                                <option value="2">中</option>
                                                <option value="3">高</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label">状态</label>
                                            <select class="form-select" v-model="editedTask.status">
                                                <option value="1">待处理</option>
                                                <option value="2">进行中</option>
                                                <option value="3">已完成</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">指派给</label>
                                        <div v-if="loadingUsers" class="text-center py-2">
                                            <div class="spinner-border spinner-border-sm text-primary" role="status">
                                                <span class="visually-hidden">加载中...</span>
                                            </div>
                                            <span class="ms-2">加载用户列表...</span>
                                        </div>
                                        <select v-else class="form-select" v-model="editedTask.assignee_id">
                                            <option value="">选择用户</option>
                                            <option v-for="user in users" :key="user.id" :value="user.id">
                                                {{ user.username }}
                                            </option>
                                        </select>
                                        <div v-if="userError" class="text-danger mt-2">
                                            <small>{{ userError }} <a href="#" @click.prevent="loadUsers">重试</a></small>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">截止日期</label>
                                        <input type="date" class="form-control" v-model="editedTask.due_date">
                                    </div>
                                    <div class="d-flex justify-content-end gap-2">
                                        <button type="button" class="btn btn-secondary" @click="cancelEdit" :disabled="submitting">
                                            取消
                                        </button>
                                        <button type="submit" class="btn btn-primary" :disabled="submitting">
                                            <span v-if="submitting">
                                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                提交中...
                                            </span>
                                            <span v-else><i class="fas fa-save"></i> 保存</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- 任务历史记录 -->
                    <div class="card mt-4">
                        <div class="card-header bg-info text-white">
                            <h5 class="mb-0">
                                <i class="fas fa-history"></i> 任务历史
                            </h5>
                        </div>
                        <div class="card-body">
                            <div v-if="loadingHistory" class="text-center py-3">
                                <div class="spinner-border spinner-border-sm text-primary" role="status">
                                    <span class="visually-hidden">加载中...</span>
                                </div>
                                <span class="ms-2">加载历史记录...</span>
                            </div>
                            <div v-else-if="!history || history.length === 0" class="text-center py-3">
                                暂无历史记录
                            </div>
                            <ul v-else class="list-group list-group-flush">
                                <li v-for="(record, index) in history" :key="index" class="list-group-item">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <span class="text-muted">{{ formatDate(record.created_at) }}</span>
                                            <span class="ms-2">{{ record.description }}</span>
                                        </div>
                                        <span class="badge bg-secondary">{{ record.type }}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            taskId: null,
            task: {},
            editedTask: {},
            history: [],
            users: [],
            loading: true,
            loadingHistory: false,
            loadingUsers: false,
            isEditing: false,
            submitting: false,
            userError: ''
        }
    },
    mounted() {
        this.taskId = this.getTaskIdFromUrl();
        this.loadTask();
    },
    methods: {
        getTaskIdFromUrl() {
            return window.location.hash.split('/')[2];
        },
        async loadTask() {
            this.loading = true;
            try {
                const response = await api.tasks.get(this.taskId);
                this.task = response.data;
                this.loadHistory();
            } catch (error) {
                console.error('加载任务详情失败:', error);
                alert('加载任务详情失败，请重试');
            } finally {
                this.loading = false;
            }
        },
        async loadHistory() {
            this.loadingHistory = true;
            try {
                const response = await api.tasks.getHistory(this.taskId);
                this.history = response.data || [];
            } catch (error) {
                console.error('加载历史记录失败:', error);
            } finally {
                this.loadingHistory = false;
            }
        },
        async loadUsers() {
            this.loadingUsers = true;
            this.userError = '';
            
            try {
                const response = await api.users.list();
                this.users = response.data;
                
                if (this.users.length === 0) {
                    this.userError = '暂无可分配的用户';
                }
            } catch (error) {
                console.error('加载用户列表失败:', error);
                this.userError = '加载用户列表失败，请确认已登录';
            } finally {
                this.loadingUsers = false;
            }
        },
        toggleEdit() {
            this.isEditing = true;
            // 克隆任务对象，避免直接修改原始数据
            this.editedTask = JSON.parse(JSON.stringify(this.task));
            
            // 确保日期格式正确
            if (this.editedTask.due_date) {
                this.editedTask.due_date = this.formatDateForInput(new Date(this.editedTask.due_date));
            }
            
            // 确保优先级和状态是字符串（select绑定需要）
            if (typeof this.editedTask.priority === 'number') {
                this.editedTask.priority = String(this.editedTask.priority);
            }
            
            if (typeof this.editedTask.status === 'number') {
                this.editedTask.status = String(this.editedTask.status);
            }
            
            // 加载用户列表用于指派
            this.loadUsers();
        },
        cancelEdit() {
            this.isEditing = false;
            this.editedTask = {};
        },
        async saveTask() {
            if (this.submitting) return;
            
            this.submitting = true;
            try {
                // 确保用户已登录
                if (!localStorage.getItem('token')) {
                    alert('请先登录后再操作');
                    window.location.hash = '#/';
                    return;
                }
                
                // 准备要发送的数据
                const taskData = { ...this.editedTask };
                
                // 移除不需要的字段
                delete taskData.creator;
                delete taskData.assignee;
                delete taskData.history;
                
                // 转换数据类型
                if (taskData.priority) {
                    taskData.priority = parseInt(taskData.priority);
                }
                
                if (taskData.status) {
                    taskData.status = parseInt(taskData.status);
                }
                
                if (taskData.assignee_id) {
                    taskData.assignee_id = parseInt(taskData.assignee_id);
                } else {
                    // 如果未指派用户，移除该字段
                    delete taskData.assignee_id;
                }
                
                // 转换日期格式
                if (taskData.due_date) {
                    taskData.due_date = new Date(taskData.due_date).toISOString();
                }
                
                const response = await api.tasks.update(this.taskId, taskData);
                this.task = response.data;
                this.isEditing = false;
                
                // 刷新历史记录
                this.loadHistory();
                
                // 触发任务更新事件
                window.dispatchEvent(new CustomEvent('taskUpdated', {
                    detail: { taskId: this.taskId, task: this.task }
                }));
                
                alert('保存成功');
            } catch (error) {
                console.error('保存任务失败:', error);
                alert('保存失败，请重试');
            } finally {
                this.submitting = false;
            }
        },
        goBack() {
            window.history.back();
        },
        getPriorityBadgeClass(priority) {
            // 处理数字类型的优先级
            if (typeof priority === 'number') {
                switch (priority) {
                    case 1: return 'bg-success';
                    case 2: return 'bg-warning';
                    case 3: return 'bg-danger';
                    default: return 'bg-secondary';
                }
            }
            
            // 处理字符串类型的优先级（兼容旧数据）
            const classes = {
                'low': 'bg-success',
                'medium': 'bg-warning',
                'high': 'bg-danger'
            };
            return classes[priority] || 'bg-secondary';
        },
        getStatusBadgeClass(status) {
            // 处理数字类型的状态
            if (typeof status === 'number') {
                switch (status) {
                    case 1: return 'bg-secondary';
                    case 2: return 'bg-warning';
                    case 3: return 'bg-success';
                    case 4: return 'bg-danger';
                    default: return 'bg-secondary';
                }
            }
            
            // 处理字符串类型的状态（兼容旧数据）
            const classes = {
                'pending': 'bg-secondary',
                'in_progress': 'bg-warning',
                'completed': 'bg-success'
            };
            return classes[status] || 'bg-secondary';
        },
        getPriorityText(priority) {
            // 处理数字类型的优先级
            if (typeof priority === 'number') {
                switch (priority) {
                    case 1: return '低';
                    case 2: return '中';
                    case 3: return '高';
                    default: return '未知';
                }
            }
            
            // 处理字符串类型的优先级（兼容旧数据）
            const texts = {
                'low': '低',
                'medium': '中',
                'high': '高'
            };
            return texts[priority] || '未知';
        },
        getStatusText(status) {
            // 处理数字类型的状态
            if (typeof status === 'number') {
                switch (status) {
                    case 1: return '待处理';
                    case 2: return '进行中';
                    case 3: return '已完成';
                    case 4: return '已删除';
                    default: return '未知';
                }
            }
            
            // 处理字符串类型的状态（兼容旧数据）
            const texts = {
                'pending': '待处理',
                'in_progress': '进行中',
                'completed': '已完成'
            };
            return texts[status] || '未知';
        },
        formatDate(dateString) {
            if (!dateString) return '无日期';
            const date = new Date(dateString);
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        formatDateForInput(date) {
            const d = new Date(date);
            let month = '' + (d.getMonth() + 1);
            let day = '' + d.getDate();
            const year = d.getFullYear();
            
            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
            
            return [year, month, day].join('-');
        }
    }
}; 