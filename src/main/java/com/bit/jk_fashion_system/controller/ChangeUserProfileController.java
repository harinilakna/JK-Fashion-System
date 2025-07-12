package com.bit.jk_fashion_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;

import com.bit.jk_fashion_system.dao.UserDao;
import com.bit.jk_fashion_system.entity.User;

import org.springframework.web.bind.annotation.GetMapping;



@RestController
public class ChangeUserProfileController {

    @Autowired
    private UserDao userDao;


    @GetMapping(value = "/loggedUser" , produces = "appliation/json")
    public User getLoggedUser() {
        
         Authentication auth = SecurityContextHolder.getContext().getAuthentication();

         User loggedUser = userDao.getUserByUserName(auth.getName());
         
         loggedUser.setPassword(null);
         return loggedUser;
    }


//     @PutMapping(value = "/changeuser")
//     public String userUpdate(@RequestBody User user) {
       
//     //   try{
         


//     //     if(user.getPassword() != null){

//     //         if(bCryptPasswordEncoder.matches(user.getPassword(), extUser.getPassword())){

//     //             return "User Profile Change not completed : password same as previous Password";
    
//     //         }else{

//     //             user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

//     //         }

//     //     }else{

//     //         user.setPassword(extUser.getPassword());
//     //     }

//     //     userDao.save(user);

//     //     return "OK";
//     //   }catch(Exception e){

//     //     return "User Profile Change not completed :" + e.getMessage();
//     //   }
    
    
//     // }
}
