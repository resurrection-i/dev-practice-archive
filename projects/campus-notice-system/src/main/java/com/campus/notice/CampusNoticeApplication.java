package com.campus.notice;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 校园公告信息管理系统 - 主启动类
 * 
 * @author Campus Team
 * @version 1.0.0
 */
@SpringBootApplication
@MapperScan("com.campus.notice.mapper")
public class CampusNoticeApplication {

    public static void main(String[] args) {
        SpringApplication.run(CampusNoticeApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("校园公告信息管理系统启动成功！");
        System.out.println("访问地址: http://localhost:8080");
        System.out.println("========================================\n");
    }
}
