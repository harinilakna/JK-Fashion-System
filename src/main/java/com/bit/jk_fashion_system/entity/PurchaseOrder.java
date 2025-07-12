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
@Table(name ="purchase_order") //for map with given table
@Data //GENERATE SETTERS AND GETTERS
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all grgument constructor
public class PurchaseOrder {

    @Id //for primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//AI
    @Column(name = "id", unique = true)// map with column
    private Integer id;

    @Column(name = "code", unique = true)
    @NotNull
    private String code;

    @Column(name = "required_date")
    @NotNull
    private LocalDate required_date;

    @Column(name = "note")
    private String note;

    @Column(name = "total_cost")
    private BigDecimal total_cost;

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
    @JoinColumn(name = "purchase_order_status_id", referencedColumnName = "id")
    private PoStatus purchase_order_status_id; 

    @ManyToOne(optional = false)
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier_id; 

    //for insert data to linked table should use cascade and for remove orhanremovel
    @OneToMany(mappedBy = "purchase_order_id", cascade = CascadeType.ALL , orphanRemoval = true)
    private List<PurchaseOrderHasMaterial> porderHasMaterialList;


}
