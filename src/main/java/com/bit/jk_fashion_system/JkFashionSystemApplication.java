package com.bit.jk_fashion_system;

import java.time.LocalDateTime;
import java.util.HashSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Set;
import com.bit.jk_fashion_system.dao.EmployeeDao;
import com.bit.jk_fashion_system.dao.RoleDao;
import com.bit.jk_fashion_system.dao.UserDao;
import com.bit.jk_fashion_system.entity.Role;
import com.bit.jk_fashion_system.entity.User;


@SpringBootApplication
@RestController
public class JkFashionSystemApplication {

	 @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private EmployeeDao employeeDao;


    @Autowired
    private RoleDao roleDao;

    @Autowired
    private UserDao userDao;

	public static void main(String[] args) {
		SpringApplication.run(JkFashionSystemApplication.class, args);
		System.out.println("hello");
	}

	@GetMapping(value = "/createadmin")
    public String generateAdmin(){

        User adminUser = new User();
        adminUser.setUsername("Admin");
        adminUser.setPassword(bCryptPasswordEncoder.encode("12345"));
        adminUser.setEmail("admin@gmail.com");
        adminUser.setStatus(true);
        adminUser.setCreated_at(LocalDateTime.now());
        adminUser.setEmployee_id(employeeDao.getReferenceById(1));

        Set<Role> roles = new HashSet<Role>();
        roles.add(roleDao.getReferenceById(1));

        adminUser.setRoles(roles);

        userDao.save(adminUser);

        return "<script>window.location.replace('http://localhost:8080/login')</script>";
    }

}
