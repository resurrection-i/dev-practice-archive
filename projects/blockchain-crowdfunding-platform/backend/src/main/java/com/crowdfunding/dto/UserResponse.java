package com.crowdfunding.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String phone;
    private String avatarUrl;
    private String realName;
    private String bio;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
    
    // 钱包信息
    private String primaryWalletAddress;
}
