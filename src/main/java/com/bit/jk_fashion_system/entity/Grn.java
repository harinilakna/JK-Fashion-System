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
@Table(name ="grn") //for map with given table
@Data //GENERATE SETTERS AND GETTERS
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all grgument constructor
public class Grn {

    @Id //for primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//AI
    @Column(name = "id", unique = true)// map with column
    private Integer id;

    @Column(name = "grn_no", unique = true)
    @NotNull
    private String grn_no;

    @Column(name = "supplier_billno", unique = true)
    @NotNull
    private String supplier_billno;

    @Column(name = "recieved_date")
    @NotNull
    private LocalDate recieved_date;

    @Column(name = "grandtotal")
    private BigDecimal grandtotal;

    @Column(name = "discount_rate")
    private BigDecimal discount_rate;

    @Column(name = "net_amount")
    private BigDecimal net_amount;

    @Column(name = "paid_amount")
    private BigDecimal paid_amount;

    @Column(name = "description")
    private String description;

    @Column(name = "created_at")
    @NotNull
    private LocalDateTime created_at;

    @Column(name = "updated_at")
    private LocalDateTime updated_at;

    @Column(name = "deleted_at")
    private LocalDateTime deleted_at;

    @Column(name = "added_user")
    @NotNull
    private Integer addeduser;

    @Column(name = "updated_user")
    private Integer updated_user;

    @Column(name = "deleted_user")
    private Integer deleteduser;

    
    @ManyToOne(optional = false)
    @JoinColumn(name = "grn_status_id", referencedColumnName = "id")
    private GrnStatus grn_status_id; 


    @ManyToOne(optional = false)
    @JoinColumn(name = "purchase_order_id", referencedColumnName = "id")
    private PurchaseOrder purchase_order_id; 

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier_id; 

    //for insert data to linked table should use cascade and for remove orhanremovel
    @OneToMany(mappedBy = "grn_id", cascade = CascadeType.ALL , orphanRemoval = true)
    private List<GrnHasMaterial> grnHasMaterialList;


}
