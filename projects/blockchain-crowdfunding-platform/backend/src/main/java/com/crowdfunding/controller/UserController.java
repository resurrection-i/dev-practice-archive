package com.crowdfunding.controller;

import com.crowdfunding.common.Result;
import com.crowdfunding.dto.UserResponse;
import com.crowdfunding.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Api(tags = "用户管理")
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @ApiOperation("获取当前用户信息")
    @GetMapping("/info")
    public Result<UserResponse> getUserInfo(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        UserResponse userInfo = userService.getUserInfo(userId);
        return Result.success(userInfo);
    }
    
    @ApiOperation("绑定钱包地址")
    @PostMapping("/bind-wallet")
    public Result<Void> bindWallet(
            @RequestParam String walletAddress,
            Authentication authentication
    ) {
        Long userId = (Long) authentication.getPrincipal();
        userService.bindWallet(userId, walletAddress);
        return Result.success();
    }
}
