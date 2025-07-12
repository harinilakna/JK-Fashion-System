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
@Table(name = "production_order_has_material")
public class ProductionOrderHasMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "required_quantity")
    @NotNull
    private Integer required_quantity; // required material qty for production check required qty

    @Column(name = "available_quantity")
    @NotNull
    private Integer available_quantity; // available qty for production

    @ManyToOne
    @JoinColumn(name = "production_order_id", referencedColumnName = "id")
    @JsonIgnore
    private ProductionOrder production_order_id;

    @ManyToOne
    @JoinColumn(name = "material_id", referencedColumnName = "id")
    private Material material_id;
}
