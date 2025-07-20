package com.bit.jk_fashion_system.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class ReportUIController {


    @GetMapping(value = "/sales")
    public ModelAndView salesReportUI(){
        //get logged user authontication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView indexView = new ModelAndView();
        indexView.addObject("loggedUser", auth.getName());
        indexView.addObject("title", "Report : BIT Project 2024");
        indexView.setViewName("salesReport.html");

        return indexView;
    }

    @GetMapping(value = "/expenses")
    public ModelAndView expensesReportUI(){
        //get logged user authontication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView indexView = new ModelAndView();
        indexView.addObject("loggedUser", auth.getName());
        indexView.addObject("title", "Report : BIT Project 2024");
        indexView.setViewName("expensesReport.html");

        return indexView;
    }


 



   
    
}
