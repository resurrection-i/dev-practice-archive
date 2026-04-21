package com.campus.notice.mapper;

import com.campus.notice.entity.Category;
import org.apache.ibatis.annotations.*;
import java.util.List;

/**
 * 分类Mapper接口
 */
@Mapper
public interface CategoryMapper {

    @Select("SELECT * FROM category ORDER BY sort_order ASC, id DESC")
    List<Category> findAll();

    @Select("SELECT * FROM category WHERE id = #{id}")
    Category findById(Long id);

    @Select("SELECT * FROM category WHERE name = #{name}")
    Category findByName(String name);

    @Insert("INSERT INTO category(name, description, sort_order) " +
            "VALUES(#{name}, #{description}, #{sortOrder})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Category category);

    @Update("UPDATE category SET name=#{name}, description=#{description}, " +
            "sort_order=#{sortOrder}, update_time=NOW() WHERE id=#{id}")
    int update(Category category);

    @Delete("DELETE FROM category WHERE id = #{id}")
    int deleteById(Long id);

    @Select("SELECT COUNT(*) FROM notice WHERE category_id = #{categoryId}")
    int countNoticesByCategoryId(Long categoryId);
}
