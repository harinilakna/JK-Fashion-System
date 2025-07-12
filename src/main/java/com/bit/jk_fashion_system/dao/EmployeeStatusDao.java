package com.bit.jk_fashion_system.dao;
import org.springframework.data.jpa.repository.JpaRepository;

import com.bit.jk_fashion_system.entity.EmployeeStatus;

public interface EmployeeStatusDao extends JpaRepository<EmployeeStatus,Integer> {
    
}
