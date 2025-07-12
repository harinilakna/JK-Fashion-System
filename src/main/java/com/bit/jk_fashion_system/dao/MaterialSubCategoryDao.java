package com.bit.jk_fashion_system.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.bit.jk_fashion_system.entity.MaterialSubCategory;

//create designation interface and extend into jpareporsitory<modalfile,datatype of pk>
public interface MaterialSubCategoryDao extends JpaRepository<MaterialSubCategory, Integer> {

      //create query for get sub category by given category id
    @Query("select subcategory from MaterialSubCategory subcategory where subcategory.material_category_id.id=?1")
    List<MaterialSubCategory>getSubCategoryByCategory(Integer categoryid);
    
}
