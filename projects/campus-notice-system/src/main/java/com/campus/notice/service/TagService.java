package com.campus.notice.service;

import com.campus.notice.entity.Tag;
import com.campus.notice.mapper.TagMapper;
import com.campus.notice.mapper.NoticeTagMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * 标签Service
 */
@Service
public class TagService {

    @Autowired
    private TagMapper tagMapper;

    @Autowired
    private NoticeTagMapper noticeTagMapper;

    public List<Tag> findAll() {
        return tagMapper.findAll();
    }

    public Tag findById(Long id) {
        return tagMapper.findById(id);
    }

    public List<Tag> findByNoticeId(Long noticeId) {
        return tagMapper.findByNoticeId(noticeId);
    }

    public boolean save(Tag tag) {
        // 检查标签名是否重复
        Tag existing = tagMapper.findByName(tag.getName());
        if (existing != null && !existing.getId().equals(tag.getId())) {
            throw new RuntimeException("标签名称已存在");
        }
        
        if (tag.getId() == null) {
            if (tag.getColor() == null || tag.getColor().isEmpty()) {
                tag.setColor("#409EFF");
            }
            return tagMapper.insert(tag) > 0;
        } else {
            return tagMapper.update(tag) > 0;
        }
    }

    public boolean delete(Long id) {
        // 先删除关联关系
        noticeTagMapper.deleteByTagId(id);
        return tagMapper.deleteById(id) > 0;
    }
}
