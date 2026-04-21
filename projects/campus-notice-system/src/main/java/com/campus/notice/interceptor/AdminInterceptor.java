package com.campus.notice.interceptor;

import com.campus.notice.entity.User;
import org.springframework.web.servlet.HandlerInterceptor;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * 管理员拦截器
 */
public class AdminInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession();
        User admin = (User) session.getAttribute("admin");

        if (admin == null || !"ADMIN".equals(admin.getRole())) {
            response.sendRedirect("/admin/login");
            return false;
        }

        return true;
    }
}
