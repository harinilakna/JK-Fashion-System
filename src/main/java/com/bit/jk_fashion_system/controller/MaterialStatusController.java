package com.bit.jk_fashion_system.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bit.jk_fashion_system.dao.MaterialStatusDao;
import com.bit.jk_fashion_system.entity.MaterialStatus;




@RestController
public class MaterialStatusController {
    
    @Autowired //Inject designation object into dao variable
    private MaterialStatusDao materialStatusDao; //create designation dao object

    @GetMapping(value="/materialstatus/findall" , produces = "application/json")
    public List<MaterialStatus> getAllData(){
    return materialStatusDao.findAll();
    }
      
}

