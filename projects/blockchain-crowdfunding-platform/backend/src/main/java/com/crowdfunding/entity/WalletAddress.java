package com.crowdfunding.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("wallet_addresses")
public class WalletAddress {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long userId;
    private String walletAddress;
    private String walletName;
    private Integer isPrimary;
    private Integer isVerified;
    private LocalDateTime verifiedAt;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
