package com.bit.jk_fashion_system.dao;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import com.bit.jk_fashion_system.entity.Supplier;

public interface SupplierDao extends JpaRepository<Supplier,Integer> {


   //get next item code
    @Query(value = "SELECT concat('Sup',lpad(substring(max(sup.supno),4)+1, 3, '0'))FROM er_jk_fashion.supplier as sup; ", nativeQuery = true)
    public String getNextSupNo();

    
}
