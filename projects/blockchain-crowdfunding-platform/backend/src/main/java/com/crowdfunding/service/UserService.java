package com.crowdfunding.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.crowdfunding.entity.User;
import com.crowdfunding.dto.*;

public interface UserService extends IService<User> {
    
    // 用户注册
    void register(RegisterRequest request);
    
    // 用户登录
    String login(LoginRequest request);
    
    // 获取用户信息
    UserResponse getUserInfo(Long userId);
    
    // 绑定钱包地址
    void bindWallet(Long userId, String walletAddress);
    
    // 根据钱包地址查找用户
    User findByWalletAddress(String walletAddress);
}
