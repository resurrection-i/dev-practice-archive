package com.campus.notice.service;

import com.campus.notice.entity.Notice;
import com.campus.notice.entity.Tag;
import com.campus.notice.mapper.NoticeMapper;
import com.campus.notice.mapper.NoticeTagMapper;
import com.campus.notice.mapper.TagMapper;
import com.campus.notice.mapper.FavoriteMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

/**
 * 公告Service
 */
@Service
public class NoticeService {

    @Autowired
    private NoticeMapper noticeMapper;

    @Autowired
    private NoticeTagMapper noticeTagMapper;

    @Autowired
    private TagMapper tagMapper;

    @Autowired
    private FavoriteMapper favoriteMapper;

    public List<Notice> findAll(Long categoryId, String keyword) {
        List<Notice> notices = noticeMapper.findAll(categoryId, keyword);
        // 加载每个公告的标签
        for (Notice notice : notices) {
            notice.setTags(tagMapper.findByNoticeId(notice.getId()));
        }
        return notices;
    }

    public Notice findById(Long id) {
        Notice notice = noticeMapper.findById(id);
        if (notice != null) {
            notice.setTags(tagMapper.findByNoticeId(id));
        }
        return notice;
    }

    public List<Notice> findTopNotices() {
        return noticeMapper.findTopNotices();
    }

    public List<Notice> findAllForAdmin() {
        List<Notice> notices = noticeMapper.findAllForAdmin();
        for (Notice notice : notices) {
            notice.setTags(tagMapper.findByNoticeId(notice.getId()));
        }
        return notices;
    }

    @Transactional
    public boolean save(Notice notice, List<Long> tagIds) {
        boolean result;
        if (notice.getId() == null) {
            // 新增
            if (notice.getStatus() == null) {
                notice.setStatus(1);
            }
            if (notice.getIsTop() == null) {
                notice.setIsTop(0);
            }
            if (notice.getViewCount() == null) {
                notice.setViewCount(0);
            }
            result = noticeMapper.insert(notice) > 0;
        } else {
            // 更新
            result = noticeMapper.update(notice) > 0;
            // 删除旧的标签关联
            noticeTagMapper.deleteByNoticeId(notice.getId());
        }

        // 添加新的标签关联
        if (result && tagIds != null && !tagIds.isEmpty()) {
            for (Long tagId : tagIds) {
                noticeTagMapper.insert(notice.getId(), tagId);
            }
        }

        return result;
    }

    @Transactional
    public boolean delete(Long id) {
        // 删除标签关联
        noticeTagMapper.deleteByNoticeId(id);
        // 删除收藏记录
        favoriteMapper.deleteByNoticeId(id);
        // 删除公告
        return noticeMapper.deleteById(id) > 0;
    }

    public void increaseViewCount(Long id) {
        noticeMapper.increaseViewCount(id);
    }

    public int countPublished() {
        return noticeMapper.countPublished();
    }

    public List<Map<String, Object>> countByCategory() {
        return noticeMapper.countByCategory();
    }

    public List<Map<String, Object>> countByTag() {
        return noticeMapper.countByTag();
    }
}
