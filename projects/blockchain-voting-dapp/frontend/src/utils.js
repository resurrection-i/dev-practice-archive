// utils.js
class UIUtils {
    static showLoading(buttonId, message = "处理中...") {
        const btn = document.getElementById(buttonId);
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = `<span class="spinner"></span> ${message}`;
        }
    }

    static hideLoading(buttonId, originalText) {
        const btn = document.getElementById(buttonId);
        if (btn) {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    }

    static formatAddress(address) {
        if (!address) return "未连接";
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    static showToast(message, type = "info", duration = 3000) {
        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add("fade-out");
            setTimeout(() => toast.remove(), 500);
        }, duration);
    }

    static handleError(error, defaultMessage = "操作失败") {
        console.error(error);
        
        let userMessage = defaultMessage;
        if (error.code === 4001) {
            userMessage = "用户拒绝了请求";
        } else if (error.code === -32602) {
            userMessage = "无效的参数";
        } else if (error.code === -32603) {
            userMessage = "内部错误";
        } else if (error.message.includes("revert")) {
            userMessage = "交易被合约拒绝";
        } else if (error.message.includes("insufficient funds")) {
            userMessage = "余额不足";
        }
        
        this.showToast(userMessage, "error");
        return userMessage;
    }
}

class ContractUtils {
    static async getContract() {
        if (!appState.contract) {
            throw new Error("合约未初始化");
        }
        return appState.contract;
    }

    static async callWithRetry(method, args = [], retryCount = CONFIG.maxRetryCount) {
        let lastError;
        for (let i = 0; i < retryCount; i++) {
            try {
                const contract = await this.getContract();
                const result = await contract[method](...args);
                return result;
            } catch (error) {
                lastError = error;
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
        throw lastError;
    }
}