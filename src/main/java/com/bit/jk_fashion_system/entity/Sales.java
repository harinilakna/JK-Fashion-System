package com.bit.jk_fashion_system.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.math.BigDecimal;


@Entity //applied as an entity class
@Table(name ="sales") //for map with given table
@Data //GENERATE SETTERS AND GETTERS
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all grgument constructor
public class Sales {

    @Id //for primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//AI
    @Column(name = "id", unique = true)// map with column
    private Integer id;

    @Column(name = "invoice_no", unique = true)
    @NotNull
    private String invoice_no;

    @Column(name = "expected_date")
    @NotNull
    private LocalDate expected_date;

    @Column(name = "grand_total")
    private BigDecimal grand_total;

    @Column(name = "paid_amount")
    private BigDecimal paid_amount;

    @Column(name = "balance_amount")
    private BigDecimal balance_amount;

    @Column(name = "discount")
    private BigDecimal discount;

   @Column(name = "net_amount")
    private BigDecimal net_amount;

    @Column(name = "note")
    private String note;

    @Column(name = "vehicle_no")
    private String vehicle_no;

    @Column(name = "delivery_date")
    private LocalDate delivery_date;

    @Column(name = "created_at")
    @NotNull
    private LocalDateTime created_at;

    @Column(name = "updated_at")
    private LocalDateTime updated_at;

    @Column(name = "deleted_at")
    private LocalDateTime deleted_at;

    @Column(name = "added_user")
    @NotNull
    private Integer added_user;

    @Column(name = "updated_user")
    private Integer updated_user;

    @Column(name = "deleted_user")
    private Integer deleted_user;

    
    @ManyToOne(optional = false)
    @JoinColumn(name = "sales_status_id", referencedColumnName = "id")
    private SaleStatus sales_status_id; 


    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private Customer customer_id; 

    //for insert data to linked table should use cascade and for remove orhanremovel
    @OneToMany(mappedBy = "sales_id", cascade = CascadeType.ALL , orphanRemoval = true)
    private List<SaleHasProducts> saleHasProductList;


}
