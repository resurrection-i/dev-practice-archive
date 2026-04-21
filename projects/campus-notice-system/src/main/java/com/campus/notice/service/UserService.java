package com.campus.notice.service;

import com.campus.notice.entity.User;
import com.campus.notice.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * 用户Service
 */
@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    public User login(String username, String password) {
        User user = userMapper.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            if (user.getStatus() == 0) {
                throw new RuntimeException("账号已被禁用");
            }
            return user;
        }
        return null;
    }

    public boolean register(User user) {
        // 检查用户名是否存在
        if (userMapper.findByUsername(user.getUsername()) != null) {
            throw new RuntimeException("用户名已存在");
        }
        user.setRole("USER");
        user.setStatus(1);
        if (user.getAvatar() == null || user.getAvatar().isEmpty()) {
            user.setAvatar("/images/default-avatar.png");
        }
        return userMapper.insert(user) > 0;
    }

    public User findById(Long id) {
        return userMapper.findById(id);
    }

    public User findByUsername(String username) {
        return userMapper.findByUsername(username);
    }

    public List<User> findAllUsers() {
        return userMapper.findAllUsers();
    }

    public boolean updateProfile(User user) {
        return userMapper.update(user) > 0;
    }

    public boolean updatePassword(Long id, String newPassword) {
        return userMapper.updatePassword(id, newPassword) > 0;
    }

    public boolean deleteUser(Long id) {
        return userMapper.deleteById(id) > 0;
    }

    public int countUsers() {
        return userMapper.countUsers();
    }

    public List<User> findAll() {
        return userMapper.findAllUsers();
    }

    public boolean deleteById(Long id) {
        return userMapper.deleteById(id) > 0;
    }

    public boolean updateRole(Long id, String role) {
        return userMapper.updateRole(id, role) > 0;
    }
}
