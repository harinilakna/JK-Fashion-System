package com.bit.jk_fashion_system.dao;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.bit.jk_fashion_system.entity.Grn;

//create quotation request interface and extend into jpareporsitory<modalfile,datatype of pk>
public interface GrnDao extends JpaRepository<Grn, Integer> {

    //get next item code
    @Query(value = "SELECT concat('Grn',lpad(substring(max(grn.grn_no),4)+1, 4, '0'))FROM er_jk_fashion.grn as grn; ", nativeQuery = true)
    public String getNextGrnCode();

    @Query("SELECT grn FROM Grn grn WHERE grn.supplier_id.id = ?1")
    public List<Grn> getGrnBySupplier(Integer supid);
    
}
