package com.bit.jk_fashion_system.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bit.jk_fashion_system.dao.DesignationDao;
import com.bit.jk_fashion_system.entity.Designation;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
public class DesignationController {
    
    @Autowired //Inject designation object into dao variable
    private DesignationDao designationDao; //create designation dao object

    @GetMapping(value="/designation/findall" , produces = "application/json")
    public List<Designation> getAllData(){
    return designationDao.findAll();
    }


     //create post mapping for save employee record
  @PostMapping(value = "/designation")
  public String saveDesignation(@RequestBody Designation designation){
          try{
         

            designationDao.save(designation);

          //need to create user account

          return "OK";
      }catch (Exception e){
         return "Save Not Completed:" + e.getMessage();
      } 
    }

    
      
}
