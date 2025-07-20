package com.bit.jk_fashion_system.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bit.jk_fashion_system.dao.GrnStatusDao;
import com.bit.jk_fashion_system.entity.GrnStatus;



import java.util.*;

@RestController
public class GrnStatusController {

    @Autowired //inject employeestatusdao object into dao variable
    private GrnStatusDao grnStatusDao;

    //get service mapping for get all employeestatus data
    @GetMapping(value= "/grnstatus/findall" , produces = "application/json")
    public List<GrnStatus>getAllData(){
        return grnStatusDao.findAll();
    }

}
