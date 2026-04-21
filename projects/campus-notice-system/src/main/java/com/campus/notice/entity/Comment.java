package com.campus.notice.entity;

import java.util.Date;

/**
 * 评论实体类
 */
public class Comment {
    private Long id;
    private Long noticeId;
    private Long userId;
    private String content;
    private Date createTime;
    
    // 关联字段（非数据库字段）
    private String username;      // 评论用户名
    private String nickname;      // 评论用户昵称
    private String avatar;        // 评论用户头像
    private String noticeTitle;   // 公告标题

    public Comment() {
    }

    public Comment(Long noticeId, Long userId, String content) {
        this.noticeId = noticeId;
        this.userId = userId;
        this.content = content;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getNoticeId() {
        return noticeId;
    }

    public void setNoticeId(Long noticeId) {
        this.noticeId = noticeId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getNoticeTitle() {
        return noticeTitle;
    }

    public void setNoticeTitle(String noticeTitle) {
        this.noticeTitle = noticeTitle;
    }

    @Override
    public String toString() {
        return "Comment{" +
                "id=" + id +
                ", noticeId=" + noticeId +
                ", userId=" + userId +
                ", content='" + content + '\'' +
                ", createTime=" + createTime +
                ", username='" + username + '\'' +
                ", nickname='" + nickname + '\'' +
                '}';
    }
}
