package com.bit.jk_fashion_system.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bit.jk_fashion_system.entity.ProductionOrderStatus;

public interface ProductionOrderStatusDao extends JpaRepository<ProductionOrderStatus, Integer> {
}
