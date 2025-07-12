package com.bit.jk_fashion_system.dao;

import org.springframework.data.jpa.repository.JpaRepository;


import com.bit.jk_fashion_system.entity.PaymentType;

//create designation interface and extend into jpareporsitory<modalfile,datatype of pk>
public interface PaymentTypeDao extends JpaRepository<PaymentType, Integer> {
    
}
