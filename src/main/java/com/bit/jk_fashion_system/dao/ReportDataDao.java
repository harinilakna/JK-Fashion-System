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

    // * ----------- INCOME REPORT END ----------


    // * ----------- EXPENSE REPORT START ----------
    //Daily Expense
    @Query(value = "SELECT count(c.id), sum(c.total_paid_amount),date(c.created_at) FROM er_jk_fashion.supplier_payment c where c.created_at between ?1 and ?2 group by date(c.created_at)",nativeQuery = true)
    String [][] getExpenseDaily(String startdate, String enddate);

    //Monthly Expense
    @Query(value = "SELECT count(c.id), sum(c.total_paid_amount), month(c.created_at) FROM er_jk_fashion.supplier_payment c where c.created_at between ?1 and ?2 group by month(c.created_at)",nativeQuery = true)
    String [][] getExpenseMonthly(String startdate, String enddate);

    //Annual Expense
    @Query(value = "SELECT count(c.id), sum(c.total_paid_amount), year(c.created_at) FROM er_jk_fashion.supplier_payment c where c.created_at between ?1 and ?2 group by year(c.created_at)",nativeQuery = true)
    String [][] getExpenseAnnually(String startdate, String enddate);

    // * ----------- EXPENSE REPORT END ----------
}
