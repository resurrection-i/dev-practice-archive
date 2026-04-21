package com.campus.notice.service;

import com.campus.notice.entity.Comment;
import com.campus.notice.mapper.CommentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 评论服务类
 */
@Service
public class CommentService {

    @Autowired
    private CommentMapper commentMapper;

    /**
     * 添加评论
     */
    public boolean addComment(Comment comment) {
        if (comment.getContent() == null || comment.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("评论内容不能为空");
        }
        if (comment.getContent().length() > 500) {
            throw new IllegalArgumentException("评论内容不能超过500字");
        }
        return commentMapper.insert(comment) > 0;
    }

    /**
     * 删除评论
     */
    public boolean deleteComment(Long id) {
        return commentMapper.deleteById(id) > 0;
    }

    /**
     * 根据公告ID删除所有评论
     */
    public boolean deleteByNoticeId(Long noticeId) {
        return commentMapper.deleteByNoticeId(noticeId) > 0;
    }

    /**
     * 根据ID查询评论
     */
    public Comment findById(Long id) {
        return commentMapper.findById(id);
    }

    /**
     * 根据公告ID查询评论列表
     */
    public List<Comment> findByNoticeId(Long noticeId) {
        return commentMapper.findByNoticeId(noticeId);
    }

    /**
     * 查询所有评论（管理员用）
     */
    public List<Comment> findAll() {
        return commentMapper.findAll();
    }

    /**
     * 统计公告的评论数
     */
    public int countByNoticeId(Long noticeId) {
        return commentMapper.countByNoticeId(noticeId);
    }

    /**
     * 统计用户的评论数
     */
    public int countByUserId(Long userId) {
        return commentMapper.countByUserId(userId);
    }
}
