package com.campus.notice.util;

import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

/**
 * 文件上传工具类
 */
public class FileUtil {

    /**
     * 上传文件
     */
    public static String uploadFile(MultipartFile file, String uploadPath) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("文件不能为空");
        }

        // 获取原始文件名
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new IllegalArgumentException("文件名不能为空");
        }

        // 获取文件扩展名
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        
        // 生成新文件名：日期 + UUID
        String dateStr = new SimpleDateFormat("yyyyMMdd").format(new Date());
        String fileName = dateStr + "_" + UUID.randomUUID().toString().replace("-", "") + extension;

        // 创建上传目录
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // 保存文件
        File destFile = new File(uploadDir, fileName);
        file.transferTo(destFile);

        return fileName;
    }

    /**
     * 删除文件
     */
    public static boolean deleteFile(String filePath) {
        File file = new File(filePath);
        if (file.exists() && file.isFile()) {
            return file.delete();
        }
        return false;
    }

    /**
     * 验证图片文件
     */
    public static boolean isImageFile(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            return false;
        }
        String extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
        return extension.equals(".jpg") || extension.equals(".jpeg") || 
               extension.equals(".png") || extension.equals(".gif");
    }
}
