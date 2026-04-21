package com.campus.notice.service;

import com.campus.notice.entity.Category;
import com.campus.notice.mapper.CategoryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * 分类Service
 */
@Service
public class CategoryService {

    @Autowired
    private CategoryMapper categoryMapper;

    public List<Category> findAll() {
        return categoryMapper.findAll();
    }

    public Category findById(Long id) {
        return categoryMapper.findById(id);
    }

    public boolean save(Category category) {
        // 检查分类名是否重复
        Category existing = categoryMapper.findByName(category.getName());
        if (existing != null && !existing.getId().equals(category.getId())) {
            throw new RuntimeException("分类名称已存在");
        }
        
        if (category.getId() == null) {
            return categoryMapper.insert(category) > 0;
        } else {
            return categoryMapper.update(category) > 0;
        }
    }

    public boolean delete(Long id) {
        // 检查是否有公告使用该分类
        int count = categoryMapper.countNoticesByCategoryId(id);
        if (count > 0) {
            throw new RuntimeException("该分类下还有公告，无法删除");
        }
        return categoryMapper.deleteById(id) > 0;
    }
}
