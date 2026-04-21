package com.campus.notice.service;

import com.campus.notice.entity.OperationLog;
import com.campus.notice.mapper.OperationLogMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * 操作日志Service
 */
@Service
public class OperationLogService {

    private static final Logger logger = LoggerFactory.getLogger("OPERATION_LOG");

    @Autowired
    private OperationLogMapper operationLogMapper;

    public void log(String operation, String method, String params, HttpServletRequest request) {
        try {
            OperationLog log = new OperationLog();
            log.setOperation(operation);
            log.setMethod(method);
            log.setParams(params);
            log.setIp(getIpAddress(request));

            // 从session获取用户信息
            Object userObj = request.getSession().getAttribute("user");
            if (userObj != null) {
                com.campus.notice.entity.User user = (com.campus.notice.entity.User) userObj;
                log.setUserId(user.getId());
                log.setUsername(user.getUsername());
            }

            operationLogMapper.insert(log);
            logger.info("操作日志: {} - {} - {}", log.getUsername(), operation, method);
        } catch (Exception e) {
            logger.error("记录操作日志失败", e);
        }
    }

    public List<OperationLog> findRecent() {
        return operationLogMapper.findRecent();
    }

    public List<OperationLog> findByUserId(Long userId) {
        return operationLogMapper.findByUserId(userId);
    }

    private String getIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
