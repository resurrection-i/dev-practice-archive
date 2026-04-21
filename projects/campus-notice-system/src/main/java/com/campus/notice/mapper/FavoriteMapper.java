package com.campus.notice.mapper;

import com.campus.notice.entity.Favorite;
import org.apache.ibatis.annotations.*;
import java.util.List;

/**
 * 收藏Mapper接口
 */
@Mapper
public interface FavoriteMapper {

    @Select("SELECT f.*, n.title, n.content, n.cover_image, n.create_time as notice_create_time, " +
            "c.name as category_name " +
            "FROM favorite f " +
            "INNER JOIN notice n ON f.notice_id = n.id " +
            "LEFT JOIN category c ON n.category_id = c.id " +
            "WHERE f.user_id = #{userId} " +
            "ORDER BY f.create_time DESC")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "userId", column = "user_id"),
        @Result(property = "noticeId", column = "notice_id"),
        @Result(property = "createTime", column = "create_time"),
        @Result(property = "notice.id", column = "notice_id"),
        @Result(property = "notice.title", column = "title"),
        @Result(property = "notice.content", column = "content"),
        @Result(property = "notice.coverImage", column = "cover_image"),
        @Result(property = "notice.categoryName", column = "category_name"),
        @Result(property = "notice.createTime", column = "notice_create_time")
    })
    List<Favorite> findByUserId(Long userId);

    @Select("SELECT COUNT(*) FROM favorite WHERE user_id = #{userId} AND notice_id = #{noticeId}")
    int exists(@Param("userId") Long userId, @Param("noticeId") Long noticeId);

    @Insert("INSERT INTO favorite(user_id, notice_id) VALUES(#{userId}, #{noticeId})")
    int insert(Favorite favorite);

    @Delete("DELETE FROM favorite WHERE user_id = #{userId} AND notice_id = #{noticeId}")
    int delete(@Param("userId") Long userId, @Param("noticeId") Long noticeId);

    @Delete("DELETE FROM favorite WHERE notice_id = #{noticeId}")
    int deleteByNoticeId(Long noticeId);
}
