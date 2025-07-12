package com.bit.jk_fashion_system.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bit.jk_fashion_system.dao.MaterialSubCategoryDao;
import com.bit.jk_fashion_system.entity.MaterialSubCategory;



@RestController
public class MaterialSubCategoryController {
    
    @Autowired //Inject designation object into dao variable
    private MaterialSubCategoryDao subcategoryDao; //create designation dao object

    @GetMapping(value="/subcategory/findall" , produces = "application/json")
    public List<MaterialSubCategory> getAllData(){
    return subcategoryDao.findAll();
    }
      
    
    //define mapping for get subcategory by given category id[/subcategory/listbycategory?categoryid=]

    @GetMapping(value="/materialsubcategory/listbycategory" , params = {"categoryid"} , produces = "application/json")
    public List<MaterialSubCategory> getAllDataByCategory(@RequestParam("categoryid")Integer categoryid){
    return subcategoryDao.getSubCategoryByCategory(categoryid);
    }
}
