package com.bit.jk_fashion_system.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bit.jk_fashion_system.dao.ProductionOrderStatusDao;
import com.bit.jk_fashion_system.entity.ProductionOrderStatus;


@RestController
public class ProductionOrderStatusController {

     @Autowired //Inject designation object into dao variable
    private ProductionOrderStatusDao productionorderStatusDao; //create designation dao object

    @GetMapping(value="/productionorderstatus/findall" , produces = "application/json")
    public List<ProductionOrderStatus> getAllData(){
    return productionorderStatusDao.findAll();
    }
      
      
}

