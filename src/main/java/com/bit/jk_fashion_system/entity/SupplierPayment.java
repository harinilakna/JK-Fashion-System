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
@Table(name ="supplier_payment") //for map with given table
@Data //GENERATE SETTERS AND GETTERS
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all grgument constructor
public class SupplierPayment {

    @Id //for primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//AI
    @Column(name = "id", unique = true)// map with column
    private Integer id;

    @Column(name = "bill_no", unique = true)
    @NotNull
    private String bill_no;

    @Column(name = "cheque_no", unique = true)
    private String cheque_no;

    @Column(name = "payment_date")
    private LocalDate payment_date;

     @Column(name = "transfer_reference_id")
    private String transfer_reference_id;

    @Column(name = "description")
    private String description;

    @Column(name = "total_amount")
    private BigDecimal total_amount;

    @Column(name = "total_paid_amount")
    private BigDecimal total_paid_amount;

     @Column(name = "total_balance_amount")
    private BigDecimal total_balance_amount;

    @Column(name = "created_at")
    @NotNull
    private LocalDateTime created_at;

    @Column(name = "updated_at")
    private LocalDateTime updated_at;

    @Column(name = "deleted_at")
    private LocalDateTime deleted_at;

    // @Column(name = "added_user")
    // @NotNull
    // private Integer addeduser;

    // @Column(name = "updated_user")
    // private Integer updated_user;

    // @Column(name = "deleted_user")
    // private Integer deleteduser;

    
    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier_id;
    
    @ManyToOne
    @JoinColumn(name = "payment_status_id", referencedColumnName = "id")
    private PaymentStatus payment_status_id; 

    @ManyToOne(optional = false)
    @JoinColumn(name = "payment_type_id", referencedColumnName = "id")
    private PaymentType payment_type_id; 

    //for insert data to linked table should use cascade and for remove orhanremovel
    @OneToMany(mappedBy = "supplier_payment_id", cascade = CascadeType.ALL , orphanRemoval = true)
    private List<SupplierPaymentHasGrn> supplierPaymentHasGrnList;


}
