package com.bit.jk_fashion_system.controller;


import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import com.bit.jk_fashion_system.dao.UserDao;
import com.bit.jk_fashion_system.entity.User;




@RestController
//class level mapping
@RequestMapping( "/user")
public class UserController {

    @Autowired
    private UserDao userDao;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    //create mapping ui service[/employee -- return employee ui]
    @RequestMapping
    public ModelAndView UserUI(){

        //get logged user authontication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView viewUser= new ModelAndView();
        //get login user name
        viewUser.addObject("loggedUser", auth.getName());
        //change the title according to module
        viewUser.addObject("title", "User Management : BIT Project 2024");
        viewUser.setViewName("user.html");

        
        return viewUser;
    }


     //create get mapping for gget employee all data[employee/findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<User>findAll(){
        //login user authentication and authorization
        return userDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }


     @PostMapping
    public String save(@RequestBody User user){

        //duplicate email,username,employee
        User extUserName = userDao.getUserByUserName(user.getUsername());
        if(extUserName != null){
            return "User Save Not Completed : Given user name Already ext..!";
        }

        User extUserEmployee = userDao.getUserByEmployee(user.getEmployee_id().getId());

        if(extUserEmployee != null){
            return "User Save Not Completed : Given employee Already ext..!";
        }

        try{
            user.setCreated_at(LocalDateTime.now());//set current date time
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword())); //encode password
            userDao.save(user);
            return "OK";
        }catch (Exception e){
            return "Save Not Completed:" + e.getMessage();
        }
    }


    //putmapping for update user details
    @PutMapping
    public  String updateUser(@RequestBody User user){
        //check logged user authontication and authorization
       
        User extUserId = userDao.getReferenceById(user.getId());
        if(extUserId == null){
            return "Update not completed : user not available";
        }
        //check duplicate
        User extUsername = userDao.getUserByUserName((user.getUsername()));
        System.out.println(extUsername);
        if(extUsername  != null && !user.getId().equals(extUsername.getId())){
            return "Update not complete: User name already ext...!";
        }
        try{

        user.setPassword(extUserId.getPassword());
        userDao.save(user);
            return "OK";
        }catch(Exception e){
            return "Update not completed :" + e.getMessage();
        }
    }

     //define delete mapping for delete use [/user]
    @DeleteMapping
    public String deleteUser(@RequestBody User user){

        //check logged user authontication and authorization
       

        //need to check given user ext or not
        User extUser = userDao.getReferenceById(user.getId());
        if(extUser == null){
            return "user delete not completed : Given user not  ext....!";
        }
        try{
            user.setStatus(false); //change user status into inactive
            userDao.save(user);
            return "OK";
        }catch(Exception e){
            return "User Delete Not Completed :" + e.getMessage();
        }
    }


    @GetMapping(value="/byid/{id}", produces = "application/json")
    public User getUserByUserId(@PathVariable("id") Integer id) {
        return userDao.getById(id);
    }
    


   
}
