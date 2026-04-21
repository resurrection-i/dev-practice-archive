package com.crowdfunding.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.crowdfunding.entity.WalletAddress;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface WalletAddressMapper extends BaseMapper<WalletAddress> {
}
