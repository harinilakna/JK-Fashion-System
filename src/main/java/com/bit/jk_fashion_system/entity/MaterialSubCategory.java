package com.bit.jk_fashion_system.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "material_sub_category")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialSubCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    @Column(name = "id")
    private  Integer id;

    @Column(name = "name")
    private String name;

    @ManyToOne
    @JoinColumn(name = "material_category_id", referencedColumnName = "id")//join column condition
    private MaterialCategory material_category_id;
}
