const ProfileComponent = {
    template: `
        <div class="container mt-4">
            <div class="row">
                <div class="col-md-8 offset-md-2">
                    <div class="card">
                        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <h4 class="mb-0">
                                <i class="fas fa-user"></i> 个人中心
                            </h4>
                            <button class="btn btn-light btn-sm" @click="toggleEdit" v-if="!isEditing">
                                <i class="fas fa-edit"></i> 编辑
                            </button>
                        </div>
                        <div class="card-body">
                            <!-- 查看模式 -->
                            <div v-if="!isEditing">
                                <div class="row mb-4">
                                    <div class="col-md-3">
                                        <strong>用户名：</strong>
                                    </div>
                                    <div class="col-md-9">
                                        {{ user.username }}
                                    </div>
                                </div>
                                <div class="row mb-4">
                                    <div class="col-md-3">
                                        <strong>邮箱：</strong>
                                    </div>
                                    <div class="col-md-9">
                                        {{ user.email }}
                                    </div>
                                </div>
                                <div class="row mb-4">
                                    <div class="col-md-3">
                                        <strong>角色：</strong>
                                    </div>
                                    <div class="col-md-9">
                                        <span class="badge bg-info">{{ getRoleName(user.role) }}</span>
                                    </div>
                                </div>
                                <div class="row mb-4">
                                    <div class="col-md-3">
                                        <strong>注册时间：</strong>
                                    </div>
                                    <div class="col-md-9">
                                        {{ formatDate(user.created_at) }}
                                    </div>
                                </div>
                            </div>

                            <!-- 编辑模式 -->
                            <form v-else @submit.prevent="saveProfile">
                                <div class="mb-3">
                                    <label class="form-label">用户名</label>
                                    <input type="text" class="form-control" v-model="editedUser.username" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">邮箱</label>
                                    <input type="email" class="form-control" v-model="editedUser.email" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">新密码（如需修改）</label>
                                    <input 
                                        type="password" 
                                        class="form-control" 
                                        v-model="editedUser.password"
                                        @input="validatePassword"
                                        :class="{'is-invalid': passwordError}"
                                    >
                                    <div class="invalid-feedback" v-if="passwordError">
                                        {{ passwordError }}
                                    </div>
                                    <small class="form-text text-muted">
                                        密码必须至少包含6个字符，且至少包含一个字母
                                    </small>
                                </div>
                                <div class="d-flex justify-content-end gap-2">
                                    <button type="button" class="btn btn-secondary" @click="cancelEdit">
                                        取消
                                    </button>
                                    <button type="submit" class="btn btn-primary">
                                        保存
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- 任务统计 -->
                    <div class="card mt-4">
                        <div class="card-header bg-info text-white">
                            <h5 class="mb-0">
                                <i class="fas fa-chart-bar"></i> 任务统计
                            </h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-4 text-center mb-3">
                                    <h2 class="text-primary">{{ stats.total }}</h2>
                                    <p class="text-muted mb-0">总任务数</p>
                                </div>
                                <div class="col-md-4 text-center mb-3">
                                    <h2 class="text-success">{{ stats.completed }}</h2>
                                    <p class="text-muted mb-0">已完成</p>
                                </div>
                                <div class="col-md-4 text-center mb-3">
                                    <h2 class="text-warning">{{ stats.inProgress }}</h2>
                                    <p class="text-muted mb-0">进行中</p>
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
            user: JSON.parse(localStorage.getItem('user') || '{}'),
            editedUser: {},
            isEditing: false,
            stats: {
                total: 0,
                completed: 0,
                inProgress: 0
            },
            passwordError: ''
        }
    },
    mounted() {
        this.loadStats();
        // Debug user data on component mount
        console.log('Profile component mounted, user data:', this.user);
    },
    methods: {
        toggleEdit() {
            this.isEditing = true;
            this.editedUser = { ...this.user };
            delete this.editedUser.password; // 不显示密码
        },
        cancelEdit() {
            this.isEditing = false;
            this.editedUser = {};
        },
        validatePassword() {
            if (!this.editedUser.password) {
                this.passwordError = '';
                return true;
            }
            
            if (this.editedUser.password.length < 6) {
                this.passwordError = '密码长度至少为6位';
                return false;
            }
            
            if (!/[a-zA-Z]/.test(this.editedUser.password)) {
                this.passwordError = '密码必须包含至少一个字母';
                return false;
            }
            
            this.passwordError = '';
            return true;
        },
        async saveProfile() {
            // 验证密码
            if (!this.validatePassword()) {
                return;
            }
            
            try {
                // 获取当前用户的role_id
                let currentRoleId = null;
                
                // 调试输出当前用户信息
                console.log('当前用户信息:', {
                    user: this.user,
                    role: this.user.role,
                    role_id: this.user.role_id
                });

                // 确定role_id的值
                if (typeof this.user.role_id === 'number') {
                    currentRoleId = this.user.role_id;
                } else if (this.user.role) {
                    // 根据角色名称映射ID - 修正映射关系
                    const roleMap = {
                        'admin': 1,    // 管理员 -> 1
                        'manager': 2,  // 项目经理 -> 2
                        'user': 3      // 普通用户 -> 3
                    };
                    currentRoleId = roleMap[this.user.role] || 3; // 默认为普通用户
                } else {
                    currentRoleId = 3; // 默认为普通用户
                }

                // 构建更新数据
                const updateData = {
                    username: this.editedUser.username,
                    email: this.editedUser.email,
                    role_id: currentRoleId
                };

                // 如果修改了密码，添加密码字段
                if (this.editedUser.password && this.editedUser.password.trim()) {
                    updateData.password = this.editedUser.password;
                }

                // 调试输出请求数据
                console.log('发送更新请求数据:', updateData);

                // 发送更新请求
                const response = await api.users.update(this.user.id, updateData);
                console.log('更新成功，响应数据:', response.data);

                // 更新本地用户数据
                this.user = response.data;
                localStorage.setItem('user', JSON.stringify(this.user));
                
                this.isEditing = false;
                alert('保存成功！');
            } catch (error) {
                console.error('保存个人信息失败:', error);
                console.error('错误响应:', error.response?.data);
                
                let errorMessage = '保存失败，请重试';
                
                // 处理特定的验证错误
                if (error.response && error.response.data && error.response.data.error) {
                    if (error.response.data.error.includes('password')) {
                        errorMessage = '密码必须包含至少一个字母，长度至少为6位';
                    } else if (error.response.data.error.includes('Username already exists')) {
                        errorMessage = '用户名已被使用';
                    } else if (error.response.data.error.includes('RoleID') || error.response.data.error.includes('role_id')) {
                        errorMessage = '角色ID无效，请联系管理员';
                        // 调试输出角色相关信息
                        console.error('角色验证失败:', {
                            currentRole: this.user.role,
                            currentRoleId: this.user.role_id,
                            sentRoleId: currentRoleId
                        });
                    } else {
                        errorMessage = error.response.data.error;
                    }
                }
                
                alert(errorMessage);
            }
        },
        async loadStats() {
            try {
                const response = await api.tasks.list();
                const tasks = response.data.filter(task => task.assignee_id === this.user.id);
                this.stats.total = tasks.length;
                this.stats.completed = tasks.filter(t => t.status === 'completed').length;
                this.stats.inProgress = tasks.filter(t => t.status === 'in_progress').length;
            } catch (error) {
                console.error('加载任务统计失败:', error);
            }
        },
        getRoleName(role) {
            // 如果是数字ID，转换为名称
            if (typeof role === 'number') {
                switch (role) {
                    case 1: return '管理员';
                    case 2: return '项目经理';
                    case 3: return '普通用户';
                    default: return '未知角色';
                }
            }
            
            // 如果是字符串，使用映射
            const roles = {
                'admin': '管理员',
                'manager': '项目经理',
                'user': '普通用户'
            };
            return roles[role] || role || '未知角色';
        },
        formatDate(dateString) {
            if (!dateString) return '未知';
            const date = new Date(dateString);
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
}; 