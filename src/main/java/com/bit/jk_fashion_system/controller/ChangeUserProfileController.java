package com.bit.jk_fashion_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import com.bit.jk_fashion_system.dao.EmployeeDao;
import com.bit.jk_fashion_system.dao.UserDao;
import com.bit.jk_fashion_system.entity.Employee;
import com.bit.jk_fashion_system.entity.Material;
import com.bit.jk_fashion_system.entity.User;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import java.util.Optional;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@RestController
public class ChangeUserProfileController {

    
    private final UserDao userDao;
    private final EmployeeDao employeeDao;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public ChangeUserProfileController(UserDao userDao, EmployeeDao employeeDao, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userDao = userDao;
        this.employeeDao = employeeDao;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }




   @GetMapping(value = "/loggedUser", produces = "application/json")
    public User getLoggedUser() {
        
         Authentication auth = SecurityContextHolder.getContext().getAuthentication();

         User loggedUser = userDao.getUserByUserName(auth.getName());
         
         loggedUser.setPassword(null);
         return loggedUser;
    }


    // ----added----

      @RequestMapping(value = "/user-account", produces = "application/json")
    public ModelAndView UserUI(){

        //get logged user authontication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView viewUser= new ModelAndView();
        //get login user name
        viewUser.addObject("loggedUser", auth.getName());
        //change the title according to module
        viewUser.addObject("title", "User Management : BIT Project 2024");
        viewUser.setViewName("userAccount.html");

        
        return viewUser;
    }

@PutMapping(value = "/changeuser")
@Transactional
public String userUpdate(@RequestBody User user) {
    try {
        User extUser = userDao.getUserByUserName(user.getUsername());
        if (extUser != null && extUser.getId() != user.getId()) {
            return "Save not completed : Username already exists!";
        }

        User extUserId = userDao.getReferenceById(user.getId());
        if (extUserId == null) {
            return "User update not completed: User doesn't exist";
        }

        if (user.getPassword() != null) {
            boolean passwordExt = bCryptPasswordEncoder.matches(user.getPassword(), extUserId.getPassword());
            if (passwordExt) {
                return "User update not complete: New password cannot be same as old password";
            }
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        } else {
            user.setPassword(extUserId.getPassword());
        }

        //    Optional<Employee> Optionalemp = employeeDao.employeeGetById(user.getEmployee_id().getId());
        //         if (Optionalemp.isPresent()){
        //             Employee employee = Optionalemp.get();
        //             employee.setEmail(user.getEmail());

        //             log.info("employee email: {}", user.getEmail() );

        //             employeeDao.save(employee);
        //         }
                    // update the email change in employee
            // Employee employee = employeeDao.getReferenceById(user.getEmployee_id().getId());
            // employee.setEmail(user.getEmail());
            // employeeDao.save(employee);

            // log.info("employee email: {}", user.getEmail() );

            Employee employee = user.getEmployee_id();
        if (employee != null) {
            employee.setEmail(user.getEmail()); // modify it
        }
        userDao.save(user);

        return "OK";

    } catch (Exception e) {
        return "User Profile Change not completed : " + e.getMessage();
    }
}
}