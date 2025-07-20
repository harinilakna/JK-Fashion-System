package com.bit.jk_fashion_system.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bit.jk_fashion_system.dao.GenderDao;
import com.bit.jk_fashion_system.entity.Gender;





@RestController
public class GenderController {
    
    @Autowired //Inject designation object into dao variable
    private GenderDao genderDao; //create designation dao object

    @GetMapping(value="/gender/findall" , produces = "application/json")
    public List<Gender> getAllData(){
    return genderDao.findAll();
    }
      
}
