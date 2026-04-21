package com.campus.notice.mapper;

import com.campus.notice.entity.Tag;
import org.apache.ibatis.annotations.*;
import java.util.List;

/**
 * 标签Mapper接口
 */
@Mapper
public interface TagMapper {

    @Select("SELECT * FROM tag ORDER BY id DESC")
    List<Tag> findAll();

    @Select("SELECT * FROM tag WHERE id = #{id}")
    Tag findById(Long id);

    @Select("SELECT * FROM tag WHERE name = #{name}")
    Tag findByName(String name);

    @Select("SELECT t.* FROM tag t " +
            "INNER JOIN notice_tag nt ON t.id = nt.tag_id " +
            "WHERE nt.notice_id = #{noticeId}")
    List<Tag> findByNoticeId(Long noticeId);

    @Insert("INSERT INTO tag(name, color) VALUES(#{name}, #{color})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Tag tag);

    @Update("UPDATE tag SET name=#{name}, color=#{color} WHERE id=#{id}")
    int update(Tag tag);

    @Delete("DELETE FROM tag WHERE id = #{id}")
    int deleteById(Long id);

    @Select("SELECT COUNT(*) FROM notice_tag WHERE tag_id = #{tagId}")
    int countNoticesByTagId(Long tagId);
}
