package com.bit.jk_fashion_system.entity;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name= "grn_has_material")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrnHasMaterial {

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
    @JoinColumn(name = "grn_id", referencedColumnName = "id")
    private Grn grn_id;


    @ManyToOne(optional = false)
    @JoinColumn(name = "material_id", referencedColumnName = "id")
    private Material material_id;

   
}
