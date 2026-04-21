package com.campus.notice.config;

import com.campus.notice.interceptor.AdminInterceptor;
import com.campus.notice.interceptor.LoginInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web配置类
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload.path}")
    private String uploadPath;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 用户登录拦截器
        registry.addInterceptor(new LoginInterceptor())
                .addPathPatterns("/user/profile", "/user/favorites", "/user/updateProfile", 
                               "/user/uploadAvatar", "/user/favorite/**")
                .excludePathPatterns("/user/login", "/user/register", "/user/logout");

        // 管理员拦截器
        registry.addInterceptor(new AdminInterceptor())
                .addPathPatterns("/admin/**")
                .excludePathPatterns("/admin/login");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 配置文件上传路径映射
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath);
    }
}
