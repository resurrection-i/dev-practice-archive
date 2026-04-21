const CreateTaskComponent = {
    template: `
        <div class="container mt-4">
            <div class="row">
                <div class="col-md-8 offset-md-2">
                    <div class="card">
                        <div class="card-header bg-primary text-white">
                            <h4 class="mb-0"><i class="fas fa-plus"></i> 创建新任务</h4>
                        </div>
                        <div class="card-body">
                            <form @submit.prevent="createTask">
                                <div class="mb-3">
                                    <label class="form-label">任务标题</label>
                                    <input type="text" class="form-control" v-model="task.title" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">任务描述</label>
                                    <textarea class="form-control" v-model="task.description" rows="3" required></textarea>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">优先级</label>
                                        <select class="form-select" v-model="task.priority">
                                            <option value="1">低</option>
                                            <option value="2">中</option>
                                            <option value="3">高</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">截止日期</label>
                                        <input type="date" class="form-control" v-model="task.due_date">
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
                                    <select v-else class="form-select" v-model="task.assignee_id">
                                        <option value="">选择用户</option>
                                        <option v-for="user in users" :key="user.id" :value="user.id">
                                            {{ user.username }}
                                        </option>
                                    </select>
                                    <div v-if="userError" class="text-danger mt-2">
                                        <small>{{ userError }} <a href="#" @click.prevent="loadUsers">重试</a></small>
                                    </div>
                                </div>
                                <div class="d-grid gap-2">
                                    <button type="submit" class="btn btn-primary" :disabled="submitting">
                                        <span v-if="submitting">
                                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            提交中...
                                        </span>
                                        <span v-else><i class="fas fa-save"></i> 创建任务</span>
                                    </button>
                                    <button type="button" class="btn btn-secondary" @click="goBack">
                                        <i class="fas fa-arrow-left"></i> 返回
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            task: {
                title: '',
                description: '',
                priority: '2', // 默认中等优先级
                due_date: this.formatDateForInput(new Date()),
                assignee_id: ''
            },
            users: [],
            loadingUsers: false,
            userError: '',
            submitting: false
        }
    },
    mounted() {
        this.loadUsers();
    },
    methods: {
        async loadUsers() {
            this.loadingUsers = true;
            this.userError = '';
            
            try {
                // 确保用户已登录
                if (!localStorage.getItem('token')) {
                    this.userError = '请先登录后再创建任务';
                    this.loadingUsers = false;
                    return;
                }
                
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
        async createTask() {
            if (this.submitting) return;
            
            this.submitting = true;
            try {
                // 确保用户已登录
                if (!localStorage.getItem('token')) {
                    alert('请先登录后再创建任务');
                    window.location.hash = '#/';
                    return;
                }
                
                // 格式化数据
                const taskData = {
                    title: this.task.title,
                    description: this.task.description,
                    priority: parseInt(this.task.priority), // 转换为数字
                    due_date: new Date(this.task.due_date).toISOString(), // 转换为ISO格式
                    assignee_id: parseInt(this.task.assignee_id) // 转换为数字
                };
                
                if (!taskData.assignee_id) {
                    alert('请选择任务负责人');
                    return;
                }
                
                await api.tasks.create(taskData);
                alert('任务创建成功！');
                window.location.hash = '#/tasks';
            } catch (error) {
                console.error('创建任务失败:', error);
                let errorMsg = '创建任务失败，请重试';
                if (error.response && error.response.data && error.response.data.error) {
                    errorMsg = error.response.data.error;
                }
                alert(errorMsg);
            } finally {
                this.submitting = false;
            }
        },
        goBack() {
            window.history.back();
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