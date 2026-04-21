package com.campus.notice.mapper;

import com.campus.notice.entity.Notice;
import org.apache.ibatis.annotations.*;
import java.util.List;
import java.util.Map;

/**
 * 公告Mapper接口
 */
@Mapper
public interface NoticeMapper {

    @Select("<script>" +
            "SELECT n.*, c.name as category_name, u.nickname as author_name " +
            "FROM notice n " +
            "LEFT JOIN category c ON n.category_id = c.id " +
            "LEFT JOIN user u ON n.author_id = u.id " +
            "WHERE n.status = 1 " +
            "<if test='categoryId != null'> AND n.category_id = #{categoryId} </if>" +
            "<if test='keyword != null and keyword != \"\"'> " +
            "  AND (n.title LIKE CONCAT('%', #{keyword}, '%') OR n.content LIKE CONCAT('%', #{keyword}, '%')) " +
            "</if>" +
            "ORDER BY n.is_top DESC, n.create_time DESC " +
            "</script>")
    List<Notice> findAll(@Param("categoryId") Long categoryId, @Param("keyword") String keyword);

    @Select("SELECT n.*, c.name as category_name, u.nickname as author_name " +
            "FROM notice n " +
            "LEFT JOIN category c ON n.category_id = c.id " +
            "LEFT JOIN user u ON n.author_id = u.id " +
            "WHERE n.id = #{id}")
    Notice findById(Long id);

    @Select("SELECT n.*, c.name as category_name, u.nickname as author_name " +
            "FROM notice n " +
            "LEFT JOIN category c ON n.category_id = c.id " +
            "LEFT JOIN user u ON n.author_id = u.id " +
            "WHERE n.status = 1 AND n.is_top = 1 " +
            "ORDER BY n.create_time DESC LIMIT 5")
    List<Notice> findTopNotices();

    @Select("SELECT n.*, c.name as category_name, u.nickname as author_name " +
            "FROM notice n " +
            "LEFT JOIN category c ON n.category_id = c.id " +
            "LEFT JOIN user u ON n.author_id = u.id " +
            "ORDER BY n.create_time DESC")
    List<Notice> findAllForAdmin();

    @Insert("INSERT INTO notice(title, content, category_id, author_id, cover_image, status, is_top) " +
            "VALUES(#{title}, #{content}, #{categoryId}, #{authorId}, #{coverImage}, #{status}, #{isTop})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Notice notice);

    @Update("UPDATE notice SET title=#{title}, content=#{content}, category_id=#{categoryId}, " +
            "cover_image=#{coverImage}, status=#{status}, is_top=#{isTop}, update_time=NOW() WHERE id=#{id}")
    int update(Notice notice);

    @Update("UPDATE notice SET view_count = view_count + 1 WHERE id = #{id}")
    int increaseViewCount(Long id);

    @Delete("DELETE FROM notice WHERE id = #{id}")
    int deleteById(Long id);

    @Select("SELECT COUNT(*) FROM notice WHERE status = 1")
    int countPublished();

    @Select("SELECT c.name as name, COUNT(n.id) as count " +
            "FROM category c " +
            "LEFT JOIN notice n ON c.id = n.category_id AND n.status = 1 " +
            "GROUP BY c.id, c.name " +
            "ORDER BY count DESC")
    List<Map<String, Object>> countByCategory();

    @Select("SELECT t.name as name, COUNT(nt.notice_id) as count " +
            "FROM tag t " +
            "LEFT JOIN notice_tag nt ON t.id = nt.tag_id " +
            "LEFT JOIN notice n ON nt.notice_id = n.id AND n.status = 1 " +
            "GROUP BY t.id, t.name " +
            "ORDER BY count DESC")
    List<Map<String, Object>> countByTag();
}
