package com.bit.jk_fashion_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import com.bit.jk_fashion_system.dao.RoleDao;
import com.bit.jk_fashion_system.entity.Role;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class RoleController {

      @Autowired //Inject designation object into dao variable
    private RoleDao dao; //create designation dao object

    @GetMapping(value="/role/list" , produces = "application/json")
    public List<Role> getAllData(){

        return dao.findAll();
    }
    
}
