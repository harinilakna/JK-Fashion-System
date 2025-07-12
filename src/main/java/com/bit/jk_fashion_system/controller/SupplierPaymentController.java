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
import com.bit.jk_fashion_system.entity.Grn;

import com.bit.jk_fashion_system.dao.GrnDao;
import com.bit.jk_fashion_system.dao.SupplierPaymentDao;
import com.bit.jk_fashion_system.entity.SupplierPayment;
import com.bit.jk_fashion_system.entity.SupplierPaymentHasGrn;

import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;

@Slf4j
@RestController
//class level mapping
@RequestMapping( "/supplierpayment")
public class SupplierPaymentController {
    
    @Autowired //Inject designation object into dao variable
    private SupplierPaymentDao supPaymentDao; //create designation dao object

    @Autowired
    private PrivilegeController privilegeController;

    
    @Autowired
    private GrnDao grnDao;
    

    // @Autowired
    // private UserDao userDao;
      
    //create mapping ui service[/material -- return material ui]
    @RequestMapping
    public ModelAndView SupplierPaymentUI(){

         //get logged user authontication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView viewPo= new ModelAndView();
        //get login user name
        viewPo.addObject("loggedUser", auth.getName());
        //change the title according to module
        viewPo.addObject("title", "Supplier Payment Management : BIT Project 2024");
        viewPo.setViewName("supplierPayment.html");

        
        return viewPo;
    }

    //create get mapping for gget employee all data[material/findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<SupplierPayment>findAll(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"supplier_payment");
        if(!logUserPrivi.get("select")){
            return null;
        }

        return supPaymentDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }

    
  //create post mapping for save employee record
  @PostMapping
  public String save(@RequestBody SupplierPayment supplierpayment){
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"supplier_payment");
    if(!logUserPrivi.get("insert")){
        return "Insert Not completed: You haven't Privilege";
    }  
     try{
          //checking unique value
        if (supplierpayment.getId() != null) {
            SupplierPayment extQR = supPaymentDao.getReferenceById(supplierpayment.getId());
            if (extQR != null) {
                return "Save not Completed: Insert Purchase order Already exists....!";
            }
        }
       
        supplierpayment.setCreated_at(LocalDateTime.now());//set current date and time
          //set log user value with er connection
        //   User logedUser = userDao.getUserByUserName(auth.getName());
        //   material.setAdduser_id(logedUser);
        //   materialDao.save(material);
        
        //set log user value without er connection
        // suppayment.setAddeduser(userDao.getUserByUserName(auth.getName()).getId());

            //material no auto generated
        //  String nextSupBilNo = supPaymentDao.getNextQRCode();
        //  if (nextSupBilNo == null || nextSupBilNo.equals("")) {
        //     suppayment.setBil_no("Sup00001");
        //  } else {
        //     suppayment.setCode(nextSupBilNo);
        //  }
         
          //we blocked the purchase order for itterative reading so we shout set the value in post


        for(SupplierPaymentHasGrn supPayHasGrn : supplierpayment.getSupplierPaymentHasGrnList()){
            supPayHasGrn.setSupplier_payment_id(supplierpayment);

                Optional<Grn> OptionGrn = grnDao.findById(supPayHasGrn.getGrn_id().getId());
                if (OptionGrn.isPresent()){
                    Grn grn = OptionGrn.get();
                    grn.setBalance_amount(supPayHasGrn.getBalance_amount());

                    BigDecimal totalNetAmount = grn.getNet_amount();
                    BigDecimal balanceAmount = supPayHasGrn.getBalance_amount();

                    BigDecimal totalPaidAmount = totalNetAmount.subtract(balanceAmount);
                    grn.setPaid_amount(totalPaidAmount);
                    
                    Grn savedGrn = grnDao.save(grn);

                    log.info("GRN ID: {} | Updated Balance : {}", savedGrn.getGrn_no(), savedGrn.getBalance_amount() );
                }
        }

        supPaymentDao.save(supplierpayment);
        

          return "OK";
      }catch (Exception e){
         return "Save Not Completed:" + e.getMessage();
      } 
    }

       //define mapping for update qr
    @PutMapping
    public String update(@RequestBody SupplierPayment suppayment){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"supplier_payment");
        if(!logUserPrivi.get("update")){
            return "Update Not completed: You haven't Privilege";
        }  
        try{
        //checking duplicate records
        SupplierPayment extQrId  = supPaymentDao.getReferenceById(suppayment.getId());
        if(extQrId == null){
            return "Update not Completed : quottaion request is not exist";
        }
      
   
        suppayment.setUpdated_at(LocalDateTime.now());//set updated date and time
        // suppayment.setUpdated_user(userDao.getUserByUserName(auth.getName()).getId());

          
          //we blocked the purchase order for itterative reading so we shout set the value in post


          for(SupplierPaymentHasGrn supPayHasGrn: suppayment.getSupplierPaymentHasGrnList()){
            supPayHasGrn.setSupplier_payment_id(suppayment);

               Optional<Grn> OptionGrn = grnDao.findById(supPayHasGrn.getGrn_id().getId());
                if (OptionGrn.isPresent()){
                    Grn grn = OptionGrn.get();
                    grn.setBalance_amount(supPayHasGrn.getBalance_amount());

                    BigDecimal totalNetAmount = grn.getNet_amount();
                    BigDecimal balanceAmount = supPayHasGrn.getBalance_amount();

                    BigDecimal totalPaidAmount = totalNetAmount.subtract(balanceAmount);
                    grn.setPaid_amount(totalPaidAmount);

                    Grn savedGrn = grnDao.save(grn);
                    
                    log.info("GRN ID: {} | Updated Balance : {}", savedGrn.getGrn_no(), savedGrn.getBalance_amount() );
                }
        }

        supPaymentDao.save(suppayment);
             
          return "OK";

       }catch(Exception e){
           return "Update Not complete: " + e.getMessage();
       }
    }


    //define serve mapping for delete request
      @DeleteMapping
      public String delete(@RequestBody SupplierPayment suppayment){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"supplier_payment");
        if(!logUserPrivi.get("delete")){
            return "Delete Not completed: You haven't Privilege";
        }  
        try{
  
            SupplierPayment extQR  = supPaymentDao.getReferenceById(suppayment.getId());
        if(extQR == null){
            return "Delete not Completed : Quotation request not Available";
        }
  
        // suppayment.setDeleteduser(userDao.getUserByUserName(auth.getName()).getId());
        extQR.setDeleted_at(LocalDateTime.now());
        supPaymentDao.save(extQR);
              return "OK";
          }catch(Exception e){
              return "Delete not Completed :" + e.getMessage();
          }
      }





}
