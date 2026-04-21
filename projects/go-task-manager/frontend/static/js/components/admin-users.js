// 用户管理组件
const AdminUsersComponent = {
    template: `
        <div class="container mt-4">
            <!-- 页面标题 -->
            <div class="row mb-4">
                <div class="col">
                    <div class="d-flex align-items-center">
                        <div class="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                            <i class="fas fa-users fa-2x text-primary"></i>
                        </div>
                        <div>
                            <h2 class="mb-1">用户管理</h2>
                            <p class="text-muted mb-0">管理系统用户和权限</p>
                        </div>
                        <div class="ms-auto">
                            <button @click="showAddUserModal" class="btn btn-primary me-2">
                                <i class="fas fa-user-plus me-2"></i>添加用户
                            </button>
                            <a href="#/admin" class="btn btn-outline-secondary">
                                <i class="fas fa-arrow-left me-2"></i>返回
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 搜索和过滤 -->
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label text-muted small">搜索用户</label>
                            <div class="input-group">
                                <span class="input-group-text bg-white border-end-0">
                                    <i class="fas fa-search text-muted"></i>
                                </span>
                                <input type="text" class="form-control border-start-0" v-model="searchQuery" placeholder="搜索用户名或邮箱...">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted small">角色筛选</label>
                            <div class="btn-group w-100">
                                <button type="button" class="btn" :class="[filter === 'all' ? 'btn-primary' : 'btn-outline-primary']" @click="filter = 'all'">
                                    <i class="fas fa-users me-2"></i>全部
                                </button>
                                <button type="button" class="btn" :class="[filter === 'admin' ? 'btn-primary' : 'btn-outline-primary']" @click="filter = 'admin'">
                                    <i class="fas fa-user-shield me-2"></i>管理员
                                </button>
                                <button type="button" class="btn" :class="[filter === 'manager' ? 'btn-primary' : 'btn-outline-primary']" @click="filter = 'manager'">
                                    <i class="fas fa-project-diagram me-2"></i>项目经理
                                </button>
                                <button type="button" class="btn" :class="[filter === 'user' ? 'btn-primary' : 'btn-outline-primary']" @click="filter = 'user'">
                                    <i class="fas fa-user me-2"></i>普通用户
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 用户列表 -->
            <div class="card border-0 shadow-sm">
                <div class="card-body p-0">
                    <div v-if="loading" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">加载中...</span>
                        </div>
                        <p class="mt-3 text-muted">加载用户数据中...</p>
                    </div>

                    <div v-else-if="error" class="alert alert-danger m-3">
                        {{ error }}
                    </div>

                    <div v-else-if="filteredUsers.length === 0" class="text-center py-5">
                        <div class="text-muted">
                            <i class="fas fa-users fa-3x mb-3"></i>
                            <p>没有找到匹配的用户</p>
                        </div>
                    </div>

                    <div v-else class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="bg-light">
                                <tr>
                                    <th>ID</th>
                                    <th>用户名</th>
                                    <th>邮箱</th>
                                    <th>角色</th>
                                    <th>创建时间</th>
                                    <th width="150">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="user in filteredUsers" :key="user.id">
                                    <td>
                                        <span class="badge bg-light text-dark">#{{ user.id }}</span>
                                    </td>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div class="rounded-circle bg-light p-2 me-2">
                                                <i class="fas fa-user text-primary"></i>
                                            </div>
                                            {{ user.username }}
                                        </div>
                                    </td>
                                    <td>
                                        <i class="fas fa-envelope text-muted me-2"></i>
                                        {{ user.email }}
                                    </td>
                                    <td>
                                        <span class="badge" :class="$utils.getRoleBadgeClass(user.role)">
                                            <i class="fas" :class="user.role === 'admin' ? 'fa-user-shield' : user.role === 'manager' ? 'fa-project-diagram' : 'fa-user'"></i>
                                            {{ $utils.getRoleText(user.role) }}
                                        </span>
                                    </td>
                                    <td>
                                        <i class="fas fa-calendar text-muted me-2"></i>
                                        {{ formatDate(user.created_at) }}
                                    </td>
                                    <td>
                                        <button @click="editUser(user)" class="btn btn-sm btn-outline-primary me-1" title="编辑用户">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button @click="confirmDelete(user)" class="btn btn-sm btn-outline-danger" 
                                            :disabled="user.role === 'admin' && currentUser.role === 'admin' && user.id === currentUser.id"
                                            title="删除用户">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- 添加/编辑用户模态框 -->
            <div class="modal fade" id="userModal" tabindex="-1" ref="userModal">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-light">
                            <h5 class="modal-title">
                                <i class="fas" :class="isEditing ? 'fa-user-edit' : 'fa-user-plus'"></i>
                                {{ isEditing ? '编辑用户' : '添加用户' }}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div v-if="modalError" class="alert alert-danger">
                                <i class="fas fa-exclamation-triangle me-2"></i>
                                {{ modalError }}
                            </div>
                            <form @submit.prevent="saveUser">
                                <div class="mb-3">
                                    <label class="form-label">
                                        <i class="fas fa-user me-2"></i>用户名
                                    </label>
                                    <input type="text" class="form-control" v-model="userForm.username" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">
                                        <i class="fas fa-envelope me-2"></i>邮箱
                                    </label>
                                    <input type="email" class="form-control" v-model="userForm.email" required>
                                </div>
                                <div class="mb-3" v-if="!isEditing">
                                    <label class="form-label">
                                        <i class="fas fa-lock me-2"></i>密码
                                    </label>
                                    <input type="password" class="form-control" v-model="userForm.password" required>
                                </div>
                                <div class="mb-3" v-if="!isEditing || (currentUser.role === 'admin' && currentUser.id !== userForm.id)">
                                    <label class="form-label">
                                        <i class="fas fa-user-shield me-2"></i>角色
                                    </label>
                                    <select class="form-select" v-model="userForm.role">
                                        <option value="user">普通用户</option>
                                        <option value="manager">项目经理</option>
                                        <option value="admin">管理员</option>
                                    </select>
                                </div>
                                <div class="d-grid">
                                    <button type="submit" class="btn btn-primary" :disabled="saving">
                                        <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                                        <i v-else class="fas" :class="isEditing ? 'fa-save' : 'fa-user-plus'"></i>
                                        {{ saving ? '保存中...' : (isEditing ? '保存修改' : '创建用户') }}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 删除确认模态框 -->
            <div class="modal fade" id="deleteModal" tabindex="-1" ref="deleteModal">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-danger text-white">
                            <h5 class="modal-title">
                                <i class="fas fa-exclamation-triangle me-2"></i>确认删除
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p class="mb-0">确定要删除用户 <strong>{{ userToDelete?.username }}</strong> 吗？此操作不可撤销。</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="fas fa-times me-2"></i>取消
                            </button>
                            <button type="button" class="btn btn-danger" @click="deleteUser" :disabled="deleting">
                                <span v-if="deleting" class="spinner-border spinner-border-sm me-2"></span>
                                <i v-else class="fas fa-trash me-2"></i>
                                {{ deleting ? '删除中...' : '确认删除' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            users: [],
            searchQuery: '',
            filter: 'all',
            loading: true,
            saving: false,
            deleting: false,
            error: null,
            modalError: null,
            isEditing: false,
            userForm: {
                id: null,
                username: '',
                email: '',
                password: '',
                role: 'user'
            },
            userToDelete: null,
            currentUser: null,
            userModal: null,
            deleteModal: null
        }
    },
    computed: {
        filteredUsers() {
            let result = this.users;
            
            // 基于搜索查询过滤
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(user => 
                    user.username.toLowerCase().includes(query) || 
                    user.email.toLowerCase().includes(query)
                );
            }
            
            // 基于角色过滤
            if (this.filter !== 'all') {
                result = result.filter(user => {
                    // 处理字符串角色
                    if (typeof user.role === 'string') {
                        return user.role === this.filter;
                    }
                    
                    // 处理数字角色
                    const roleMap = {
                        'admin': 1,
                        'manager': 2,
                        'user': 3
                    };
                    
                    return user.role_id === roleMap[this.filter] || user.role === roleMap[this.filter];
                });
            }
            
            return result;
        }
    },
    mounted() {
        // 初始化模态框
        this.userModal = new bootstrap.Modal(this.$refs.userModal);
        this.deleteModal = new bootstrap.Modal(this.$refs.deleteModal);
        
        // 加载当前用户信息
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                this.currentUser = JSON.parse(userStr);
            } catch (e) {
                console.error('解析用户数据失败', e);
            }
        }
        
        this.loadUsers();
    },
    methods: {
        async loadUsers() {
            this.loading = true;
            this.error = null;
            
            try {
                const response = await api.users.list();
                this.users = response.data;
            } catch (error) {
                console.error("加载用户列表失败:", error);
                this.error = "加载用户列表失败: " + (error.response?.data?.error || error.message);
            } finally {
                this.loading = false;
            }
        },
        search() {
            // 搜索功能已通过计算属性实现
        },
        showAddUserModal() {
            this.isEditing = false;
            this.modalError = null;
            this.userForm = {
                id: null,
                username: '',
                email: '',
                password: '',
                role: 'user'
            };
            this.userModal.show();
        },
        editUser(user) {
            this.isEditing = true;
            this.modalError = null;
            this.userForm = {
                id: user.id,
                username: user.username,
                email: user.email,
                password: '',
                role: user.role
            };
            this.userModal.show();
        },
        async saveUser() {
            this.modalError = null;
            this.saving = true;
            
            try {
                if (this.isEditing) {
                    // 更新用户
                    const userData = {
                        username: this.userForm.username,
                        email: this.userForm.email,
                        role_id: this.getRoleId(this.userForm.role)
                    };
                    
                    await api.users.update(this.userForm.id, userData);
                } else {
                    // 创建用户
                    await api.auth.register(this.userForm.username, this.userForm.password, this.userForm.email);
                    
                    // 如果需要设置为管理员或项目经理，额外调用更新接口
                    if (this.userForm.role !== 'user') {
                        // 获取新创建的用户
                        const usersResponse = await api.users.list();
                        const newUser = usersResponse.data.find(u => u.username === this.userForm.username);
                        
                        if (newUser) {
                            await api.users.update(newUser.id, { role_id: this.getRoleId(this.userForm.role) });
                        }
                    }
                }
                
                // 成功后关闭模态框并重新加载用户列表
                this.userModal.hide();
                this.loadUsers();
            } catch (error) {
                console.error("保存用户失败:", error);
                this.modalError = "保存用户失败: " + (error.response?.data?.error || error.message);
            } finally {
                this.saving = false;
            }
        },
        
        // 根据角色名称获取角色ID
        getRoleId(roleName) {
            switch(roleName) {
                case 'admin': return 1;    // 管理员
                case 'manager': return 2;  // 项目经理
                case 'user': return 3;     // 普通用户
                default: return 3;         // 默认为普通用户
            }
        },
        confirmDelete(user) {
            this.userToDelete = user;
            this.deleteModal.show();
        },
        async deleteUser() {
            if (!this.userToDelete) return;
            
            this.deleting = true;
            
            try {
                await api.users.delete(this.userToDelete.id);
                this.deleteModal.hide();
                this.loadUsers();
            } catch (error) {
                console.error("删除用户失败:", error);
                alert("删除用户失败: " + (error.response?.data?.error || error.message));
            } finally {
                this.deleting = false;
            }
        },
        formatDate(dateString) {
            if (!dateString) return '未知';
            
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