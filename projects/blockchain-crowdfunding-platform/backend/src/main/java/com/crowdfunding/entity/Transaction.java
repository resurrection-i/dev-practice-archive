package com.crowdfunding.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("transactions")
public class Transaction {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long projectId;
    private Long userId;
    private String fromAddress;
    private String toAddress;
    private BigDecimal amount;
    private String transactionHash;
    private Long blockNumber;
    private LocalDateTime blockTimestamp;
    private Long gasUsed;
    private BigDecimal gasPrice;
    private BigDecimal transactionFee;
    private Integer status;
    private String transactionType;
    private String memo;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
