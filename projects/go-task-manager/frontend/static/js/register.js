// 注册组件
const RegisterComponent = {
    template: `
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-5">
                    <div class="card shadow">
                        <div class="card-header bg-primary text-white text-center py-3">
                            <h4 class="mb-0"><i class="fas fa-user-plus me-2"></i>注册账号</h4>
                        </div>
                        <div class="card-body p-4">
                            <div v-if="error" class="alert alert-danger">
                                <i class="fas fa-exclamation-triangle me-2"></i>{{ error }}
                            </div>
                            <div v-if="success" class="alert alert-success">
                                <i class="fas fa-check-circle me-2"></i>{{ success }}
                            </div>
                            
                            <form @submit.prevent="register">
                                <div class="mb-3">
                                    <label for="username" class="form-label">
                                        <i class="fas fa-user me-2"></i>用户名
                                    </label>
                                    <input type="text" class="form-control" id="username" v-model="username" required placeholder="请输入用户名">
                                </div>
                                
                                <div class="mb-3">
                                    <label for="email" class="form-label">
                                        <i class="fas fa-envelope me-2"></i>邮箱
                                    </label>
                                    <input type="email" class="form-control" id="email" v-model="email" required placeholder="请输入邮箱地址">
                                </div>
                                
                                <div class="mb-3">
                                    <label for="password" class="form-label">
                                        <i class="fas fa-lock me-2"></i>密码
                                    </label>
                                    <input type="password" class="form-control" id="password" v-model="password" required placeholder="请输入密码 (至少6位)">
                                </div>
                                
                                <div class="mb-3">
                                    <label for="confirmPassword" class="form-label">
                                        <i class="fas fa-lock me-2"></i>确认密码
                                    </label>
                                    <input type="password" class="form-control" id="confirmPassword" v-model="confirmPassword" required placeholder="请再次输入密码">
                                </div>
                                
                                <div class="d-grid gap-2 mt-4">
                                    <button type="submit" class="btn btn-primary py-2" :disabled="isLoading">
                                        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                                        <i v-else class="fas fa-user-plus me-2"></i>注册
                                    </button>
                                    <a href="#/login" class="btn btn-outline-secondary py-2">
                                        <i class="fas fa-sign-in-alt me-2"></i>已有账号？去登录
                                    </a>
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
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            error: '',
            success: '',
            isLoading: false
        };
    },
    
    mounted() {
        // 如果已经登录，跳转到仪表盘
        if (localStorage.getItem('token')) {
            window.location.hash = '#/dashboard';
        }
    },
    
    methods: {
        async register() {
            this.error = '';
            this.success = '';
            
            // 表单验证
            if (this.password !== this.confirmPassword) {
                this.error = '两次输入的密码不一致';
                return;
            }
            
            if (this.password.length < 6) {
                this.error = '密码长度至少为6位';
                return;
            }
            
            this.isLoading = true;
            
            try {
                const result = await auth.register(this.username, this.password, this.email);
                
                if (result.success) {
                    this.success = '注册成功！正在跳转到登录页面...';
                    // 2秒后跳转到登录页
                    setTimeout(() => {
                        window.location.hash = '#/login';
                    }, 2000);
                } else {
                    this.error = result.message || '注册失败，请重试';
                }
            } catch (error) {
                console.error('注册出错:', error);
                this.error = '注册过程中出现错误，请重试';
            } finally {
                this.isLoading = false;
            }
        }
    }
}; 