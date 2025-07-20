package com.bit.jk_fashion_system.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name= "supplier_has_material")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierHasMaterial {

    
   
    @Id
    @ManyToOne(optional = false)
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier_id;

    @Id
    @ManyToOne(optional = false)
    @JoinColumn(name = "material_id", referencedColumnName = "id")
    private Material material_id;
}
