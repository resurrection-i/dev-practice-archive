package com.campus.notice.controller;

import com.campus.notice.common.Result;
import com.campus.notice.entity.*;
import com.campus.notice.service.*;
import com.campus.notice.util.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 管理员控制器
 */
@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private CommentService commentService;

    @Autowired
    private NoticeService noticeService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private TagService tagService;

    @Autowired
    private OperationLogService operationLogService;

    @Value("${file.upload.path}")
    private String uploadPath;

    // 管理员登录页面
    @GetMapping("/login")
    public String loginPage() {
        return "admin/login";
    }

    // 管理员登录
    @PostMapping("/login")
    @ResponseBody
    public Result<User> login(@RequestParam String username,
                              @RequestParam String password,
                              HttpSession session) {
        try {
            User user = userService.login(username, password);
            if (user == null) {
                return Result.error("用户名或密码错误");
            }
            if (!"ADMIN".equals(user.getRole())) {
                return Result.error("无管理员权限");
            }

            // 同时设置admin和user属性，方便前台也能识别管理员身份
            session.setAttribute("admin", user);
            session.setAttribute("user", user);
            return Result.success("登录成功", user);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    // 管理员退出
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.removeAttribute("admin");
        session.removeAttribute("user");
        return "redirect:/admin/login";
    }

    // 管理首页
    @GetMapping("/index")
    public String index(Model model, HttpSession session) {
        User admin = (User) session.getAttribute("admin");
        if (admin == null) {
            return "redirect:/admin/login";
        }

        // 统计数据
        int noticeCount = noticeService.countPublished();
        int userCount = userService.countUsers();
        int categoryCount = categoryService.findAll().size();
        int tagCount = tagService.findAll().size();

        model.addAttribute("noticeCount", noticeCount);
        model.addAttribute("userCount", userCount);
        model.addAttribute("categoryCount", categoryCount);
        model.addAttribute("tagCount", tagCount);

        // 分类统计
        List<Map<String, Object>> categoryStats = noticeService.countByCategory();
        model.addAttribute("categoryStats", categoryStats);

        // 标签统计
        List<Map<String, Object>> tagStats = noticeService.countByTag();
        model.addAttribute("tagStats", tagStats);

        return "admin/index";
    }

    // ==================== 公告管理 ====================
    @GetMapping("/notices")
    public String notices(Model model) {
        List<Notice> notices = noticeService.findAllForAdmin();
        model.addAttribute("notices", notices);
        return "admin/notice-list";
    }

    @GetMapping("/notice/add")
    public String addNoticePage(Model model) {
        model.addAttribute("categories", categoryService.findAll());
        model.addAttribute("tags", tagService.findAll());
        return "admin/notice-form";
    }

    @GetMapping("/notice/edit/{id}")
    public String editNoticePage(@PathVariable Long id, Model model) {
        Notice notice = noticeService.findById(id);
        model.addAttribute("notice", notice);
        model.addAttribute("categories", categoryService.findAll());
        model.addAttribute("tags", tagService.findAll());
        
        // 当前公告的标签ID列表
        String tagIds = notice.getTags().stream()
                .map(tag -> tag.getId().toString())
                .collect(Collectors.joining(","));
        model.addAttribute("selectedTagIds", tagIds);
        
        return "admin/notice-form";
    }

    @PostMapping("/notice/save")
    @ResponseBody
    public Result<String> saveNotice(@RequestBody Map<String, Object> params, 
                                     HttpSession session,
                                     HttpServletRequest request) {
        try {
            User admin = (User) session.getAttribute("admin");
            
            Notice notice = new Notice();
            if (params.get("id") != null && !params.get("id").toString().isEmpty()) {
                notice.setId(Long.parseLong(params.get("id").toString()));
            }
            notice.setTitle(params.get("title").toString());
            notice.setContent(params.get("content").toString());
            notice.setCategoryId(Long.parseLong(params.get("categoryId").toString()));
            notice.setAuthorId(admin.getId());
            notice.setCoverImage(params.get("coverImage") != null ? params.get("coverImage").toString() : null);
            notice.setStatus(Integer.parseInt(params.get("status").toString()));
            notice.setIsTop(Integer.parseInt(params.get("isTop").toString()));

            // 处理标签
            List<Long> tagIds = null;
            if (params.get("tagIds") != null && !params.get("tagIds").toString().isEmpty()) {
                tagIds = Arrays.stream(params.get("tagIds").toString().split(","))
                        .map(Long::parseLong)
                        .collect(Collectors.toList());
            }

            noticeService.save(notice, tagIds);

            // 记录日志
            String operation = notice.getId() == null ? "新增公告" : "修改公告";
            operationLogService.log(operation, "NoticeController.saveNotice", 
                    "title=" + notice.getTitle(), request);

            return Result.success("保存成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/notice/uploadCover")
    @ResponseBody
    public Result<String> uploadCover(@RequestParam("file") MultipartFile file) {
        try {
            if (!FileUtil.isImageFile(file)) {
                return Result.error("只能上传图片文件");
            }

            String fileName = FileUtil.uploadFile(file, uploadPath + "covers/");
            String coverPath = "/uploads/covers/" + fileName;

            return Result.success("上传成功", coverPath);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/notice/{id}")
    @ResponseBody
    public Result<String> deleteNotice(@PathVariable Long id, HttpServletRequest request) {
        try {
            Notice notice = noticeService.findById(id);
            noticeService.delete(id);

            // 记录日志
            operationLogService.log("删除公告", "NoticeController.deleteNotice", 
                    "id=" + id + ", title=" + notice.getTitle(), request);

            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    // ==================== 分类管理 ====================
    @GetMapping("/categories")
    public String categories(Model model) {
        List<Category> categories = categoryService.findAll();
        model.addAttribute("categories", categories);
        return "admin/category-list";
    }

    @PostMapping("/category/save")
    @ResponseBody
    public Result<String> saveCategory(@RequestBody Category category, HttpServletRequest request) {
        try {
            categoryService.save(category);

            // 记录日志
            String operation = category.getId() == null ? "新增分类" : "修改分类";
            operationLogService.log(operation, "CategoryController.saveCategory", 
                    "name=" + category.getName(), request);

            return Result.success("保存成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/category/{id}")
    @ResponseBody
    public Result<String> deleteCategory(@PathVariable Long id, HttpServletRequest request) {
        try {
            Category category = categoryService.findById(id);
            categoryService.delete(id);

            // 记录日志
            operationLogService.log("删除分类", "CategoryController.deleteCategory", 
                    "id=" + id + ", name=" + category.getName(), request);

            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    // ==================== 标签管理 ====================
    @GetMapping("/tags")
    public String tags(Model model) {
        List<Tag> tags = tagService.findAll();
        model.addAttribute("tags", tags);
        return "admin/tag-list";
    }

    @PostMapping("/tag/save")
    @ResponseBody
    public Result<String> saveTag(@RequestBody Tag tag, HttpServletRequest request) {
        try {
            tagService.save(tag);

            // 记录日志
            String operation = tag.getId() == null ? "新增标签" : "修改标签";
            operationLogService.log(operation, "TagController.saveTag", 
                    "name=" + tag.getName(), request);

            return Result.success("保存成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/tag/{id}")
    @ResponseBody
    public Result<String> deleteTag(@PathVariable Long id, HttpServletRequest request) {
        try {
            Tag tag = tagService.findById(id);
            tagService.delete(id);

            // 记录日志
            operationLogService.log("删除标签", "TagController.deleteTag", 
                    "id=" + id + ", name=" + tag.getName(), request);

            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    // ==================== 操作日志 ====================
    @GetMapping("/logs")
    public String logs(Model model) {
        List<OperationLog> logs = operationLogService.findRecent();
        model.addAttribute("logs", logs);
        return "admin/log-list";
    }

    // ==================== 评论管理 ====================
    @GetMapping("/comments")
    public String comments(Model model) {
        List<Comment> comments = commentService.findAll();
        model.addAttribute("comments", comments);
        return "admin/comment-list";
    }

    @DeleteMapping("/comment/{id}")
    @ResponseBody
    public Result<String> deleteComment(@PathVariable Long id) {
        try {
            commentService.deleteComment(id);
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    // ========== 用户管理 ==========

    @GetMapping("/users")
    public String users(Model model) {
        List<User> users = userService.findAll();
        model.addAttribute("users", users);
        return "admin/user-list";
    }

    @PutMapping("/user/{id}/role")
    @ResponseBody
    public Result<String> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> params) {
        try {
            String role = params.get("role");
            if (role == null || (!role.equals("ADMIN") && !role.equals("USER"))) {
                return Result.error("角色参数错误");
            }
            User user = userService.findById(id);
            if (user == null) {
                return Result.error("用户不存在");
            }
            if (id == 1 && role.equals("USER")) {
                return Result.error("不能修改超级管理员的角色");
            }
            userService.updateRole(id, role);
            return Result.success("操作成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/user/{id}")
    @ResponseBody
    public Result<String> deleteUser(@PathVariable Long id) {
        try {
            if (id == 1) {
                return Result.error("不能删除超级管理员");
            }
            userService.deleteById(id);
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
