package com.bit.jk_fashion_system.dao;

import com.bit.jk_fashion_system.entity.Employee;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportDataDao extends JpaRepository<Employee, Integer> {

    // * ----------- INCOME REPORT START ----------

    //Daily Income
    @Query(value = "SELECT count(c.id), sum(c.paid_amount), date(c.created_at) FROM er_jk_fashion.sales c where c.created_at between ?1 and ?2 group by date(c.created_at)",nativeQuery = true)
    String [][] getIncomeDaily(String startdate, String enddate);

    //Monthly Income
    @Query(value = "SELECT count(c.id), sum(c.paid_amount), month(c.created_at) FROM er_jk_fashion.sales c where c.created_at between ?1 and ?2 group by month(c.created_at)",nativeQuery = true)
    String [][] getIncomeMonthly(String startdate, String enddate);

    //Annual Income
    @Query(value = "SELECT count(c.id), sum(c.paid_amount), year(c.created_at) FROM er_jk_fashion.sales c where c.created_at between ?1 and ?2 group by year(c.created_at)",nativeQuery = true)
    String [][] getIncomeAnnually(String startdate, String enddate);
}
