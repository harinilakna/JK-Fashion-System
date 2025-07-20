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


import com.bit.jk_fashion_system.dao.ProductionOrderDao;
import com.bit.jk_fashion_system.dao.ProductionOrderStatusDao;

import com.bit.jk_fashion_system.dao.UserDao;
import com.bit.jk_fashion_system.entity.ProductionOrder;
import com.bit.jk_fashion_system.entity.ProductionOrderHasMaterial;
import com.bit.jk_fashion_system.entity.ProductionOrderHasProduct;



import java.time.LocalDateTime;
import java.util.HashMap;

@RestController
//class level mapping
@RequestMapping( "/production-order")
public class ProductionOrderController {
    
    @Autowired //Inject designation object into dao variable
    private ProductionOrderDao proDao; //create designation dao object

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private ProductionOrderStatusDao prostatusDao;

    @Autowired
    private UserDao userDao;
      
    //create mapping ui service[/material -- return material ui]
    @RequestMapping
    public ModelAndView productionOrderUI(){

         //get logged user authontication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView viewPo= new ModelAndView();
        //get login user name
        viewPo.addObject("loggedUser", auth.getName());
        //change the title according to module
        viewPo.addObject("title", "Production Order Management : BIT Project 2024");
        viewPo.setViewName("productionOrder.html");

        
        return viewPo;
    }

    //create get mapping for gget employee all data[material/findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<ProductionOrder>findAll(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"production_order ");
        if(!logUserPrivi.get("select")){
            return null;
        }

        return proDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }

    
  //create post mapping for save employee record
  @PostMapping
  public String save(@RequestBody ProductionOrder prductionOrder){
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"production_order");
    if(!logUserPrivi.get("insert")){
        return "Insert Not completed: You haven't Privilege";
    }  
     try{
          //checking unique value
        if (prductionOrder.getId() != null) {
            ProductionOrder extQR = proDao.getReferenceById(prductionOrder.getId());
            if (extQR != null) {
                return "Save not Completed: Insert Purchase order Already exists....!";
            }
        }
       
        prductionOrder.setCreated_at(LocalDateTime.now());//set current date and time
          //set log user value with er connection
        //   User logedUser = userDao.getUserByUserName(auth.getName());
        //   material.setAdduser_id(logedUser);
        //   materialDao.save(material);
        
        //set log user value without er connection
        prductionOrder.setCreated_user(userDao.getUserByUserName(auth.getName()).getId());

            //material no auto generated
         String nextCode = proDao.getNextCode();
         if (nextCode == null || nextCode.equals("")) {
            prductionOrder.setCode("ORDER0001");
         } else {
            prductionOrder.setCode(nextCode);
         }
         
          //we blocked the purchase order for itterative reading so we shout set the value in post


        for(ProductionOrderHasProduct PO : prductionOrder.getProductionOrderProductList()){
              PO.setCompleted_quantity(0);
            PO.setProduction_order_id(prductionOrder);
        }

        proDao.save(prductionOrder);

        for(ProductionOrderHasMaterial PM : prductionOrder.getProductionOrderMaterialtList()){
            PM.setProduction_order_id(prductionOrder);
        }

        proDao.save(prductionOrder);

        

          return "OK";
      }catch (Exception e){
         return "Save Not Completed:" + e.getMessage();
      } 
    }

       //define mapping for update qr
    @PutMapping
    public String update(@RequestBody ProductionOrder prductionOrder){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"production_order");
        if(!logUserPrivi.get("update")){
            return "Update Not completed: You haven't Privilege";
        }  
        try{
        //checking duplicate records
        ProductionOrder extQrId  = proDao.getReferenceById(prductionOrder.getId());
        if(extQrId == null){

            return "Update not Completed : production order is not exist";
        }
      
   
        prductionOrder.setUpdated_at(LocalDateTime.now());//set updated date and time
        prductionOrder.setUpdated_user(userDao.getUserByUserName(auth.getName()).getId());

          
          //we blocked the purchase order for itterative reading so we shout set the value in post
           for(ProductionOrderHasProduct PO : prductionOrder.getProductionOrderProductList()){

             PO.setCompleted_quantity(0);
            PO.setProduction_order_id(prductionOrder);
        }

        proDao.save(prductionOrder);

        for(ProductionOrderHasMaterial PM : prductionOrder.getProductionOrderMaterialtList()){
            PM.setProduction_order_id(prductionOrder);
        }

        proDao.save(prductionOrder);

             //check shop status
           if(prductionOrder.getProduction_order_status_id().getName().equals("Deleted")){
            return "Production Order is canceled";
           }
          return "OK";

       }catch(Exception e){
           return "Update Not complete: " + e.getMessage();
       }
    }


    //define serve mapping for delete request
      @DeleteMapping
      public String delete(@RequestBody ProductionOrder prductionOrder){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"production_order");
        if(!logUserPrivi.get("delete")){
            return "Delete Not completed: You haven't Privilege";
        }  
        try{
  
            ProductionOrder extQR  = proDao.getReferenceById(prductionOrder.getId());
        if(extQR == null){
            return "Delete not Completed";
        }
  
        extQR.setProduction_order_status_id(prostatusDao.getReferenceById(7));
        prductionOrder.setDeleted_user(userDao.getUserByUserName(auth.getName()).getId());
        extQR.setDeleted_at(LocalDateTime.now());
        proDao.save(extQR);
              return "OK";
          }catch(Exception e){
              return "Delete not Completed :" + e.getMessage();
          }
      }


//  @GetMapping(value="/listPObysupplier/{supid}" , produces = "application/json")
//     public List<PurchaseOrder> getAllPoDataBysupplier(@PathVariable("supid")Integer supid){
//     return poDao.getPurchaseOrderBySupplier(supid);
//     }

    @GetMapping(value="/productionOrderByApproved" , produces = "application/json")
    public List<ProductionOrder> getAllApprovedProduction(){
    return proDao.getApprovedProductionOrders();
    }


}
