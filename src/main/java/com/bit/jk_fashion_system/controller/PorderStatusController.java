package com.bit.jk_fashion_system.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bit.jk_fashion_system.dao.PoStatusDao;
import com.bit.jk_fashion_system.entity.PoStatus;


import java.util.*;

@RestController
public class PorderStatusController {

    @Autowired //inject employeestatusdao object into dao variable
    private PoStatusDao poStatusDao;

    //get service mapping for get all employeestatus data
    @GetMapping(value= "/postatus/findall" , produces = "application/json")
    public List<PoStatus>getAllData(){
        return poStatusDao.findAll();
    }

}
