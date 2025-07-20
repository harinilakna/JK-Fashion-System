package com.bit.jk_fashion_system.controller;

import java.util.List;
import java.util.Optional;

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

import com.bit.jk_fashion_system.dao.ProductDao;
import com.bit.jk_fashion_system.dao.SalesDao;
import com.bit.jk_fashion_system.dao.SalesStatusDao;
import com.bit.jk_fashion_system.dao.UserDao;
import com.bit.jk_fashion_system.entity.Product;
import com.bit.jk_fashion_system.entity.SaleHasProducts;
import com.bit.jk_fashion_system.entity.Sales;

import lombok.extern.slf4j.Slf4j;


import java.time.LocalDateTime;
import java.util.HashMap;

@Slf4j
@RestController
//class level mapping
@RequestMapping( "/sales")
public class SalesController {
    
    @Autowired //Inject designation object into dao variable
    private SalesDao saleDao; //create designation dao object

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private SalesStatusDao saleStatusDao;

    @Autowired
    private UserDao userDao;

      @Autowired
      private ProductDao productDao;

      
    //create mapping ui service[/material -- return material ui]
    @RequestMapping
    public ModelAndView salesUI(){

         //get logged user authontication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView viewSales= new ModelAndView();
        //get login user name
        viewSales.addObject("loggedUser", auth.getName());
        //change the title according to module
        viewSales.addObject("title", "Sales & Order Management : BIT Project 2024");
        viewSales.setViewName("sales.html");

        
        return viewSales;
    }

    //create get mapping for gget employee all data[material/findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<Sales>findAll(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"sales");
        if(!logUserPrivi.get("select")){
            return null;
        }

        return saleDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }

    
  //create post mapping for save employee record
  @PostMapping
  public String save(@RequestBody Sales sale){
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"sales");
    if(!logUserPrivi.get("insert")){
        return "Insert Not completed: You haven't Privilege";
    }  
     try{
          //checking unique value
        if (sale.getId() != null) {
            Sales extSale = saleDao.getReferenceById(sale.getId());
            if (extSale != null) {
                return "Save not Completed: Insert Sales Already exists....!";
            }
        }
       
        sale.setCreated_at(LocalDateTime.now());//set current date and time
          //set log user value with er connection
        //   User logedUser = userDao.getUserByUserName(auth.getName());
        //   material.setAdduser_id(logedUser);
        //   materialDao.save(material);
        
        //set log user value without er connection
        sale.setAdded_user(userDao.getUserByUserName(auth.getName()).getId());

            //material no auto generated
            String nextSaleNo = saleDao.getNextSaleCode();
            if (nextSaleNo == null || nextSaleNo.equals("")) {
                sale.setInvoice_no("S00001");
            } else {
                sale.setInvoice_no(nextSaleNo);
            }
            
         
          //we blocked the purchase order for itterative reading so we shout set the value in post


        for(SaleHasProducts shp : sale.getSaleHasProductList()){


            shp.setSales_id(sale);

            //  Product extitemStock = productRepository.getByProduct(itemDetails.getId());

            // if (extitemStock != null) { // if a stock is already there
            //     Integer availableQty = extitemStock.getAvailableQty();
            //     if (availableQty != null){
            //         extitemStock.setAvailableQty(extitemStock.getAvailableQty() + (production.getQuantity()));
            //     }

            //     // save material stock dao
            //     productRepository.save(extitemStock);

              Optional<Product> OptionProduct = productDao.findById(shp.getProduct_id().getId());
                if (OptionProduct.isPresent()){
                    Product product = OptionProduct.get();

                    Integer availableQuantity = product.getAvailable_quantity();
                    Integer quantity = shp.getQuantity();

                    Integer totalAvailableQyt = availableQuantity - quantity;
                    product.setAvailable_quantity(totalAvailableQyt);
                    
                    Product savedProductQty = productDao.save(product);

                    log.info("product ID: {} | Updated Quantity : {}", savedProductQty.getCode(), savedProductQty.getAvailable_quantity() );
                }
        }

        saleDao.save(sale);

      
          return "OK";
      }catch (Exception e){
         return "Save Not Completed:" + e.getMessage();
      } 
    }

       //define mapping for update qr
    @PutMapping
    public String update(@RequestBody Sales sale){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"sales");
        if(!logUserPrivi.get("update")){
            return "Update Not completed: You haven't Privilege";
        }  
        try{
        //checking duplicate records
        Sales extSaleId  = saleDao.getReferenceById(sale.getId());
        if(extSaleId == null){
            return "Update not Completed : sale is not exist";
        }
      
   
        extSaleId.setUpdated_at(LocalDateTime.now());//set updated date and time
        extSaleId.setUpdated_user(userDao.getUserByUserName(auth.getName()).getId());

          
          //we blocked the purchase order for itterative reading so we shout set the value in post


           for(SaleHasProducts shp : sale.getSaleHasProductList()){
            shp.setSales_id(sale);

              Optional<Product> OptionProduct = productDao.findById(shp.getProduct_id().getId());
                if (OptionProduct.isPresent()){
                    Product product = OptionProduct.get();

                    Integer availableQuantity = product.getAvailable_quantity();
                    Integer quantity = shp.getQuantity();

                    Integer totalAvailableQyt = availableQuantity - quantity;
                    product.setAvailable_quantity(totalAvailableQyt);
                    
                    Product savedProductQty = productDao.save(product);

                    log.info("product ID: {} | Updated Quantity : {}", savedProductQty.getCode(), savedProductQty.getAvailable_quantity() );
                }
        }
      
        saleDao.save(sale);
             //check shop status
           if(sale.getSales_status_id().getName().equals("Deleted")){
            return "GRN is canceled";
           }
          return "OK";

       }catch(Exception e){
           return "Update Not complete: " + e.getMessage();
       }
    }


    //define serve mapping for delete request
      @DeleteMapping
      public String delete(@RequestBody Sales sale){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"sales");
        if(!logUserPrivi.get("delete")){
            return "Delete Not completed: You haven't Privilege";
        }  
        try{
  
         Sales extSaleId  = saleDao.getReferenceById(sale.getId());
        if(extSaleId == null){
            return "Delete not Completed : sale is not exist";
        }
      
  
        extSaleId.setSales_status_id(saleStatusDao.getReferenceById(3));
        sale.setDeleted_user(userDao.getUserByUserName(auth.getName()).getId());
        extSaleId.setDeleted_at(LocalDateTime.now());
        saleDao.save(extSaleId);
              return "OK";
          }catch(Exception e){
              return "Delete not Completed :" + e.getMessage();
          }
      }

 
}





