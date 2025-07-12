package com.bit.jk_fashion_system.entity;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name= "supplier_payment_has_grn")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierPaymentHasGrn {

    @Id //for primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//AI
    @Column(name = "id", unique = true)// map with column
    private Integer id;

    @Column(name = "total_amount")
     @NotNull
     private BigDecimal total_amount;


     @Column(name = "paid_amount")
     private BigDecimal paid_amount;

      @Column(name = "balance_amount")
     private BigDecimal balance_amount;

    @ManyToOne(optional = false)
    @JsonIgnore //stop the recuresion reading
    @JoinColumn(name = "supplier_payment_id", referencedColumnName = "id")
    private SupplierPayment supplier_payment_id;
     
   
    @ManyToOne(optional = false)
    @JoinColumn(name = "grn_id", referencedColumnName = "id")
    private Grn grn_id;


 

   
}
