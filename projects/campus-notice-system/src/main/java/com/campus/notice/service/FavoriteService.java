package com.campus.notice.service;

import com.campus.notice.entity.Favorite;
import com.campus.notice.mapper.FavoriteMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * 收藏Service
 */
@Service
public class FavoriteService {

    @Autowired
    private FavoriteMapper favoriteMapper;

    public List<Favorite> findByUserId(Long userId) {
        return favoriteMapper.findByUserId(userId);
    }

    public boolean isFavorite(Long userId, Long noticeId) {
        return favoriteMapper.exists(userId, noticeId) > 0;
    }

    public boolean addFavorite(Long userId, Long noticeId) {
        if (isFavorite(userId, noticeId)) {
            throw new RuntimeException("已经收藏过了");
        }
        Favorite favorite = new Favorite();
        favorite.setUserId(userId);
        favorite.setNoticeId(noticeId);
        return favoriteMapper.insert(favorite) > 0;
    }

    public boolean removeFavorite(Long userId, Long noticeId) {
        return favoriteMapper.delete(userId, noticeId) > 0;
    }
}
