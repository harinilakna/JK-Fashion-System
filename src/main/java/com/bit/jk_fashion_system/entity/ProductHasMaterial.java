package com.bit.jk_fashion_system.entity;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name= "product_has_material")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductHasMaterial {

    @Id //for primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//AI
    @Column(name = "id", unique = true)// map with column
    private Integer id;


    @Column(name = "quantity")
    @NotNull
     private Integer quantity;

     @Column(name = "unit_price")
     @NotNull
     private BigDecimal unit_price;

     @Column(name = "line_cost")
     @NotNull
     private BigDecimal line_cost;
     
   
    @ManyToOne(optional = false)
    @JsonIgnore //stop the recuresion reading
    @JoinColumn(name = "product_id",referencedColumnName = "id")
    private Product product_id;


    @ManyToOne(optional = false)
    @JoinColumn(name = "material_id", referencedColumnName = "id")
    private Material material_id;

   
}
