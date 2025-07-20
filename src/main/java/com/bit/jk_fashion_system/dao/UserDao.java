package com.bit.jk_fashion_system.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.bit.jk_fashion_system.entity.User;

public interface UserDao extends JpaRepository<User,Integer> {

    //create query for get user by given user name
    @Query("select u from User u where u.username=?1")
    public User getUserByUserName(String username);


        //create query for get user by given employee
        @Query("select u from User u where u.employee_id.id=?1")
        public User getUserByEmployee(Integer id);

        @Query("select u from User u where u.id=?1")
        public User getById(Integer id);
    
    
}
