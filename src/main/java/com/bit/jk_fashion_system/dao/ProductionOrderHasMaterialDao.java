package com.bit.jk_fashion_system.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bit.jk_fashion_system.entity.ProductionOrderHasMaterial;


public interface ProductionOrderHasMaterialDao extends JpaRepository<ProductionOrderHasMaterial, Integer> {

    // @Query(value = "SELECT php FROM ProductionOrderHasProduct php where php.productionOrder.id=?1 and php.product.id =?2")
    // ProductionOrderHasProduct getQtyByItemAndPoId(int poId, int itemId);


//    @Query(value = "SELECT prohasid FROM PrOrderHasItemDetails prohasid where productionorder_id.id=?1 and itemdetails_id.id=?2 and item_size_id.id=?3")
//    public PrOrderHasItemDetails getprohasidObj(int productionorder_id, int itemdetails_id, int item_size_id);
}
