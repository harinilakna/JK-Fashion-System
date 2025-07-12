package com.bit.jk_fashion_system.controller;

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
import com.bit.jk_fashion_system.dao.SupplierDao;
import com.bit.jk_fashion_system.dao.SupplierStatusDao;
import com.bit.jk_fashion_system.dao.UserDao;
import com.bit.jk_fashion_system.entity.Supplier;

import java.time.LocalDateTime;
import java.util.HashMap;

@RestController
//class level mapping
@RequestMapping( "/supplier")
public class SupplierController {
    
    @Autowired //Inject designation object into dao variable
    private SupplierDao supplierDao; //create designation dao object

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private SupplierStatusDao supplierStatusDao;

    @Autowired
    private UserDao userDao;
      
    //create mapping ui service[/material -- return material ui]
    @RequestMapping
    public ModelAndView supplierUI(){

         //get logged user authontication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView viewSup= new ModelAndView();
        //get login user name
        viewSup.addObject("loggedUser", auth.getName());
        //change the title according to module
        viewSup.addObject("title", "Supplier Management : BIT Project 2023");
        viewSup.setViewName("supplier.html");

        
        return viewSup;
    }

    //create get mapping for gget employee all data[material/findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<Supplier>findAll(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"supplier");
        if(!logUserPrivi.get("select")){
            return null;
        }

        return supplierDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }

    
  //create post mapping for save employee record
  @PostMapping
  public String save(@RequestBody Supplier supplier){
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"supplier");
    if(!logUserPrivi.get("insert")){
        return "Insert Not completed: You haven't Privilege";
    }  
     try{
          //checking unique value
        if (supplier.getId() != null) {
            Supplier extSupplier = supplierDao.getReferenceById(supplier.getId());
            if (extSupplier != null) {
                return "Save not Completed: Insert Supplier Already exists....!";
            }
        }
       
        supplier.setCreated_at(LocalDateTime.now());//set current date and time
          //set log user value with er connection
        //   User logedUser = userDao.getUserByUserName(auth.getName());
        //   material.setAdduser_id(logedUser);
        //   materialDao.save(material);
        
        //set log user value without er connection
        supplier.setAddeduser(userDao.getUserByUserName(auth.getName()).getId());

            //material no auto generated
         String nextSupplierNo = supplierDao.getNextSupNo();
         if (nextSupplierNo == null || nextSupplierNo.equals("")) {
            supplier.setSupno("Sup001");
         } else {
            supplier.setSupno(nextSupplierNo);
         }
         

         supplierDao.save(supplier);
        

          return "OK";
      }catch (Exception e){
         return "Save Not Completed:" + e.getMessage();
      } 
    }

       //define mapping for update employee [/employee]
    @PutMapping
    public String update(@RequestBody Supplier supplier){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"supplier");
        if(!logUserPrivi.get("update")){
            return "Update Not completed: You haven't Privilege";
        }  
        try{
        //checking duplicate records
        Supplier extSupplierId  = supplierDao.getReferenceById(supplier.getId());
        if(extSupplierId == null){
            return "Update not Completed : Material not Available";
        }
      
   
        supplier.setUpdated_at(LocalDateTime.now());//set updated date and time
        supplier.setUpdateduser(userDao.getUserByUserName(auth.getName()).getId());
        supplierDao.save(supplier);
             //check shop status
           if(supplier.getSupplier_status_id().getName().equals("In-Active")){
            return "Supplier is Not Active";
           }
          return "OK";

       }catch(Exception e){
           return "Update Not complete: " + e.getMessage();
       }
    }

//define serve mapping for delete request
      @DeleteMapping
      public String delete(@RequestBody Supplier supplier){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"supplier");
        if(!logUserPrivi.get("delete")){
            return "Delete Not completed: You haven't Privilege";
        }  
        try{
  
            Supplier extSupplier  = supplierDao.getReferenceById(supplier.getId());
        if(extSupplier == null){
            return "Delete not Completed : Material not Available";
        }
  
        extSupplier.setSupplier_status_id(supplierStatusDao.getReferenceById(2));
        supplier.setDeleteduser(userDao.getUserByUserName(auth.getName()).getId());
            extSupplier.setDeleted_at(LocalDateTime.now());
            supplierDao.save(extSupplier);
              return "OK";
          }catch(Exception e){
              return "Delete not Completed :" + e.getMessage();
          }
      }



}
