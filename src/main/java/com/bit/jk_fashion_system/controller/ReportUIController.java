package com.bit.jk_fashion_system.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class ReportUIController {

    //create mapping ui service[/employee -- return employee ui]
     @GetMapping(value = "/report")
    public ModelAndView indexUI(){
        //get logged user authontication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView indexView = new ModelAndView();
        indexView.addObject("loggedUser", auth.getName());
        indexView.addObject("title", "Report : BIT Project 2023");
        indexView.setViewName("sampleReport.html");

        return indexView;
    }


    @GetMapping(value = "/reportpro")
    public ModelAndView ProUI(){
        //get logged user authontication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView ProUI = new ModelAndView();
        ProUI.addObject("loggedUser", auth.getName());
        ProUI.addObject("title", "Production Report : BIT Project 2023");
        ProUI.setViewName("sampleReportPro.html");

        return ProUI;
    }



   
    
}
