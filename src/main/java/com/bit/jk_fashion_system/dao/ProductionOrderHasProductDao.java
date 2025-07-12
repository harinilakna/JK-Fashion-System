package com.bit.jk_fashion_system.dao;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.bit.jk_fashion_system.entity.ProductionOrderHasProduct;


public interface ProductionOrderHasProductDao extends JpaRepository<ProductionOrderHasProduct, Integer> {

    @Query(value = "SELECT php FROM ProductionOrderHasProduct php WHERE php.production_order_id.id=?1 and php.product_id.id =?2")
    ProductionOrderHasProduct getQuntityByProductAndPoId(Integer poId, Integer itemId);

}
