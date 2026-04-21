package com.campus.notice.config;

import com.google.code.kaptcha.impl.DefaultKaptcha;
import com.google.code.kaptcha.util.Config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.Properties;

/**
 * 验证码配置
 */
@Configuration
public class KaptchaConfig {

    @Bean
    public DefaultKaptcha getDefaultKaptcha() {
        DefaultKaptcha defaultKaptcha = new DefaultKaptcha();
        Properties properties = new Properties();
        
        // 图片边框
        properties.setProperty("kaptcha.border", "yes");
        properties.setProperty("kaptcha.border.color", "105,179,90");
        
        // 字体颜色
        properties.setProperty("kaptcha.textproducer.font.color", "blue");
        
        // 字体大小
        properties.setProperty("kaptcha.textproducer.font.size", "35");
        
        // 图片宽度
        properties.setProperty("kaptcha.image.width", "120");
        
        // 图片高度
        properties.setProperty("kaptcha.image.height", "40");
        
        // 字符长度
        properties.setProperty("kaptcha.textproducer.char.length", "4");
        
        // 字体
        properties.setProperty("kaptcha.textproducer.font.names", "Arial,Courier");
        
        Config config = new Config(properties);
        defaultKaptcha.setConfig(config);
        
        return defaultKaptcha;
    }
}
