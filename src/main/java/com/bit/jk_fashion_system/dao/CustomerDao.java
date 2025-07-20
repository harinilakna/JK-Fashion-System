package com.bit.jk_fashion_system.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.bit.jk_fashion_system.entity.Customer;


public interface CustomerDao extends JpaRepository<Customer,Integer> {

      //get next Material code
    @Query(value = "SELECT concat('C',lpad(substring(max(customer.code),2)+1, 5, '0'))FROM er_jk_fashion.customer as customer; ", nativeQuery = true)
    public String getNextCustomerCode();

    //  define query for get shop by given email
    @Query(value = "SELECT s from Customer s WHERE s.email = ?1")
    public Customer getShopByEmail(String email);
    
}
