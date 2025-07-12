package com.bit.jk_fashion_system.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bit.jk_fashion_system.dao.PaymentStatusDao;
import com.bit.jk_fashion_system.entity.PaymentStatus;


@RestController
public class PaymentStatusController {

    @Autowired //inject employeestatusdao object into dao variable
    private PaymentStatusDao paymentStatusDao;

    //get service mapping for get all employeestatus data
    @GetMapping(value= "/paymentstatus/findall" , produces = "application/json")
    public List<PaymentStatus> getAllData(){
        return paymentStatusDao.findAll();
    }
       
}
