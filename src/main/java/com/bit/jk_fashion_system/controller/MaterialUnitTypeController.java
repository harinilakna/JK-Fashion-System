package com.bit.jk_fashion_system.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bit.jk_fashion_system.dao.MaterialUnitTypeDao;

import com.bit.jk_fashion_system.entity.MaterialUnitType;



@RestController
public class MaterialUnitTypeController {
    
    @Autowired //Inject designation object into dao variable
    private MaterialUnitTypeDao unittypeDao; //create designation dao object

    @GetMapping(value="/unittype/findall" , produces = "application/json")
    public List<MaterialUnitType> getAllData(){
    return unittypeDao.findAll();
    }
      
}
