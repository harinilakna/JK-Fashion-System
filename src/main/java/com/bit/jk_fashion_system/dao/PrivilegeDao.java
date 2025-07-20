package com.bit.jk_fashion_system.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.bit.jk_fashion_system.entity.Privilege;

public interface PrivilegeDao extends JpaRepository<Privilege,Integer> {

   //create query for get privilege object by given role id and module id
   @Query("select p from Privilege p where p.role_id.id=?1 and p.module_id.id=?2")
   Privilege getByRoleModule(Integer roleid, Integer moduleid);

   //create query for get privilege by given username and module name
   @Query(value = "SELECT bit_or(p.sel) as sel,bit_or(p.inst) as inst,bit_or(p.upd) as upd,bit_or(p.del) as del FROM er_jk_fashion.privilege as p where p.role_id in (select uhr.role_id From er_jk_fashion.user_has_role as uhr where uhr.user_id in (select u.id From er_jk_fashion.user as u where u.username =?1) )and p.module_id in(select m.id From er_jk_fashion.module as m where m.name=?2);", nativeQuery = true)
   public String getPrivilegeByUserModule(String username,String modulename);


}
