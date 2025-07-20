package com.bit.jk_fashion_system.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bit.jk_fashion_system.dao.MaterialCategoryDao;
import com.bit.jk_fashion_system.entity.MaterialCategory;



@RestController
public class MaterialCategoryController {
    
    @Autowired //Inject designation object into dao variable
    private MaterialCategoryDao categoryDao; //create designation dao object

    @GetMapping(value="/category/findall" , produces = "application/json")
    public List<MaterialCategory> getAllData(){
    return categoryDao.findAll();
    }
      
}
