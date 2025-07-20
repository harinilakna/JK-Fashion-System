package com.bit.jk_fashion_system.service;

import com.bit.jk_fashion_system.dao.UserDao;
import com.bit.jk_fashion_system.entity.Role;
import com.bit.jk_fashion_system.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserDao userDao;
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username)throws
        UsernameNotFoundException {

        System.out.println(username);

        User extUser = userDao.getUserByUserName(username);

        System.out.println(extUser.getUsername());

        Set<GrantedAuthority> userRoles = new HashSet<GrantedAuthority>();

        for (Role role: extUser.getRoles()){
            userRoles.add(new SimpleGrantedAuthority(role.getName()));
        }

        ArrayList <GrantedAuthority> grantedAuthorities = new
                ArrayList<GrantedAuthority>(userRoles);

        System.out.println(grantedAuthorities);

        //my code

        System.out.println("Assigned Authorities:");
grantedAuthorities.forEach(auth -> System.out.println(auth.getAuthority()));


        UserDetails user = new org.springframework.security.core.userdetails.User
         
                (extUser.getUsername(), extUser.getPassword(), extUser.getStatus(), true, true, true, grantedAuthorities);
        return  user;
    }
}
