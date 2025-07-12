package com.bit.jk_fashion_system.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.bit.jk_fashion_system.dao.CustomerDao;

import com.bit.jk_fashion_system.dao.UserDao;
import com.bit.jk_fashion_system.entity.Customer;
import com.bit.jk_fashion_system.entity.User;


@RestController
@RequestMapping(value = "/customer")//class level mapping
public class CustomerController {


    @Autowired //create customer dao object
    private CustomerDao customerDao;

      @Autowired
    private PrivilegeController privilegeController;

      @Autowired
    private UserDao userDao;
    
    //create mapping ui service
    @RequestMapping
    public ModelAndView customerUI(){

        //get logged user authontication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView viewCustomer= new ModelAndView();
        //get login user name
        viewCustomer.addObject("loggedUser", auth.getName());
        //change the title according to module
        viewCustomer.addObject("title", "Customer Management : BIT Project 2024");
        viewCustomer.setViewName("customer.html");

        
        return viewCustomer;
    }

    //create get mapping for get all customer details data
    @GetMapping(value = "/findall", produces = "application/json")
    public List<Customer>findAll(){
        //login user authentication and authorization
        return customerDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }

    //create post mapping for save customer record
  @PostMapping
  public String save(@RequestBody Customer customer){

     Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"customer");
        if(!logUserPrivi.get("insert")){
            return "Insert Not completed: You haven't Privilege";
        }  
      
          //checking unique value
         Customer extShopEmail = customerDao.getShopByEmail(customer.getEmail());
          if(extShopEmail != null){
              return "Save not Completed: Insert Email Already ext....!";
          }try{

          customer.setCreated_at(LocalDateTime.now());//set current date and time
          //set log user value
          User logedUser = userDao.getUserByUserName(auth.getName());
          customer.setAdduser_id(logedUser);
        
          String nextCustomerNo = customerDao.getNextCustomerCode();
         if (nextCustomerNo == null || nextCustomerNo.equals("")) {
            customer.setCode("C00001");
         } else {
            customer.setCode(nextCustomerNo);
         }
         
          customerDao.save(customer);

          return "OK";
      }catch (Exception e){
         return "Save Not Completed:" + e.getMessage();
      } 
    }

     //define mapping for update employee [/employee]
    @PutMapping
    public String update(@RequestBody Customer customer){
        
     Authentication auth = SecurityContextHolder.getContext().getAuthentication();
     HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"customer");
     if(!logUserPrivi.get("insert")){
         return "Insert Not completed: You haven't Privilege";
     } 

   

        //checking duplicate records
        Customer extCustomer = customerDao.getReferenceById(customer.getId());
        if(extCustomer == null){
            return "Update not Completed : Customer not Available";
        }try{
      
     
           customer.setUpdated_at(LocalDateTime.now());//set updated date and time
           customerDao.save(customer);
          return "OK";

       }catch(Exception e){
           return "Update Not complete: " + e.getMessage();
       }
    }

//define serve mapping for delete request
      @DeleteMapping
      public String delete(@RequestBody Customer customer){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"customer");
        if(!logUserPrivi.get("insert")){
            return "Delete Not completed: You haven't Privilege";
        }
  
         Customer extCustomer = customerDao.getReferenceById(customer.getId());
          if(extCustomer == null){
              return "Delete Not Completed :Shop is not ext...! ";
          }
          try{
  
             extCustomer.setStatus(false); //change user status into inactive
            customerDao.save(customer);
            return "OK";
           
          }catch(Exception e){
              return "Delete not Completed :" + e.getMessage();
          }
      }


}
