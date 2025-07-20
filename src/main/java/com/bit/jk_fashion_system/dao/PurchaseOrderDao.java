package com.bit.jk_fashion_system.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.bit.jk_fashion_system.entity.PurchaseOrder;






//create quotation request interface and extend into jpareporsitory<modalfile,datatype of pk>
public interface PurchaseOrderDao extends JpaRepository<PurchaseOrder, Integer> {

    //get next item code
    @Query(value = "SELECT concat('PO',lpad(substring(max(po.code),3)+1, 5, '0'))FROM er_jk_fashion.purchase_order as po; ", nativeQuery = true)
    public String getNextQRCode();

    @Query("select po from PurchaseOrder po where po.supplier_id.id=?1")
    List<PurchaseOrder>getPurchaseOrderBySupplier(Integer supid );
    
}
