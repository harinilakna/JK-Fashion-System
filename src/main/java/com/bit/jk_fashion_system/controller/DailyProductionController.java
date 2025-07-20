package com.bit.jk_fashion_system.controller;

import java.util.List;


import com.bit.jk_fashion_system.dao.*;
import com.bit.jk_fashion_system.entity.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;


import java.time.LocalDateTime;
import java.util.HashMap;
@Slf4j
@RestController
//class level mapping
@RequestMapping( "/dailyproduction")
public class DailyProductionController {
    
    @Autowired //Inject designation object into dao variable
    private DailyProductionDao dailyPoDao; //create designation dao object

    @Autowired
    private PrivilegeController privilegeController;

    // @Autowired
    // private UserDao userDao;

    @Autowired
    private ProductDao productDao;

    @Autowired
    private ProductionOrderDao productionOrderDao;

    @Autowired
    private DailyProductionDao dailyProductionDao;

    @Autowired
    private ProductionOrderStatusDao productionOrderStatusDao;

     @Autowired
     private ProductStatusDao productstatusDao;
      
    //create mapping ui service[/material -- return material ui]
    @RequestMapping
    public ModelAndView dailyProductionOrderUI(){

         //get logged user authontication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView viewPo= new ModelAndView();
        //get login user name
        viewPo.addObject("loggedUser", auth.getName());
        //change the title according to module
        viewPo.addObject("title", "Daily production Order Management : BIT Project 2024");
        viewPo.setViewName("dailyProduction.html");

        
        return viewPo;
    }

    //create get mapping for gget employee all data[material/findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<DailyProduction>findAll(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"production_order");
        if(!logUserPrivi.get("select")){
            return null;
        }

        return dailyPoDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }

    
  //create post mapping for save employee record
  @PostMapping
  public String save(@RequestBody DailyProduction production) {


        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
      HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "production_order");
      if (!logUserPrivi.get("insert")) {
          return "Insert Not completed: You haven't Privilege";
      }

      try {
          // item, production order
          Product itemDetails = productDao.getReferenceById(production.getProduct_id().getId());
          ProductionOrder productionOrder = productionOrderDao.getReferenceById(production.getProduction_order_id().getId());
          dailyProductionDao.save(production);

          Boolean completeState = true;
          // prohasid eke completed qty up wena eka
          for (ProductionOrderHasProduct pohid : productionOrder.getProductionOrderProductList()) {
              if (pohid.getProduct_id().getId() == itemDetails.getId()) {
                  pohid.setCompleted_quantity(pohid.getCompleted_quantity() + production.getQuantity());
              }
              if (pohid.getOrder_quantity() != pohid.getCompleted_quantity()) {
                  completeState = false;
              }

              pohid.setProduction_order_id(productionOrder);
          }

          // status change krnwa
          if (completeState) {
              productionOrder.setProduction_order_status_id(productionOrderStatusDao.getReferenceById(6)); // completed
          } else {
              productionOrder.setProduction_order_status_id(productionOrderStatusDao.getReferenceById(2)); // In Production
          }

          // inner list eke thyena object ekakata one by one by main object eka set kra
          for (ProductionOrderHasMaterial prorderhasMat : productionOrder.getProductionOrderMaterialtList()) {
              prorderhasMat.setProduction_order_id(productionOrder);

          }

          productionOrderDao.save(productionOrder);

      

          //*Means it's an internal order */
          // item stock eka up wena eka
         Product extitemStock = productDao.getByProduct(itemDetails.getId());
       
          if (extitemStock != null ) {
                 // if a stock is already there // if need to check empty is empty
                //  Product product = extitemStock.get();
              Integer availableQty = extitemStock.getAvailable_quantity();
              if (availableQty != null) {
                  extitemStock.setAvailable_quantity(extitemStock.getAvailable_quantity() + (production.getQuantity()));
                  extitemStock.setProduct_status_id(productstatusDao.getReferenceById(1));

              
              }

              // save material stock dao
              productDao.save(extitemStock);
          }
          production.setCreated_at(LocalDateTime.now());
          return "OK";
      } catch (Exception e) {
          return "Save Not Completed:" + e.getMessage();
      }
  }


 @PutMapping
public String update(@RequestBody DailyProduction production) {

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "production_order");
    if (!logUserPrivi.get("update")) {
        return "Update Not Completed: You haven't Privilege";
    }

    try {
        // Fetch the existing production record
        DailyProduction existingProduction = dailyProductionDao.getReferenceById(production.getId());

        // Calculate quantity difference
        int oldQuantity = existingProduction.getQuantity();  // Previously saved quantity
        int newQuantity = production.getQuantity();          // Newly updated quantity
        int quantityDiff = newQuantity - oldQuantity;        // Difference (+/-)

        // Fetch related entities
        Product itemDetails = productDao.getReferenceById(production.getProduct_id().getId());
        ProductionOrder productionOrder = productionOrderDao.getReferenceById(production.getProduction_order_id().getId());

        // Save updated production record
        production.setCreated_at(existingProduction.getCreated_at()); // Keep original created_at
        dailyProductionDao.save(production);

        boolean completeState = true;

        // Update completed quantity in production order
        for (ProductionOrderHasProduct pohid : productionOrder.getProductionOrderProductList()) {
            if (pohid.getProduct_id().getId() == itemDetails.getId()) {
                int updatedCompletedQty = pohid.getCompleted_quantity() + quantityDiff;
                pohid.setCompleted_quantity(updatedCompletedQty < 0 ? 0 : updatedCompletedQty); // Prevent negative
            }

            if (!pohid.getOrder_quantity().equals(pohid.getCompleted_quantity())) {
                completeState = false;
            }

            pohid.setProduction_order_id(productionOrder);
        }

        // Set production order status
        if (completeState) {
            productionOrder.setProduction_order_status_id(productionOrderStatusDao.getReferenceById(6)); // Completed
        } else {
            productionOrder.setProduction_order_status_id(productionOrderStatusDao.getReferenceById(2)); // In Production
        }

        // Bind materials to production order
        for (ProductionOrderHasMaterial prorderhasMat : productionOrder.getProductionOrderMaterialtList()) {
            prorderhasMat.setProduction_order_id(productionOrder);
        }

        productionOrderDao.save(productionOrder);

        // Update available quantity in stock
        Product extitemStock = productDao.getByProduct(itemDetails.getId());
        if (extitemStock != null) {
            Integer availableQty = extitemStock.getAvailable_quantity();
            if (availableQty != null) {
                int updatedAvailableQty = availableQty + quantityDiff;
                extitemStock.setAvailable_quantity(updatedAvailableQty < 0 ? 0 : updatedAvailableQty); // Prevent negative
                extitemStock.setProduct_status_id(productstatusDao.getReferenceById(1));
            }
            productDao.save(extitemStock);
        }

        return "OK";

    } catch (Exception e) {
        return "Save Not Completed: " + e.getMessage();
    }
}


}










