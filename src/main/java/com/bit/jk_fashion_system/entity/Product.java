package com.bit.jk_fashion_system.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity //applied as an entity class
@Table(name ="product") //for map with given table
@Data//GENERATE SETTERS AND GETTERS
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all grgument constructor
public class Product {

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

    @Column(name = "image")
    private byte[] image;

     @Column(name = "image_path")
    private String image_path;


    @Column(name = "available_quantity")
    private  Integer available_quantity;

    @Column(name = "reorder_point")
    private  Integer reorder_point;

    @Column(name = "unit_price")
    private BigDecimal unit_price;

    @Column(name = "material_total_cost")
    private  BigDecimal material_total_cost;

    @Column(name = "note")
    private String note;

    @Column(name = "created_at")
    @NotNull
    private LocalDateTime created_at;

    @Column(name = "updated_at")
    private LocalDateTime updated_at;

    @Column(name = "deleted_at")
    private LocalDateTime deleted_at;

    @Column(name = "created_user")
    private Integer addeduser;

    @Column(name = "updated_user")
    private Integer updateduser;

    @Column(name = "deleted_user")
    private Integer deleteduser;


    @ManyToOne(optional = true)
    @JoinColumn(name="product_status_id", referencedColumnName = "id")
    private ProductStatus product_status_id;


    @ManyToOne(optional = true)
    @JoinColumn(name="product_category_id", referencedColumnName = "id")
    private ProductCategory product_category_id;

    @ManyToOne(optional = false)
    @JoinColumn(name="Gender_id", referencedColumnName = "id")
    private Gender Gender_id;

    @ManyToOne(optional = false)
    @JoinColumn(name="size_id", referencedColumnName = "id")
    private Size size_id;


    @OneToMany(mappedBy = "product_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductHasMaterial> productMaterialList;


    public Product(Integer id, String name, String code, BigDecimal unit_price ){
        this.id = id;
        this.name = name;
        this.code = code;
        this.unit_price = unit_price;
    }

 
}
