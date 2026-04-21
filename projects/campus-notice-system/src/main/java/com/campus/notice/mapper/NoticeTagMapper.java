package com.campus.notice.mapper;

import org.apache.ibatis.annotations.*;

/**
 * 公告标签关联Mapper接口
 */
@Mapper
public interface NoticeTagMapper {

    @Insert("INSERT INTO notice_tag(notice_id, tag_id) VALUES(#{noticeId}, #{tagId})")
    int insert(@Param("noticeId") Long noticeId, @Param("tagId") Long tagId);

    @Delete("DELETE FROM notice_tag WHERE notice_id = #{noticeId}")
    int deleteByNoticeId(Long noticeId);

    @Delete("DELETE FROM notice_tag WHERE tag_id = #{tagId}")
    int deleteByTagId(Long tagId);

    @Select("SELECT COUNT(*) FROM notice_tag WHERE notice_id = #{noticeId} AND tag_id = #{tagId}")
    int exists(@Param("noticeId") Long noticeId, @Param("tagId") Long tagId);
}
