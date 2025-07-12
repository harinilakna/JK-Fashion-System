package com.bit.jk_fashion_system.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


import com.bit.jk_fashion_system.dao.SizeDao;
import com.bit.jk_fashion_system.entity.Size;





@RestController
public class SizeController {
    
    @Autowired //Inject designation object into dao variable
    private SizeDao sizeDao; //create designation dao object

    @GetMapping(value="/productsize/findall" , produces = "application/json")
    public List<Size> getAllData(){
    return sizeDao.findAll();
    }
      
}
