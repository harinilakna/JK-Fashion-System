package com.bit.jk_fashion_system.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


import com.bit.jk_fashion_system.dao.ProductCategoryDao;
import com.bit.jk_fashion_system.entity.ProductCategory;



@RestController
public class ProductCategoryController {
    
    @Autowired //Inject designation object into dao variable
    private ProductCategoryDao productcategoryDao; //create designation dao object

    @GetMapping(value="/productcategory/findall" , produces = "application/json")
    public List<ProductCategory> getAllData(){
    return productcategoryDao.findAll();
    }
      
}
