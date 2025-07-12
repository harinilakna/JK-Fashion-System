package com.bit.jk_fashion_system.controller;

import java.time.LocalDateTime;
import java.util.HashMap;

import com.bit.jk_fashion_system.dao.MaterialDao;
import com.bit.jk_fashion_system.entity.Material;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import com.bit.jk_fashion_system.dao.ProductionOrderDao;
import com.bit.jk_fashion_system.dao.UserDao;
import com.bit.jk_fashion_system.entity.ProductionOrder;
import com.bit.jk_fashion_system.entity.ProductionOrderHasMaterial;
import com.bit.jk_fashion_system.entity.ProductionOrderHasProduct;



@Slf4j
@RestController
//class level mapping
@RequestMapping( "/productionorderconfirm")
public class ProductionOrderConfirmController {
    
    @Autowired //Inject designation object into dao variable
    private ProductionOrderDao proDao; //create designation dao object

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private MaterialDao materialDao;
      

    @RequestMapping
    public ModelAndView purchaseOrderUI(){

         //get logged user authontication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView viewPo= new ModelAndView();
        //get login user name
        viewPo.addObject("loggedUser", auth.getName());
        //change the title according to module
        viewPo.addObject("title", "Production Order Confirmation Management : BIT Project 2024");
        viewPo.setViewName("productionOrderConfirm.html");

        
        return viewPo;
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
        //check exisiting and duplicate
        ProductionOrder extQrId  = proDao.getReferenceById(prductionOrder.getId());
        if(extQrId == null){
            return "Update not Completed : production order is not exist";
        }

        prductionOrder.setUpdated_at(LocalDateTime.now());//set updated date and time
        prductionOrder.setUpdated_user(userDao.getUserByUserName(auth.getName()).getId());

        // inner list eke thyena object ekakata one by one by main object eka set kra
            for (ProductionOrderHasProduct productionOrderHasProduct : prductionOrder.getProductionOrderProductList()){
                productionOrderHasProduct.setProduction_order_id(prductionOrder);
            }

            // inner list eke thyena object ekakata one by one by main object eka set kra
            for (ProductionOrderHasMaterial productionOrderHasMaterial : prductionOrder.getProductionOrderMaterialtList()){
                productionOrderHasMaterial.setProduction_order_id(prductionOrder);
            }

            ProductionOrder savedProOrder = proDao.save(prductionOrder);
            log.info("saved production order status : {}", savedProOrder.getProduction_order_status_id().getName());

            // need to down the inventoty
            if (savedProOrder.getProduction_order_status_id().getId() == 3) {


                log.info("coming to id statement");
                log.info("coming list : {}", prductionOrder.getProductionOrderMaterialtList());

                for (ProductionOrderHasMaterial productionOrderHasMaterial : prductionOrder.getProductionOrderMaterialtList()) {
                    Material material = materialDao.getReferenceById(productionOrderHasMaterial.getMaterial_id().getId());
                    log.info("material");

                    Integer exMaterialStock = material.getAvailable_quantity();
                    material.setAvailable_quantity(exMaterialStock - productionOrderHasMaterial.getRequired_quantity());

                    log.info("material qtys : existQty {} | requiredQty {}",exMaterialStock, productionOrderHasMaterial.getRequired_quantity());

                    // save material stock dao
                    materialDao.save(material);
                    log.info("new quantity : {}", material.getAvailable_quantity() );
                }

            }
          return "OK";

       }catch(Exception e){
           return "Update Not complete: " + e.getMessage();
       }
    }

}
