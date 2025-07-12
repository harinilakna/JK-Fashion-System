package com.bit.jk_fashion_system.dao;


import org.springframework.data.jpa.repository.JpaRepository;


import com.bit.jk_fashion_system.entity.SupplierPayment;






//create quotation request interface and extend into jpareporsitory<modalfile,datatype of pk>
public interface SupplierPaymentDao extends JpaRepository<SupplierPayment, Integer> {

    //get next item code
    // @Query(value = "SELECT concat('PO',lpad(substring(max(po.code),3)+1, 5, '0'))FROM er_jk_fashion.purchase_order as po; ", nativeQuery = true)
    // public String getNextQRCode();

 
    
}
