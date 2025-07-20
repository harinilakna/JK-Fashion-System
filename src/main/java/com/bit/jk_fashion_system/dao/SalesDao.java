package com.bit.jk_fashion_system.dao;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import com.bit.jk_fashion_system.entity.Sales;

//create quotation request interface and extend into jpareporsitory<modalfile,datatype of pk>
public interface SalesDao extends JpaRepository<Sales, Integer> {

    //get next item code
    @Query(value = "SELECT concat('S',lpad(substring(max(sales.invoice_no),2)+1, 4, '0'))FROM er_jk_fashion.sales as sales; ", nativeQuery = true)
    public String getNextSaleCode();

    // @Query("SELECT grn FROM Grn grn WHERE grn.supplier_id.id = ?1")
    // public List<Grn> getGrnBySupplier(Integer supid);
    
}
