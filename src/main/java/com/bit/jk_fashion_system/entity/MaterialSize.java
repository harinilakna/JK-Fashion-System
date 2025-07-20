package com.bit.jk_fashion_system.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "material_size")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialSize {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    @Column(name = "id")
    private  Integer id;

    @Column(name = "name")
    private String name;
}
