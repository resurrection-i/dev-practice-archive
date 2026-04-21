package com.crowdfunding;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CrowdfundingApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(CrowdfundingApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("区块链众筹平台后端启动成功!");
        System.out.println("API文档地址: http://localhost:8080/api/doc.html");
        System.out.println("========================================\n");
    }
}
