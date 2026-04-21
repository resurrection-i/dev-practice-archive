package com.crowdfunding.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.crowdfunding.dto.*;
import com.crowdfunding.entity.User;
import com.crowdfunding.entity.WalletAddress;
import com.crowdfunding.mapper.UserMapper;
import com.crowdfunding.mapper.WalletAddressMapper;
import com.crowdfunding.service.UserService;
import com.crowdfunding.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
    
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final WalletAddressMapper walletAddressMapper;
    
    @Override
    @Transactional
    public void register(RegisterRequest request) {
        // 检查用户名是否存在
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, request.getUsername());
        if (this.count(wrapper) > 0) {
            throw new RuntimeException("用户名已存在");
        }
        
        // 检查邮箱是否存在
        wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getEmail, request.getEmail());
        if (this.count(wrapper) > 0) {
            throw new RuntimeException("邮箱已被注册");
        }
        
        // 创建用户
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRealName(request.getRealName());
        user.setStatus(1);
        user.setRole("USER");
        
        this.save(user);
    }
    
    @Override
    public String login(LoginRequest request) {
        // 查找用户
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, request.getUsername());
        User user = this.getOne(wrapper);
        
        if (user == null) {
            throw new RuntimeException("用户名或密码错误");
        }
        
        // 验证密码
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }
        
        // 检查账户状态
        if (user.getStatus() != 1) {
            throw new RuntimeException("账户已被禁用");
        }
        
        // 更新最后登录时间
        user.setLastLoginAt(LocalDateTime.now());
        this.updateById(user);
        
        // 生成Token
        return jwtUtil.generateToken(user.getUsername(), user.getId());
    }
    
    @Override
    public UserResponse getUserInfo(Long userId) {
        User user = this.getById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setAvatarUrl(user.getAvatarUrl());
        response.setRealName(user.getRealName());
        response.setBio(user.getBio());
        response.setRole(user.getRole());
        response.setCreatedAt(user.getCreatedAt());
        response.setLastLoginAt(user.getLastLoginAt());
        
        // 获取主钱包地址
        LambdaQueryWrapper<WalletAddress> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(WalletAddress::getUserId, userId)
               .eq(WalletAddress::getIsPrimary, 1);
        WalletAddress wallet = walletAddressMapper.selectOne(wrapper);
        if (wallet != null) {
            response.setPrimaryWalletAddress(wallet.getWalletAddress());
        }
        
        return response;
    }
    
    @Override
    @Transactional
    public void bindWallet(Long userId, String walletAddress) {
        // 检查钱包地址是否已被其他用户绑定
        LambdaQueryWrapper<WalletAddress> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(WalletAddress::getWalletAddress, walletAddress);
        WalletAddress existingWallet = walletAddressMapper.selectOne(wrapper);
        
        if (existingWallet != null && !existingWallet.getUserId().equals(userId)) {
            throw new RuntimeException("该钱包地址已被其他用户绑定");
        }
        
        // 如果是当前用户的钱包，直接返回（已绑定）
        if (existingWallet != null && existingWallet.getUserId().equals(userId)) {
            return; // 已经绑定过了，无需重复绑定
        }
        
        // 检查用户是否已有主钱包
        wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(WalletAddress::getUserId, userId)
               .eq(WalletAddress::getIsPrimary, 1);
        boolean hasPrimary = walletAddressMapper.selectCount(wrapper) > 0;
        
        // 创建钱包记录
        WalletAddress wallet = new WalletAddress();
        wallet.setUserId(userId);
        wallet.setWalletAddress(walletAddress);
        wallet.setIsPrimary(hasPrimary ? 0 : 1);
        wallet.setIsVerified(1);
        wallet.setVerifiedAt(LocalDateTime.now());
        
        walletAddressMapper.insert(wallet);
    }
    
    @Override
    public User findByWalletAddress(String walletAddress) {
        LambdaQueryWrapper<WalletAddress> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(WalletAddress::getWalletAddress, walletAddress);
        WalletAddress wallet = walletAddressMapper.selectOne(wrapper);
        
        if (wallet != null) {
            return this.getById(wallet.getUserId());
        }
        return null;
    }
}
