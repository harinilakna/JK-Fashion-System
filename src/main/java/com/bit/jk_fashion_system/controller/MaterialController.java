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
import com.bit.jk_fashion_system.dao.MaterialDao;
import com.bit.jk_fashion_system.dao.MaterialStatusDao;
import com.bit.jk_fashion_system.dao.UserDao;
import com.bit.jk_fashion_system.entity.Material;
import java.time.LocalDateTime;
import java.util.HashMap;

@RestController
//class level mapping
@RequestMapping( "/material")
public class MaterialController {
    
    @Autowired //Inject designation object into dao variable
    private MaterialDao materialDao; //create designation dao object

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private MaterialStatusDao materialStatusDao;

    @Autowired
    private UserDao userDao;
      
    //create mapping ui service[/material -- return material ui]
    @RequestMapping
    public ModelAndView materialUI(){

         //get logged user authontication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView viewMaterial= new ModelAndView();
        //get login user name
        viewMaterial.addObject("loggedUser", auth.getName());
        //change the title according to module
        viewMaterial.addObject("title", "Material Management : BIT Project 2024");
        viewMaterial.setViewName("material.html");

        
        return viewMaterial;
    }

    //create get mapping for get material all data[material/findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<Material>findAll(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"material_and_inventory");
        if(!logUserPrivi.get("select")){
            return null;
        }

        return materialDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }

    
  //create post mapping for save employee record
  @PostMapping
  public String save(@RequestBody Material material){
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"material_and_inventory");
    if(!logUserPrivi.get("insert")){
        return "Insert Not completed: You haven't Privilege";
    }  
     try{
          //checking unique value
        if (material.getId() != null) {
            Material extMaterial = materialDao.getReferenceById(material.getId());
            if (extMaterial != null) {
                return "Save not Completed: Insert Material Already exists....!";
            }
        }
       
          material.setCreated_at(LocalDateTime.now());//set current date and time
          //set log user value with er connection
        //   User logedUser = userDao.getUserByUserName(auth.getName());
        //   material.setAdduser_id(logedUser);
        //   materialDao.save(material);
        
        //set log user value without er connection
           material.setAddeduser(userDao.getUserByUserName(auth.getName()).getId());

            //material no auto generated
         String nextMaterialNo = materialDao.getNextMaterialNo();
         if (nextMaterialNo == null || nextMaterialNo.equals("")) {
            material.setCode("M00001");
         } else {
            material.setCode(nextMaterialNo);
         }
         

         materialDao.save(material);
        

          return "OK";
      }catch (Exception e){
         return "Save Not Completed:" + e.getMessage();
      } 
    }

       //define mapping for update employee [/employee]
    @PutMapping
    public String update(@RequestBody Material material){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"material_and_inventory");
        if(!logUserPrivi.get("update")){
            return "Update Not completed: You haven't Privilege";
        }  
        try{
        //checking duplicate records
        Material extMaterialId  = materialDao.getReferenceById(material.getId());
        if(extMaterialId == null){
            
            return "Update not Completed : Material not Available";}
      
   
           material.setUpdated_at(LocalDateTime.now());//set updated date and time
           material.setUpdateduser(userDao.getUserByUserName(auth.getName()).getId());
           materialDao.save(material);
             //check shop status
           if(material.getMaterial_status_id().getName().equals("Deleted")){
            return "Material is Deleted";
           }
          return "OK";

       }catch(Exception e){
           return "Update Not complete: " + e.getMessage();
       }
    }

//define serve mapping for delete request
      @DeleteMapping
      public String delete(@RequestBody Material material){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"material_and_inventory");
        if(!logUserPrivi.get("delete")){
            return "Delete Not completed: You haven't Privilege";
        }  
        try{
  
        Material extMaterial  = materialDao.getReferenceById(material.getId());
        if(extMaterial == null){
            return "Delete not Completed : Material not Available";
        }
  
            extMaterial.setMaterial_status_id(materialStatusDao.getReferenceById(3));
            material.setDeleteduser(userDao.getUserByUserName(auth.getName()).getId());
            extMaterial.setDeleted_at(LocalDateTime.now());
            materialDao.save(extMaterial);
              return "OK";
          }catch(Exception e){
              return "Delete not Completed :" + e.getMessage();
          }
      }

      //get available material list
      @GetMapping(value="/availablelist" , produces = "application/json")
    public List<Material> getAvailableDataList(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"material_and_inventory");
        if(!logUserPrivi.get("select")){
            return null;
        }

    return materialDao.getAvailableMaterialList();
    }


    
    @GetMapping(value="/availablelistwithoutsupplier/{supid}" , produces = "application/json")
    public List<Material> getNotAvailableMaterialList(@PathVariable("supid")Integer supplierid){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"material_and_inventory");
        if(!logUserPrivi.get("select")){
            return null;
        }

    return materialDao.getNotAvailableMaterial(supplierid);
    }



    @GetMapping(value="/listbysupplier/{supplierid}" , produces = "application/json")
    public List<Material> getAllDataBySupplier(@PathVariable ("supplierid")Integer supplierid ){
    return materialDao.getBySupplier(supplierid);
    }

    @GetMapping(value="/listbypurchaseorder/{porderid}" , produces = "application/json")
    public List<Material> getAllMaterialByporder(@PathVariable ("porderid")Integer porderid ){
    return materialDao.getByporderId(porderid);
    }

    @GetMapping(value="/listbyproduct/{materialId}" , produces = "application/json")
    public Material getAllMaterialByproduct(@PathVariable ("materialId")Integer materialId ){
    return materialDao.getMaterialStockByMaterial(materialId);
    }





}
