package com.campus.notice.entity;

import java.io.Serializable;
import java.util.Date;

/**
 * 标签实体类
 */
public class Tag implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String name;
    private String color;
    private Date createTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
