package com.crowdfunding.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("projects")
public class Project {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long blockchainId;
    private Long userId;
    private String creatorAddress;
    private String projectName;
    private String description;
    private BigDecimal goalAmount;
    private BigDecimal currentAmount;
    private Integer contributorsCount;
    private LocalDateTime deadline;
    private Integer isCompleted;
    private Integer isSuccessful;
    private String category;
    private String coverImageUrl;
    private String videoUrl;
    private String contractAddress;
    private String transactionHash;
    private Long blockNumber;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    private LocalDateTime completedAt;
}
