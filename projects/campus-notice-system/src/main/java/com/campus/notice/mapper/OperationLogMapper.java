package com.campus.notice.mapper;

import com.campus.notice.entity.OperationLog;
import org.apache.ibatis.annotations.*;
import java.util.List;

/**
 * 操作日志Mapper接口
 */
@Mapper
public interface OperationLogMapper {

    @Insert("INSERT INTO operation_log(user_id, username, operation, method, params, ip) " +
            "VALUES(#{userId}, #{username}, #{operation}, #{method}, #{params}, #{ip})")
    int insert(OperationLog log);

    @Select("SELECT * FROM operation_log ORDER BY create_time DESC LIMIT 100")
    List<OperationLog> findRecent();

    @Select("SELECT * FROM operation_log WHERE user_id = #{userId} ORDER BY create_time DESC")
    List<OperationLog> findByUserId(Long userId);

    @Delete("DELETE FROM operation_log WHERE create_time < DATE_SUB(NOW(), INTERVAL 90 DAY)")
    int deleteOldLogs();
}
