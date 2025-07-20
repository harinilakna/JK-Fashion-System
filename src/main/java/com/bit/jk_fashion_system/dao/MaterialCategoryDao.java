package com.bit.jk_fashion_system.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bit.jk_fashion_system.entity.MaterialCategory;

//create designation interface and extend into jpareporsitory<modalfile,datatype of pk>
public interface MaterialCategoryDao extends JpaRepository<MaterialCategory, Integer> {
    
}
