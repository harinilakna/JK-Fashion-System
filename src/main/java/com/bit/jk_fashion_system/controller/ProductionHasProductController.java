package com.bit.jk_fashion_system.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bit.jk_fashion_system.dao.ProductionOrderHasProductDao;

import com.bit.jk_fashion_system.entity.ProductionOrderHasProduct;


@RestController
//class level mapping
@RequestMapping( "/production-has-product")
public class ProductionHasProductController {
    
    @Autowired //Inject designation object into dao variable
    private ProductionOrderHasProductDao productionHasProductDao; //create designation dao object
      

    //create get mapping for gget employee all data[material/findall]

     @GetMapping(value="/quantity",  params = {"poId", "itemId"}, produces = "application/json")
    public ProductionOrderHasProduct getProductByProductionOrder(@RequestParam("poId") int poId, @RequestParam("itemId") int itemId){
    return productionHasProductDao.getQuntityByProductAndPoId(poId, itemId);
    }

    


}
