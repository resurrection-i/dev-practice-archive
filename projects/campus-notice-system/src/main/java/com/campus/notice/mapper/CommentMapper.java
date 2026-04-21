package com.campus.notice.mapper;

import com.campus.notice.entity.Comment;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 评论Mapper接口
 */
@Mapper
public interface CommentMapper {

    /**
     * 添加评论
     */
    @Insert("INSERT INTO comment(notice_id, user_id, content) VALUES(#{noticeId}, #{userId}, #{content})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Comment comment);

    /**
     * 删除评论
     */
    @Delete("DELETE FROM comment WHERE id = #{id}")
    int deleteById(Long id);

    /**
     * 根据公告ID删除所有评论
     */
    @Delete("DELETE FROM comment WHERE notice_id = #{noticeId}")
    int deleteByNoticeId(Long noticeId);

    /**
     * 根据ID查询评论
     */
    @Select("SELECT c.*, u.username, u.nickname, u.avatar, n.title as noticeTitle " +
            "FROM comment c " +
            "LEFT JOIN user u ON c.user_id = u.id " +
            "LEFT JOIN notice n ON c.notice_id = n.id " +
            "WHERE c.id = #{id}")
    Comment findById(Long id);

    /**
     * 根据公告ID查询评论列表（带用户信息）
     */
    @Select("SELECT c.*, u.username, u.nickname, u.avatar " +
            "FROM comment c " +
            "LEFT JOIN user u ON c.user_id = u.id " +
            "WHERE c.notice_id = #{noticeId} " +
            "ORDER BY c.create_time DESC")
    List<Comment> findByNoticeId(Long noticeId);

    /**
     * 查询所有评论（管理员用，带公告标题和用户信息）
     */
    @Select("SELECT c.*, u.username, u.nickname, u.avatar, n.title as noticeTitle " +
            "FROM comment c " +
            "LEFT JOIN user u ON c.user_id = u.id " +
            "LEFT JOIN notice n ON c.notice_id = n.id " +
            "ORDER BY c.create_time DESC")
    List<Comment> findAll();

    /**
     * 统计公告的评论数
     */
    @Select("SELECT COUNT(*) FROM comment WHERE notice_id = #{noticeId}")
    int countByNoticeId(Long noticeId);

    /**
     * 统计用户的评论数
     */
    @Select("SELECT COUNT(*) FROM comment WHERE user_id = #{userId}")
    int countByUserId(Long userId);
}
