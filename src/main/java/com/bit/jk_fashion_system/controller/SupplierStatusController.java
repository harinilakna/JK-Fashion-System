package com.bit.jk_fashion_system.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bit.jk_fashion_system.dao.SupplierStatusDao;
import com.bit.jk_fashion_system.entity.SupplierStatus;

import java.util.*;

@RestController
public class SupplierStatusController {

    @Autowired //inject employeestatusdao object into dao variable
    private SupplierStatusDao supplierStatusDao;

    //get service mapping for get all employeestatus data
    @GetMapping(value= "/supplierstatus/findall" , produces = "application/json")
    public List<SupplierStatus>getAllData(){
        return supplierStatusDao.findAll();
    }

}
