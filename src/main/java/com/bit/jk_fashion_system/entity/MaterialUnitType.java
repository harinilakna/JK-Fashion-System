package com.bit.jk_fashion_system.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "unit_type")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialUnitType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    @Column(name = "id")
    private  Integer id;

    @Column(name = "name")
    @NotNull
    private String name;
}
