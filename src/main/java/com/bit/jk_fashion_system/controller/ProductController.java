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
import com.bit.jk_fashion_system.dao.ProductDao;
import com.bit.jk_fashion_system.dao.ProductStatusDao;
import com.bit.jk_fashion_system.dao.UserDao;
import com.bit.jk_fashion_system.entity.Product;
import com.bit.jk_fashion_system.entity.ProductHasMaterial;
import com.bit.jk_fashion_system.entity.ProductionOrder;

import java.time.LocalDateTime;
import java.util.HashMap;

@RestController
//class level mapping
@RequestMapping( "/product")
public class ProductController {
    
    @Autowired //Inject designation object into dao variable
    private ProductDao productDao; //create designation dao object

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private ProductStatusDao productStatusDao;

    @Autowired
    private UserDao userDao;
      
    //create mapping ui service[/product -- return material ui]
    @RequestMapping
    public ModelAndView productUI(){

         //get logged user authontication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView viewProduct= new ModelAndView();
        //get login user name
        viewProduct.addObject("loggedUser", auth.getName());
        //change the title according to module
        viewProduct.addObject("title", "Product Management : BIT Project 2024");
        viewProduct.setViewName("product.html");

        
        return viewProduct;
    }

    //create get mapping for get material all data[material/findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<Product>findAll(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"product");
        if(!logUserPrivi.get("select")){
            return null;
        }

        return productDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }

    
  //create post mapping for save employee record
  @PostMapping
  public String save(@RequestBody Product product){
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"product");
    if(!logUserPrivi.get("insert")){
        return "Insert Not completed: You haven't Privilege";
    }  
     try{
          //checking unique value
        if (product.getId() != null) {
            Product extProduct = productDao.getReferenceById(product.getId());
            if (extProduct != null) {
                return "Save not Completed: Insert Product Already exists....!";
            }
        }
       
          product.setCreated_at(LocalDateTime.now());//set current date and time

          product.setAvailable_quantity(0);
          //set log user value with er connection
        //   User logedUser = userDao.getUserByUserName(auth.getName());
        //   material.setAdduser_id(logedUser);
        //   materialDao.save(material);
        
        //set log user value without er connection
           product.setAddeduser(userDao.getUserByUserName(auth.getName()).getId());

            //material no auto generated
         String nextProductNo = productDao.getNextProductNo();
         if (nextProductNo == null || nextProductNo.equals("")) {
            product.setCode("P00001");
         } else {
            product.setCode(nextProductNo);
         }
        
         

            for(ProductHasMaterial PO : product.getProductMaterialList()){
            PO.setProduct_id(product);
        }

        productDao.save(product);

          return "OK";
      }catch (Exception e){
         return "Save Not Completed:" + e.getMessage();
      } 
    }

       //define mapping for update employee [/employee]
    @PutMapping
    public String update(@RequestBody Product product){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"product");
        if(!logUserPrivi.get("update")){
            return "Update Not completed: You haven't Privilege";
        }  
        try{
        //checking duplicate records
        Product exProductId  = productDao.getReferenceById(product.getId());
        if(exProductId == null){
            return "Update not Completed : Product is not Available";
        }
      
   
           product.setUpdated_at(LocalDateTime.now());//set updated date and time
           product.setUpdateduser(userDao.getUserByUserName(auth.getName()).getId());
           productDao.save(product);
             //check shop status
           if(product.getProduct_status_id().getName().equals("Deleted")){
            return "Material is Deleted";
           }
          return "OK";

       }catch(Exception e){
           return "Update Not complete: " + e.getMessage();
       }
    }

//define serve mapping for delete request
      @DeleteMapping
      public String delete(@RequestBody Product product){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"product");
        if(!logUserPrivi.get("delete")){
            return "Delete Not completed: You haven't Privilege";
        }  
        try{

  
        Product exProduct  = productDao.getReferenceById(product.getId());
        if(exProduct == null){
            return "Delete not Completed : Material not Available";
        }

        
            exProduct.setProduct_status_id(productStatusDao.getReferenceById(3));
            product.setDeleteduser(userDao.getUserByUserName(auth.getName()).getId());
            exProduct.setDeleted_at(LocalDateTime.now());
            productDao.save(exProduct);
              return "OK";
          }catch(Exception e){
              return "Delete not Completed :" + e.getMessage();
          }
      }

      //get available material list
      @GetMapping(value="/availablelist" , produces = "application/json")
    public List<Product> getAvailableProductListProductionOrder(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"product");
        if(!logUserPrivi.get("select")){
            return null;
        }

    return productDao.getAvailableProductListProductionOrder();
    }

    //get available material list
      @GetMapping(value="/availableproductlist" , produces = "application/json")
    public List<Product> getAvailableProduct(){
    return productDao.getAvailableProduct();
    }


    @GetMapping(value="/listproductbyproductionorder/{productionId}" , produces = "application/json")
    public List<Product> getAllProductByproduction(@PathVariable ("productionId")Integer productionId ){
    return productDao.getProductByporderId(productionId);
    }




}
