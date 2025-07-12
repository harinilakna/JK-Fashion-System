package com.bit.jk_fashion_system.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bit.jk_fashion_system.dao.MaterialSizeDao;
import com.bit.jk_fashion_system.entity.MaterialSize;




@RestController
public class MaterialSizeController {
    
    @Autowired //Inject designation object into dao variable
    private MaterialSizeDao materialDao; //create designation dao object

    @GetMapping(value="/size/findall" , produces = "application/json")
    public List<MaterialSize> getAllData(){
    return materialDao.findAll();
    }
      
}
