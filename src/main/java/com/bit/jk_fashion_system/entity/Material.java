package com.bit.jk_fashion_system.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity //applied as an entity class
@Table(name ="material") //for map with given table
@Data//GENERATE SETTERS AND GETTERS
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all grgument constructor
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    @Column(name = "id")
    private  Integer id;

    @Column(name = "code")
    @NotNull
    private String code;

    @Column(name = "name")
    @NotNull
    private String name;

    @Column(name = "unit_price")
    private BigDecimal unit_price;

    @Column(name = "available_quantity")
    private Integer available_quantity;

    @Column(name = "reorder_point")
    @NotNull
    private BigDecimal reorder_point;

    private byte[] photo;

    @Column(name = "photopath")
    private String photopath ;

    @Column(name = "created_at")
    @NotNull
    private LocalDateTime created_at;

    @Column(name = "updated_at")
    private LocalDateTime updated_at;

    @Column(name = "deleted_at")
    private LocalDateTime deleted_at;

    @Column(name = "added_user")
    private Integer addeduser;

    @Column(name = "updated_user")
    private Integer updateduser;

    @Column(name = "deleted_user")
    private Integer deleteduser;


    @ManyToOne(optional = true)
    @JoinColumn(name="unit_type_id", referencedColumnName = "id")
    private MaterialUnitType unit_type_id;


    @ManyToOne(optional = true)
    @JoinColumn(name="material_size_id", referencedColumnName = "id")
    private MaterialSize material_size_id;

    @ManyToOne(optional = false)
    @JoinColumn(name="material_status_id", referencedColumnName = "id")
    private MaterialStatus material_status_id;

    @ManyToOne(optional = true)
    @JoinColumn(name="material_color_id", referencedColumnName = "id")
    private MaterialColor material_color_id;

    @ManyToOne(optional = false)
    @JoinColumn(name="material_sub_category_id", referencedColumnName = "id")
    private MaterialSubCategory material_sub_category_id;

    public Material(Integer id, String code,String name , BigDecimal unit_price
    ){
        this.id = id;
        this.code = code;
        this.name = name; 
        this.unit_price = unit_price;    
       
    }

 
}
