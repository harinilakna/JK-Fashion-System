package com.bit.jk_fashion_system.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.bit.jk_fashion_system.dao.GrnDao;
import com.bit.jk_fashion_system.dao.GrnStatusDao;
import com.bit.jk_fashion_system.dao.MaterialDao;
import com.bit.jk_fashion_system.dao.UserDao;
import com.bit.jk_fashion_system.entity.Grn;
import com.bit.jk_fashion_system.entity.GrnHasMaterial;
import com.bit.jk_fashion_system.entity.Material;

import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;

@Slf4j
@RestController
//class level mapping
@RequestMapping( "/grn")
public class GrnController {
    
    @Autowired //Inject designation object into dao variable
    private GrnDao grnDao; //create designation dao object

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private GrnStatusDao grnstatusDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private MaterialDao materialdao;
      
    //create mapping ui service[/material -- return material ui]
    @RequestMapping
    public ModelAndView grnUI(){

         //get logged user authontication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView viewGrn= new ModelAndView();
        //get login user name
        viewGrn.addObject("loggedUser", auth.getName());
        //change the title according to module
        viewGrn.addObject("title", "GRN Management : BIT Project 2024");
        viewGrn.setViewName("grn.html");

        
        return viewGrn;
    }

    //create get mapping for gget employee all data[material/findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<Grn>findAll(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"purchase_order");
        if(!logUserPrivi.get("select")){
            return null;
        }

        return grnDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }

    
  //create post mapping for save employee record
  @PostMapping
  public String save(@RequestBody Grn grn){
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"purchase_order");
    if(!logUserPrivi.get("insert")){
        return "Insert Not completed: You haven't Privilege";
    }  
     try{

            grn.setBalance_amount(grn.getNet_amount());
            grn.setPaid_amount(BigDecimal.valueOf(0.00));
            
          //checking unique value
        if (grn.getId() != null) {
            Grn extQR = grnDao.getReferenceById(grn.getId());
            if (extQR != null) {
                return "Save not Completed: Insert Purchase order Already exists....!";
            }
        }

      
       
        grn.setCreated_at(LocalDateTime.now());//set current date and time
          //set log user value with er connection
        //   User logedUser = userDao.getUserByUserName(auth.getName());
        //   material.setAdduser_id(logedUser);
        //   materialDao.save(material);
        
        //set log user value without er connection
        grn.setAddeduser(userDao.getUserByUserName(auth.getName()).getId());

            //material no auto generated
            String nextGrnNo = grnDao.getNextGrnCode();
            if (nextGrnNo == null || nextGrnNo.equals("")) {
                grn.setGrn_no("Grn0001");
            } else {
                grn.setGrn_no(nextGrnNo);
            }
            
         
          //we blocked the purchase order for itterative reading so we shout set the value in post


        for(GrnHasMaterial Gn : grn.getGrnHasMaterialList()){
            Gn.setGrn_id(grn);
           
            //when adding grn material Quntity
            Optional<Material> OptionalMaterial = materialdao.findById(Gn.getMaterial_id().getId());
                if (OptionalMaterial.isPresent()){
                    Material material = OptionalMaterial.get();
                    material.setUnit_price(Gn.getUnit_price());
                    log.info("material ID: {} | unit price : {}", Gn.getId(), Gn.getUnit_price() );

                    Integer currentQty = material.getAvailable_quantity();
                    Integer updatedQty = currentQty + Gn.getQuantity();

                    material.setAvailable_quantity(updatedQty);

                      log.info("currentQty: {} | updatedQty : {}",updatedQty , currentQty);

                    materialdao.save(material);
                }
        }

        grnDao.save(grn);
        

          return "OK";
      }catch (Exception e){
         return "Save Not Completed:" + e.getMessage();
      } 
    }

       //define mapping for update qr
    @PutMapping
    public String update(@RequestBody Grn grn){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"purchase_order");
        if(!logUserPrivi.get("update")){
            return "Update Not completed: You haven't Privilege";
        }  
        try{
        //checking duplicate records
        Grn extGrnId  = grnDao.getReferenceById(grn.getId());
        if(extGrnId == null){
            return "Update not Completed : quottaion request is not exist";
        }
      
   
        extGrnId.setUpdated_at(LocalDateTime.now());//set updated date and time
        extGrnId.setUpdated_user(userDao.getUserByUserName(auth.getName()).getId());

          
          //we blocked the purchase order for itterative reading so we shout set the value in post


          for(GrnHasMaterial Gn : grn.getGrnHasMaterialList()){
            Gn.setGrn_id(grn);

             //when adding grn material Quntity
            Optional<Material> OptionalMaterial = materialdao.findById(Gn.getMaterial_id().getId());
                if (OptionalMaterial.isPresent()){
                    Material material = OptionalMaterial.get();
                    material.setUnit_price(Gn.getUnit_price());
                    log.info("material ID: {} | unit price : {}", Gn.getId(), Gn.getUnit_price() );

                    Integer currentQty = material.getAvailable_quantity();
                    Integer updatedQty = currentQty + Gn.getQuantity();

                    material.setAvailable_quantity(updatedQty);

                      log.info("currentQty: {} | updatedQty : {}",updatedQty , currentQty);

                    materialdao.save(material);
                }
        }
        grnDao.save(grn);
             //check shop status
           if(grn.getGrn_status_id().getName().equals("Canceled")){
            return "GRN is canceled";
           }
          return "OK";

       }catch(Exception e){
           return "Update Not complete: " + e.getMessage();
       }
    }


    //define serve mapping for delete request
      @DeleteMapping
      public String delete(@RequestBody Grn grn){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"purchase_order");
        if(!logUserPrivi.get("delete")){
            return "Delete Not completed: You haven't Privilege";
        }  
        try{
  
            Grn extGrn = grnDao.getReferenceById(grn.getId());
        if(extGrn == null){
            return "Delete not Completed : Quotation request not Available";
        }
  
        extGrn.setGrn_status_id(grnstatusDao.getReferenceById(2));
         extGrn.setDeleted_at(LocalDateTime.now());
        grn.setDeleteduser(userDao.getUserByUserName(auth.getName()).getId());
       
        grnDao.save(extGrn);
              return "OK";
          }catch(Exception e){
              return "Delete not Completed :" + e.getMessage();
          }
      }


 @GetMapping(value="/listgrnbysupplier/{supid}" , produces = "application/json")
    public List<Grn> getAllGrnBysupplier(@PathVariable("supid")Integer supid){
    return grnDao.getGrnBySupplier(supid);
    }
 
}





