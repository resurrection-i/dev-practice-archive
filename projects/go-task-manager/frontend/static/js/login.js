// 登录组件
const LoginComponent = {
    template: `
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-5">
                    <div class="card shadow">
                        <div class="card-header bg-primary text-white text-center py-3">
                            <h4 class="mb-0"><i class="fas fa-sign-in-alt me-2"></i>登录系统</h4>
                        </div>
                        <div class="card-body p-4">
                            <div v-if="error" class="alert alert-danger">
                                <i class="fas fa-exclamation-triangle me-2"></i>{{ error }}
                            </div>
                            
                            <div class="text-center mb-4">
                                <p>还没有账号？<a href="#/register" class="text-primary fw-bold">立即注册</a></p>
                            </div>
                            
                            <form @submit.prevent="login">
                                <div class="mb-3">
                                    <label for="username" class="form-label">
                                        <i class="fas fa-user me-2"></i>用户名
                                    </label>
                                    <input type="text" class="form-control" id="username" v-model="username" required placeholder="请输入用户名">
                                </div>
                                
                                <div class="mb-3">
                                    <label for="password" class="form-label">
                                        <i class="fas fa-lock me-2"></i>密码
                                    </label>
                                    <input type="password" class="form-control" id="password" v-model="password" required placeholder="请输入密码">
                                </div>
                                
                                <div class="d-grid gap-2 mt-4">
                                    <button type="submit" class="btn btn-primary py-2" :disabled="isLoading">
                                        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                                        <i v-else class="fas fa-sign-in-alt me-2"></i>登录
                                    </button>
                                    <a href="#/register" class="btn btn-outline-secondary py-2">
                                        <i class="fas fa-user-plus me-2"></i>没有账号？立即注册
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
            password: '',
            error: '',
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
        async login() {
            this.error = '';
            this.isLoading = true;
            
            try {
                const result = await auth.login(this.username, this.password);
                
                if (result.success) {
                    window.location.hash = '#/dashboard';
                } else {
                    this.error = result.message || '登录失败，请重试';
                }
            } catch (error) {
                console.error('登录出错:', error);
                this.error = '登录过程中出现错误，请重试';
            } finally {
                this.isLoading = false;
            }
        }
    }
}; 