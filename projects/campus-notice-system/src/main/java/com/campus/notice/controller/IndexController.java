package com.campus.notice.controller;

import com.campus.notice.entity.Category;
import com.campus.notice.entity.Notice;
import com.campus.notice.entity.User;
import com.campus.notice.service.CategoryService;
import com.campus.notice.service.NoticeService;
import com.campus.notice.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * 首页控制器
 */
@Controller
public class IndexController {

    @Autowired
    private NoticeService noticeService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private FavoriteService favoriteService;

    @GetMapping("/")
    public String index(Model model, HttpSession session,
                       @RequestParam(required = false) Long categoryId,
                       @RequestParam(required = false) String keyword) {
        // 获取所有分类
        List<Category> categories = categoryService.findAll();
        model.addAttribute("categories", categories);

        // 获取置顶公告
        List<Notice> topNotices = noticeService.findTopNotices();
        model.addAttribute("topNotices", topNotices);

        // 获取公告列表
        List<Notice> notices = noticeService.findAll(categoryId, keyword);
        model.addAttribute("notices", notices);

        // 当前筛选条件
        model.addAttribute("currentCategoryId", categoryId);
        model.addAttribute("keyword", keyword);

        // 用户信息
        User user = (User) session.getAttribute("user");
        if (user != null) {
            model.addAttribute("user", user);
        }

        return "index";
    }

    @GetMapping("/notice/{id}")
    public String noticeDetail(@PathVariable Long id, Model model, HttpSession session) {
        Notice notice = noticeService.findById(id);
        if (notice == null) {
            return "redirect:/";
        }

        // 增加浏览次数
        noticeService.increaseViewCount(id);
        notice.setViewCount(notice.getViewCount() + 1);

        model.addAttribute("notice", notice);

        // 获取用户信息并传递给前端
        User user = (User) session.getAttribute("user");
        if (user != null) {
            model.addAttribute("user", user);
            boolean isFavorite = favoriteService.isFavorite(user.getId(), id);
            model.addAttribute("isFavorite", isFavorite);
        } else {
            model.addAttribute("isFavorite", false);
        }

        return "notice-detail";
    }
}
