package com.bit.jk_fashion_system.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bit.jk_fashion_system.dao.PaymentTypeDao;
import com.bit.jk_fashion_system.entity.PaymentType;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
public class PaymentTypeController {
    
    @Autowired //Inject designation object into dao variable
    private PaymentTypeDao paymentTypeDao; //create designation dao object

    @GetMapping(value="/paymentType/findall" , produces = "application/json")
    public List<PaymentType> getAllData(){
    return paymentTypeDao.findAll();
    }


     //create post mapping for save employee record
  @PostMapping(value = "/paymentType")
  public String saveDesignation(@RequestBody PaymentType paymentType){
          try{
         

            paymentTypeDao.save(paymentType);

          //need to create user account

          return "OK";
      }catch (Exception e){
         return "Save Not Completed:" + e.getMessage();
      } 
    }

    
      
}
