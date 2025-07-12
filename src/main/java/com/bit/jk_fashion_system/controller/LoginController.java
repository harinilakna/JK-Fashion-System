package com.bit.jk_fashion_system.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.bit.jk_fashion_system.dao.UserDao;
import com.bit.jk_fashion_system.entity.User;

@RestController
public class LoginController {

    @Autowired

    private UserDao userDao;
    
     @GetMapping(value = "/login")
    public ModelAndView loginUI(){
        ModelAndView loginView = new ModelAndView();
        loginView.addObject("title", "Login : BIT Project 2024");
        loginView.setViewName("login.html");

        return loginView;
    }
    @GetMapping(value = "/error")
    public ModelAndView errorUI(){
        ModelAndView errorView = new ModelAndView();
        errorView.addObject("title", "Error : BIT Project 2024");
        errorView.setViewName("error.html");

        return errorView;
    }

    @GetMapping(value = "/index")
    public ModelAndView indexUI(){
        //get logged user authontication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
           
        User loggedUser = userDao.getUserByUserName((auth.getName()));


        ModelAndView indexView = new ModelAndView();//ui eka gnna hamathnktama logged user object ekai me tikai danna
        indexView.addObject("loggedUser", auth.getName());
        indexView.addObject("loggedUserRole", loggedUser.getRoles().iterator().next().getName());
        indexView.addObject("loggedUserPhoto", loggedUser.getPhoto());
        indexView.addObject("title", "Home : BIT Project 2024");
        indexView.setViewName("mainwindow.html");

        return indexView;
    }

    @GetMapping(value = "/dashboard")
    public ModelAndView dashboardUI(){
        //get logged user authontication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView dashbordView = new ModelAndView();
        dashbordView.addObject("loggedUser", auth.getName());
        dashbordView.addObject("title", "Dashboard : BIT Project 2024");
        dashbordView.setViewName("dashboard.html");

        return  dashbordView;
    }

    
}
