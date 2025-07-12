package com.bit.jk_fashion_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;

import com.bit.jk_fashion_system.dao.PrivilegeDao;
import com.bit.jk_fashion_system.entity.Privilege;

@RestController
@RequestMapping(value = "/privilege")
public class PrivilegeController {
    
    @Autowired
    private PrivilegeDao privilegeDao;


    //get mapping for generate privilege ui
    @GetMapping
    public ModelAndView privilegeUI(){

       //get logged user authontication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView privilegeView= new ModelAndView();
        //get login user name
        privilegeView.addObject("loggedUser", auth.getName());
        //change the title according to midule
        privilegeView.addObject("title", "Privilege Management : BIT Project 2023");
        privilegeView.setViewName("privilege.html");
        return privilegeView;

    }

     //    create get mapping for get privilege find all data
    @GetMapping(value = "/findall", produces = "application/json")
    public List<Privilege> getAllData(){
        //login user authentication and authorization
        return privilegeDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }

   //create post mapping for save privlege record
   @PostMapping
   public  String savePrivilege(@RequestBody Privilege privilege){
       //authentication and authorization
       //duplicate
       Privilege extPrivilege = privilegeDao.getByRoleModule(privilege.getRole_id().getId(), privilege.getModule_id().getId());

       if(extPrivilege != null){
           return  "Save not Completed : Privilege Already exist by given role and module";
       } try{
           //set auto generated value

           //operation
           privilegeDao.save(privilege);

           return "OK";
       }catch (Exception e){
           return  "Save not Completed:" + e.getMessage();
       }
   }
//
   //put mapping for update privilege details
   @PutMapping
   public  String updatePrivilege(@RequestBody Privilege privilege){

       //authentication and authorization

       //check extisting
       Privilege extPrivilege = privilegeDao.getReferenceById(privilege.getId());

       if(extPrivilege == null){
           return "Update not completed : Given privilege record not exist";
       }
       try{
           //set auto generated value
           privilegeDao.save(privilege);
           return "OK";
       }catch(Exception e){
           return "Update not completed :" + e.getMessage();
       }
   }
//
//
   //define delete mapping for delete privilege
   @DeleteMapping
   public String deletePrivilege(@RequestBody Privilege privilege){
       //authentication and authorization
       Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap <String,Boolean> logUserPrivi = getPrivilegeByUserModule(auth.getName() ,"user_and_privilege");
        if(!logUserPrivi.get("delete")){
            return "delete Not Completed: You haven't Privilege";
        } try{
       //check exsisting
       Privilege extPrivilege = privilegeDao.getReferenceById(privilege.getId());
       if(extPrivilege == null){
           return " delete not completed : Given privilege record not  ext....!";
       }

           //set auto generated value
           extPrivilege.setSel(false);
           extPrivilege.setInst(false);
           extPrivilege.setUpd(false);
           extPrivilege.setDel(false);

           //operation
           privilegeDao.save(extPrivilege);
           return "OK";
       }catch(Exception e){
           return "Delete is Not Completed :" + e.getMessage();
       }

       
    }

    //create get mapping for get privilege by logged user module
    @GetMapping(value ="/bylogedusermodule/{modulename}", produces = "application/json")
    public HashMap<String,Boolean> getPrivilegeByLogedUserModule(@PathVariable("modulename") String modulename) {
         //get logged user authontication object
         Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        return getPrivilegeByUserModule(auth.getName(), modulename);
    }
    



    //define function for get privilege by user module
    public  HashMap<String,Boolean> getPrivilegeByUserModule(String username , String modulename){

      HashMap<String,Boolean> userPrivilege = new HashMap<String,Boolean>();
     if(username.equals("Admin")){

         userPrivilege.put("select",true);
         userPrivilege.put("insert",true);
         userPrivilege.put("update",true);
         userPrivilege.put("delete",true);

     }else{
         String userPrivi = privilegeDao.getPrivilegeByUserModule(username,modulename);
         System.out.println(userPrivi);
         String[] userPriviList = userPrivi.split(",");

         userPrivilege.put("select",userPriviList[0].equals("1"));
         userPrivilege.put("insert",userPriviList[1].equals("1"));
         userPrivilege.put("update",userPriviList[2].equals("1"));
         userPrivilege.put("delete",userPriviList[3].equals("1"));

     }


      return userPrivilege;
    }


}
