package com.bit.jk_fashion_system.controller;

import java.util.List;
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

import com.bit.jk_fashion_system.dao.PoStatusDao;
import com.bit.jk_fashion_system.dao.PurchaseOrderDao;
import com.bit.jk_fashion_system.dao.UserDao;
import com.bit.jk_fashion_system.entity.PurchaseOrder;
import com.bit.jk_fashion_system.entity.PurchaseOrderHasMaterial;


import java.time.LocalDateTime;
import java.util.HashMap;

@RestController
//class level mapping
@RequestMapping( "/purchaseorder")
public class PurchaseOrderController {
    
    @Autowired //Inject designation object into dao variable
    private PurchaseOrderDao poDao; //create designation dao object

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private PoStatusDao postatusDao;

    @Autowired
    private UserDao userDao;
      
    //create mapping ui service[/material -- return material ui]
    @RequestMapping
    public ModelAndView purchaseOrderUI(){

         //get logged user authontication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView viewPo= new ModelAndView();
        //get login user name
        viewPo.addObject("loggedUser", auth.getName());
        //change the title according to module
        viewPo.addObject("title", "Purchase Order Management : BIT Project 2024");
        viewPo.setViewName("purchaseOrder.html");

        
        return viewPo;
    }

    //create get mapping for gget employee all data[material/findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<PurchaseOrder>findAll(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"purchase_order");
        if(!logUserPrivi.get("select")){
            return null;
        }

        return poDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }

    
  //create post mapping for save employee record
  @PostMapping
  public String save(@RequestBody PurchaseOrder porder){
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"purchase_order");
    if(!logUserPrivi.get("insert")){
        return "Insert Not completed: You haven't Privilege";
    }  
     try{
          //checking unique value
        if (porder.getId() != null) {
            PurchaseOrder extQR = poDao.getReferenceById(porder.getId());
            if (extQR != null) {
                return "Save not Completed: Insert Purchase order Already exists....!";
            }
        }
       
        porder.setCreated_at(LocalDateTime.now());//set current date and time
          //set log user value with er connection
        //   User logedUser = userDao.getUserByUserName(auth.getName());
        //   material.setAdduser_id(logedUser);
        //   materialDao.save(material);
        
        //set log user value without er connection
        porder.setAddeduser(userDao.getUserByUserName(auth.getName()).getId());

            //material no auto generated
         String nextQRNo = poDao.getNextQRCode();
         if (nextQRNo == null || nextQRNo.equals("")) {
            porder.setCode("PO00001");
         } else {
            porder.setCode(nextQRNo);
         }
         
          //we blocked the purchase order for itterative reading so we shout set the value in post


        for(PurchaseOrderHasMaterial PO : porder.getPorderHasMaterialList()){
            PO.setPurchase_order_id(porder);
        }

        poDao.save(porder);
        

          return "OK";
      }catch (Exception e){
         return "Save Not Completed:" + e.getMessage();
      } 
    }

       //define mapping for update qr
    @PutMapping
    public String update(@RequestBody PurchaseOrder porder){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"purchase_order");
        if(!logUserPrivi.get("update")){
            return "Update Not completed: You haven't Privilege";
        }  
        try{
        //checking duplicate records
        PurchaseOrder extQrId  = poDao.getReferenceById(porder.getId());
        if(extQrId == null){
            return "Update not Completed : quottaion request is not exist";
        }
    
   
        porder.setUpdated_at(LocalDateTime.now());//set updated date and time
        porder.setUpdated_user(userDao.getUserByUserName(auth.getName()).getId());

          
          //we blocked the purchase order for itterative reading so we shout set the value in post


          for(PurchaseOrderHasMaterial PO : porder.getPorderHasMaterialList()){
            PO.setPurchase_order_id(porder);
        }
        poDao.save(porder);
             //check shop status
           if(porder.getPurchase_order_status_id().getName().equals("Cancel")){
            return "Quotation request is canceled";
           }
          return "OK";

       }catch(Exception e){
           return "Update Not complete: " + e.getMessage();
       }
    
    }


    //define serve mapping for delete request
      @DeleteMapping
      public String delete(@RequestBody PurchaseOrder porder){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"purchase_order");
        if(!logUserPrivi.get("delete")){
            return "Delete Not completed: You haven't Privilege";
        }  
        try{
  
            PurchaseOrder extQR  = poDao.getReferenceById(porder.getId());
        if(extQR == null){
            return "Delete not Completed";
        }
  
        extQR.setPurchase_order_status_id(postatusDao.getReferenceById(2));
        porder.setDeleteduser(userDao.getUserByUserName(auth.getName()).getId());
        extQR.setDeleted_at(LocalDateTime.now());
        poDao.save(extQR);
              return "OK";
          }catch(Exception e){
              return "Delete not Completed :" + e.getMessage();
          }
      }


 @GetMapping(value="/listPObysupplier/{supid}" , produces = "application/json")
    public List<PurchaseOrder> getAllPoDataBysupplier(@PathVariable("supid")Integer supid){
    return poDao.getPurchaseOrderBySupplier(supid);
    }


}
