package com.bit.jk_fashion_system.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bit.jk_fashion_system.entity.Employee;

import java.util.List;

public interface EmployeeDao extends JpaRepository<Employee, Integer> {
  

// Define query for getting the next employee number
@Query(value = "SELECT concat('Emp', lpad(substring(max(e.empno), 4) + 1, 3,'0' )) FROM er_jk_fashion.employee as e", nativeQuery = true)
public String getNextEmpNo();

    
     //define query for get employee by given nic
    @Query(value = "SELECT e from Employee e WHERE e.nic =:nic")
    public Employee getEmployeeByNic(@Param("nic")String nic);

    //define query for get employee by given email
    @Query(value = "SELECT e from Employee e WHERE e.email = ?1")
    public Employee getEmployeeByEmail(String email);


  //define query for get Employee list without user Account
  @Query(value ="SELECT e from Employee e WHERE e.id not in (select u.employee_id from User u) and e.employee_status_id.id = 1")//changed
  public List<Employee> getEmployeeListWithoutUserAccount();

}
