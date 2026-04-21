package com.campus.notice.mapper;

import com.campus.notice.entity.User;
import org.apache.ibatis.annotations.*;
import java.util.List;

/**
 * 用户Mapper接口
 */
@Mapper
public interface UserMapper {

    @Select("SELECT * FROM user WHERE username = #{username}")
    User findByUsername(String username);

    @Select("SELECT * FROM user WHERE id = #{id}")
    User findById(Long id);

    @Select("SELECT * FROM user ORDER BY create_time DESC")
    List<User> findAllUsers();

    @Insert("INSERT INTO user(username, password, nickname, avatar, email, phone, role, status) " +
            "VALUES(#{username}, #{password}, #{nickname}, #{avatar}, #{email}, #{phone}, #{role}, #{status})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);

    @Update("UPDATE user SET nickname=#{nickname}, email=#{email}, phone=#{phone}, " +
            "avatar=#{avatar}, update_time=NOW() WHERE id=#{id}")
    int update(User user);

    @Update("UPDATE user SET password=#{password}, update_time=NOW() WHERE id=#{id}")
    int updatePassword(@Param("id") Long id, @Param("password") String password);

    @Update("UPDATE user SET role=#{role}, update_time=NOW() WHERE id=#{id}")
    int updateRole(@Param("id") Long id, @Param("role") String role);

    @Delete("DELETE FROM user WHERE id = #{id}")
    int deleteById(Long id);

    @Select("SELECT COUNT(*) FROM user WHERE role = 'USER'")
    int countUsers();
}
