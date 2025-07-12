package com.bit.jk_fashion_system.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.bit.jk_fashion_system.dao.EmployeeDao;
import com.bit.jk_fashion_system.dao.EmployeeStatusDao;
import com.bit.jk_fashion_system.dao.UserDao;
import com.bit.jk_fashion_system.entity.Employee;
import com.bit.jk_fashion_system.entity.User;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping(value = "/employee")//class level mapping
public class EmployeeController {

    @Autowired //create employee dao object
    private EmployeeDao dao;

    //create employeestatus dao object
    @Autowired
    private EmployeeStatusDao employeeStatusDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PrivilegeController privilegeController;


    //create mapping ui service[/employee -- return employee ui]
    @RequestMapping
    public ModelAndView employeeUI(){

        //get logged user authontication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView viewEmp= new ModelAndView();
        //get login user name
        viewEmp.addObject("loggedUser", auth.getName());
        //change the title according to module
        viewEmp.addObject("title", "Employee Management : BIT Project 2023");
        viewEmp.setViewName("employee.html");

        
        log.info("user name | {}", auth.getName());
        
        return viewEmp;


    }


   
    //create get mapping for get employee all data[employee/findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<Employee>findAll(){

       
        //login user authentication and authorization     
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"employee");
        if(!logUserPrivi.get("select")){
            return null;
        }

         log.info("user name | {}", auth.getName());
        return dao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }



  //create post mapping for save employee record
  @PostMapping
  public String save(@RequestBody Employee employee){
         //autontication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"employee");
        if(!logUserPrivi.get("insert")){
            return "Insert Not Completed: You haven't Privilege";
        } 
  
      
          //checking unique value
          Employee extEmployeeNIC = dao.getEmployeeByNic(employee.getNic());
          if(extEmployeeNIC != null){
              return "Save not Completed: Insert Nic Already ext....!";
          }
          Employee extEmployeeEmail = dao.getEmployeeByEmail(employee.getEmail());
          if(extEmployeeEmail != null){
              return "Save not Completed: Insert Email Already ext....!";
          }
          try{
          employee.setCreated_at(LocalDateTime.now());//set current date and time
          
         //emp no auto generated
         String nextEmpNo = dao.getNextEmpNo();
         if (nextEmpNo == null || nextEmpNo.equals("")) {
             employee.setEmpno("Emp001");
         } else {
             employee.setEmpno(nextEmpNo);
         }
         

          dao.save(employee);

          //need to create user account

          return "OK";
      }catch (Exception e){
         return "Save Not Completed:" + e.getMessage();
      } 
    }


    //define mapping for update employee [/employee]
    @PutMapping
    @Transactional
    public String update(@RequestBody Employee employee){
        //autontication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"employee");
        if(!logUserPrivi.get("update")){
            return "Update Not Completed: You haven't Privilege";
        } 
  

        //checking duplicate records
        Employee extEmployee = dao.getReferenceById(employee.getId());
        if(extEmployee == null){
            return "Update not Completed : Employee not Available";
        }

        Employee extEmployeeNic = dao.getEmployeeByNic(employee.getNic());
        if(extEmployeeNic != null && extEmployeeNic.getId() != employee.getId()){
            return "Update not Completed : Nic Already Existing";
        }try{
           employee.setUpdated_at(LocalDateTime.now());//set updated date and time
           dao.save(employee);
           //check employee status and change user-status
            if(employee.getEmployee_status_id().getName().equals("Resigned") || employee.getEmployee_status_id().getName().equals("Deleted")){
                //in-active user if employee status changed to resign or delete
                User extUser = userDao.getUserByEmployee(employee.getId());
                if(extUser != null){
                    extUser.setStatus(false);
                    userDao.save(extUser);
                }
            }
          return "OK";

       }catch(Exception e){
           return "Update Not complete: " + e.getMessage();
       }
    }


      //define serve mapping for delete request
      @DeleteMapping
      @Transactional
      public String delete(@RequestBody Employee employee){

         Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap <String,Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName() ,"employee");
        if(!logUserPrivi.get("delete")){
            return "delete Not Completed: You haven't Privilege";
        } try{
  
          Employee extEmp = dao.getReferenceById(employee.getId());
          if(extEmp == null){
              return "Delete Not Completed : Employee not ext...! ";
          }
          
  
              extEmp.setEmployee_status_id(employeeStatusDao.getReferenceById(3));
              extEmp.setDeleted_at(LocalDateTime.now());
              dao.save(extEmp);

               //need to inactive user status
           User extUser = userDao.getUserByEmployee(extEmp.getId());
           if(extUser != null){
               extUser.setStatus(false);
               userDao.save(extUser);
           }
              return "OK";
          }catch(Exception e){
              return "Delete not Completed :" + e.getMessage();
          }
      }


    //create get mapping for get employee list without user account
    @GetMapping(value = "/listwithoutuseraccount", produces = "application/json")
    public List<Employee>getEmployeeListWithoutUserAccount(){

        return dao.getEmployeeListWithoutUserAccount();
    }

    
}
