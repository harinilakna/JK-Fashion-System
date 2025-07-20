package com.bit.jk_fashion_system.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.bit.jk_fashion_system.entity.ProductionOrder;




public interface ProductionOrderDao extends JpaRepository<ProductionOrder, Integer> {

    @Query(value = "SELECT concat('ORDER',lpad(substring(max(po.code),6)+ 1 , 4 ,'0')) " +
            "FROM er_jk_fashion.production_order as po;", nativeQuery = true)
    String getNextCode();

    @Query(value = "SELECT po FROM ProductionOrder po WHERE po.production_order_status_id.id IN (2, 3, 5)")
    List<ProductionOrder> getApprovedProductionOrders();

}
