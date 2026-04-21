package com.campus.notice.controller;

import com.campus.notice.common.Result;
import com.campus.notice.entity.User;
import com.campus.notice.entity.Favorite;
import com.campus.notice.service.UserService;
import com.campus.notice.service.FavoriteService;
import com.campus.notice.util.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * 用户控制器
 */
@Controller
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private FavoriteService favoriteService;

    @Value("${file.upload.path}")
    private String uploadPath;

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/register")
    public String registerPage() {
        return "register";
    }

    @PostMapping("/login")
    @ResponseBody
    public Result<User> login(@RequestParam String username,
                              @RequestParam String password,
                              @RequestParam String captcha,
                              HttpSession session) {
        try {
            // 验证验证码
            String sessionCaptcha = (String) session.getAttribute("captcha");
            if (sessionCaptcha == null || !sessionCaptcha.equalsIgnoreCase(captcha)) {
                return Result.error("验证码错误");
            }

            User user = userService.login(username, password);
            if (user == null) {
                return Result.error("用户名或密码错误");
            }

            session.setAttribute("user", user);
            return Result.success("登录成功", user);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/register")
    @ResponseBody
    public Result<String> register(@RequestBody User user) {
        try {
            userService.register(user);
            return Result.success("注册成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }

    @GetMapping("/profile")
    public String profile(Model model, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return "redirect:/user/login";
        }
        // 重新从数据库获取最新信息
        user = userService.findById(user.getId());
        model.addAttribute("user", user);
        return "profile";
    }

    @PostMapping("/updateProfile")
    @ResponseBody
    public Result<String> updateProfile(@RequestBody User user, HttpSession session) {
        try {
            User currentUser = (User) session.getAttribute("user");
            if (currentUser == null) {
                return Result.error("请先登录");
            }

            // 从数据库获取当前用户信息
            User dbUser = userService.findById(currentUser.getId());
            
            // 只更新允许修改的字段，保留头像
            dbUser.setNickname(user.getNickname());
            dbUser.setEmail(user.getEmail());
            dbUser.setPhone(user.getPhone());
            
            userService.updateProfile(dbUser);

            // 更新session中的用户信息
            User updatedUser = userService.findById(currentUser.getId());
            session.setAttribute("user", updatedUser);
            // 如果是管理员，同时更新admin session
            if ("ADMIN".equals(updatedUser.getRole())) {
                session.setAttribute("admin", updatedUser);
            }

            return Result.success("更新成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/uploadAvatar")
    @ResponseBody
    public Result<String> uploadAvatar(@RequestParam("file") MultipartFile file, HttpSession session) {
        try {
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return Result.error("请先登录");
            }

            if (!FileUtil.isImageFile(file)) {
                return Result.error("只能上传图片文件");
            }

            String fileName = FileUtil.uploadFile(file, uploadPath + "avatars/");
            String avatarPath = "/uploads/avatars/" + fileName;

            // 从数据库获取最新用户信息
            User dbUser = userService.findById(user.getId());
            
            // 只更新头像字段
            dbUser.setAvatar(avatarPath);
            userService.updateProfile(dbUser);

            // 更新session
            User updatedUser = userService.findById(user.getId());
            session.setAttribute("user", updatedUser);
            // 如果是管理员，同时更新admin session
            if ("ADMIN".equals(updatedUser.getRole())) {
                session.setAttribute("admin", updatedUser);
            }

            return Result.success("上传成功", avatarPath);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/favorites")
    public String favorites(Model model, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return "redirect:/user/login";
        }

        List<Favorite> favorites = favoriteService.findByUserId(user.getId());
        model.addAttribute("favorites", favorites);
        return "favorites";
    }

    @PostMapping("/favorite/{noticeId}")
    @ResponseBody
    public Result<String> addFavorite(@PathVariable Long noticeId, HttpSession session) {
        try {
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return Result.error("请先登录");
            }

            favoriteService.addFavorite(user.getId(), noticeId);
            return Result.success("收藏成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/favorite/{noticeId}")
    @ResponseBody
    public Result<String> removeFavorite(@PathVariable Long noticeId, HttpSession session) {
        try {
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return Result.error("请先登录");
            }

            favoriteService.removeFavorite(user.getId(), noticeId);
            return Result.success("取消收藏成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
