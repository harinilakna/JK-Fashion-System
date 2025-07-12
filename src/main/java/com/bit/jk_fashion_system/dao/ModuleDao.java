package com.bit.jk_fashion_system.dao;

import java.util.List;
import com.bit.jk_fashion_system.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ModuleDao extends JpaRepository<Module,Integer> {

     //create query for get module by given role id
    @Query("select m from Module m where m.id not in (select p.module_id.id from Privilege p where p.role_id.id=?1)")
    public List<Module> getModuleByRole(Integer roleid);



    
}
