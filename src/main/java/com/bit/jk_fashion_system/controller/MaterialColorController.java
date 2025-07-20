package com.bit.jk_fashion_system.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bit.jk_fashion_system.dao.MaterialColorDao;
import com.bit.jk_fashion_system.entity.MaterialColor;



@RestController
public class MaterialColorController {
    
    @Autowired //Inject designation object into dao variable
    private MaterialColorDao colorDao; //create designation dao object

    @GetMapping(value="/color/findall" , produces = "application/json")
    public List<MaterialColor> getAllData(){
    return colorDao.findAll();
    }
      
}
