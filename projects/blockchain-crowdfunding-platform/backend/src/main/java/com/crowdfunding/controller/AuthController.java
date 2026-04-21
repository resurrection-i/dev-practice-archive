package com.crowdfunding.controller;

import com.crowdfunding.common.Result;
import com.crowdfunding.dto.*;
import com.crowdfunding.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Api(tags = "认证管理")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final UserService userService;
    
    @ApiOperation("用户注册")
    @PostMapping("/register")
    public Result<Void> register(@Validated @RequestBody RegisterRequest request) {
        userService.register(request);
        return Result.success();
    }
    
    @ApiOperation("用户登录")
    @PostMapping("/login")
    public Result<Map<String, String>> login(@Validated @RequestBody LoginRequest request) {
        String token = userService.login(request);
        Map<String, String> data = new HashMap<>();
        data.put("token", token);
        return Result.success(data);
    }
}
