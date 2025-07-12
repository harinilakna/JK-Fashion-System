package com.bit.jk_fashion_system.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


import com.bit.jk_fashion_system.dao.SalesStatusDao;

import com.bit.jk_fashion_system.entity.SaleStatus;

import java.util.*;

@RestController
public class SaleStatusController {

    @Autowired //inject employeestatusdao object into dao variable
    private SalesStatusDao saleStatusDao;


 //get service mapping for get all employeestatus data
    @GetMapping(value= "/salestatus/findall" , produces = "application/json")
    public List<SaleStatus>getAllData(){
        return saleStatusDao.findAll();
    }}
