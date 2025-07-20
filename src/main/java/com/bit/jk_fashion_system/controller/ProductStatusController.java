package com.bit.jk_fashion_system.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bit.jk_fashion_system.dao.ProductStatusDao;
import com.bit.jk_fashion_system.entity.ProductStatus;




@RestController
public class ProductStatusController {
    
    @Autowired //Inject designation object into dao variable
    private ProductStatusDao productStatusDao; //create designation dao object

    @GetMapping(value="/productstatus/findall" , produces = "application/json")
    public List<ProductStatus> getAllData(){
    return productStatusDao.findAll();
    }
      
}

