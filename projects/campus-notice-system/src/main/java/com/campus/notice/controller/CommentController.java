package com.campus.notice.controller;

import com.campus.notice.common.Result;
import com.campus.notice.entity.Comment;
import com.campus.notice.entity.User;
import com.campus.notice.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * 评论控制器
 */
@RestController
@RequestMapping("/comment")
public class CommentController {

    @Autowired
    private CommentService commentService;

    /**
     * 添加评论（需要登录）
     */
    @PostMapping("/add")
    public Result<String> addComment(@RequestBody Comment comment, HttpSession session) {
        try {
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return Result.error("请先登录");
            }

            comment.setUserId(user.getId());
            commentService.addComment(comment);
            return Result.success("评论成功");
        } catch (IllegalArgumentException e) {
            return Result.error(e.getMessage());
        } catch (Exception e) {
            return Result.error("评论失败：" + e.getMessage());
        }
    }

    /**
     * 删除评论（用户只能删除自己的评论，管理员可以删除所有评论）
     */
    @DeleteMapping("/{id}")
    public Result<String> deleteComment(@PathVariable Long id, HttpSession session) {
        try {
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return Result.error("请先登录");
            }

            Comment comment = commentService.findById(id);
            if (comment == null) {
                return Result.error("评论不存在");
            }

            // 检查权限：用户只能删除自己的评论，管理员可以删除所有评论
            if (!comment.getUserId().equals(user.getId()) && !"ADMIN".equals(user.getRole())) {
                return Result.error("无权删除此评论");
            }

            commentService.deleteComment(id);
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error("删除失败：" + e.getMessage());
        }
    }

    /**
     * 根据公告ID查询评论列表
     */
    @GetMapping("/list/{noticeId}")
    public Result<List<Comment>> getCommentsByNoticeId(@PathVariable Long noticeId) {
        try {
            List<Comment> comments = commentService.findByNoticeId(noticeId);
            return Result.success("查询成功", comments);
        } catch (Exception e) {
            return Result.error("查询失败：" + e.getMessage());
        }
    }

    /**
     * 统计公告的评论数
     */
    @GetMapping("/count/{noticeId}")
    public Result<Integer> getCommentCount(@PathVariable Long noticeId) {
        try {
            int count = commentService.countByNoticeId(noticeId);
            return Result.success("查询成功", count);
        } catch (Exception e) {
            return Result.error("查询失败：" + e.getMessage());
        }
    }
}
