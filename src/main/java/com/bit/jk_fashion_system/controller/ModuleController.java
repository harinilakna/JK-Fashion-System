package com.bit.jk_fashion_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.bit.jk_fashion_system.dao.ModuleDao;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import com.bit.jk_fashion_system.entity.Module;

@RestController
public class ModuleController {

    @Autowired //Inject module object into dao variable
    private ModuleDao dao; //create module dao object

    @GetMapping(value="/module/list" , produces = "application/json")
    public List<Module> getAllData(){

        return dao.findAll();
    }

    // get mapping for get module data by given role id [/module/listbyrole?roleid=5]
    @GetMapping(value = "/module/listbyrole", params = {"roleid"})
    public List<Module> getByRole (@RequestParam("roleid") Integer roleid){

        return dao.getModuleByRole(roleid);
    }
}
