package com.bit.jk_fashion_system.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import org.hibernate.validator.constraints.Length;
import java.time.LocalDateTime;
import java.util.Set;

@Entity //applied as an entity class
@Table(name ="supplier") //for map with given table
@Data //GENERATE SETTERS AND GETTERS
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all grgument constructor
public class Supplier {

    @Id //for primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//AI
    @Column(name = "id", unique = true)// map with column
    private Integer id;

    @Column(name = "supno", unique = true)
    @NotNull
    private String supno;

    @Column(name = "brn")
    private String brn;

    @Column(name = "name")
    @NotNull
    private String name;

    @Column(name = "address")
    @NotNull
    private String address;

    @Column(name = "company_contact")
    @Length(max = 10)
    private String company_contact;

    @Column(name = "contact_person")
    private String contact_person;

    @Column(name = "contact_no")
    @Length(max = 10)
    private String contact_no;

    @Column(name = "note")
    private String note;

    @Column(name = "email", unique = true)
    @NotNull
    private String email;

    @Column(name = "created_at")
    private LocalDateTime created_at;

    @Column(name = "updated_at")
    private LocalDateTime updated_at;

    @Column(name = "deleted_at")
    private LocalDateTime deleted_at;

    @Column(name = "added_user")
    private Integer addeduser;

    @Column(name = "updated_user")
    private Integer updateduser;

    @Column(name = "deleted_user")
    private Integer deleteduser;

    @Column(name = "bank_name")
    private String bank_name;

    @Column(name = "account_no")
    private String account_no;

    @Column(name = "branch_name")

    private String branch_name;

    @Column(name = "account_name")
    private String account_name;


    @ManyToOne(optional = false)
    @JoinColumn(name = "supplier_status_id", referencedColumnName = "id")
    private SupplierStatus supplier_status_id; 

    @ManyToMany
    @JoinTable(name = "supplier_has_material", joinColumns = @JoinColumn(name = "supplier_id") , inverseJoinColumns = @JoinColumn(name = "material_id"))
    private Set<Material>material;

}
