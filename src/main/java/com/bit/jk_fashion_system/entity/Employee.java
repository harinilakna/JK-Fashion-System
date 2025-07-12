package com.bit.jk_fashion_system.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity //applied as an entity class
@Table(name ="employee") //for map with given table
@Data //GENERATE SETTERS AND GETTERS
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all grgument constructor
public class Employee {

    @Id //for primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//AI
    @Column(name = "id", unique = true)// map with column
    private Integer id;

    @Column(name = "empno", unique = true)
    @NotNull
    private String empno;

    @Column(name = "nic", unique = true)
    @NotNull
    private String nic;

    @Column(name = "email", unique = true)
    @NotNull
    private String email;

    @Column(name = "fullname")
    @NotNull
    private String fullname;

    @Column(name = "callingname")
    @NotNull
    private String callingname;

    @Column(name = "contactno")
    @NotNull
    @Length(max = 10)
    private String contactno;

    @Column(name = "landno")
    private String landno;

    @Column(name = "address")
    @NotNull
    private String address;

    @Column(name = "note")
    private String note;

    @Column(name = "gender")
    @NotNull
    private String gender;

    @Column(name = "date_of_birth")
    private LocalDate date_of_birth;

    @Column(name = "created_at")
    private LocalDateTime created_at;

    @Column(name = "updated_at")
    private LocalDateTime updated_at;

    @Column(name = "deleted_at")
    private LocalDateTime deleted_at;

    @ManyToOne
    @JoinColumn(name = "employee_status_id", referencedColumnName = "id")//join column condition
    private EmployeeStatus employee_status_id;

    @ManyToOne
    @JoinColumn(name = "designation_id",referencedColumnName = "id")
    private Designation designation_id;
    
}
