package com.bit.jk_fashion_system.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "production_order_has_product")
public class ProductionOrderHasProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "order_quantity")
    @NotNull
    private Integer order_quantity;

    @Column(name = "completed_quantity")
    @NotNull
    private Integer completed_quantity; // total completed quantity in production

    @ManyToOne
    @JoinColumn(name = "production_order_id", referencedColumnName = "id")
    @JsonIgnore
    private ProductionOrder production_order_id;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Product product_id;
}
