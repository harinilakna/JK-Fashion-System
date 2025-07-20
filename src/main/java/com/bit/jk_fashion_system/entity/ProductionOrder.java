package com.bit.jk_fashion_system.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "production_order")
public class ProductionOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "code")
    private String code;

    @Column(name = "note")
    private String note;

    @Column(name = "required_date")
    private LocalDate required_date;

    @Column(name = "created_at")
    private LocalDateTime created_at;

    @Column(name = "updated_at")
    private LocalDateTime updated_at;

    @Column(name = "deleted_at")
    private LocalDateTime deleted_at;

    @Column(name = "created_user")
    private Integer created_user;

    @Column(name = "updated_user")
    private Integer updated_user;

    @Column(name = "deleted_user")
    private Integer deleted_user;
    
    @ManyToOne
    @JoinColumn(name = "production_order_status_id", referencedColumnName = "id")
    private ProductionOrderStatus production_order_status_id;

    @OneToMany(mappedBy = "production_order_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductionOrderHasProduct> productionOrderProductList;

    @OneToMany(mappedBy = "production_order_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductionOrderHasMaterial> productionOrderMaterialtList;

}
