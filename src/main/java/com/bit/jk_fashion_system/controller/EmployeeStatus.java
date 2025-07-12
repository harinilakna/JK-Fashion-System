package com.bit.jk_fashion_system.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bit.jk_fashion_system.dao.EmployeeStatusDao;


@RestController
public class EmployeeStatus {

    @Autowired //inject employeestatusdao object into dao variable
    private EmployeeStatusDao employeeStatusDao;

    //get service mapping for get all employeestatus data
    @GetMapping(value= "/employeestatus/findall" , produces = "application/json")
    public List<com.bit.jk_fashion_system.entity.EmployeeStatus> getAllData(){
        return employeeStatusDao.findAll();
    }
       
}
