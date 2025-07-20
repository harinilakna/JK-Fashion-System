package com.bit.jk_fashion_system.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "privilege")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Privilege {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "sel")
    private Boolean sel;

    @Column(name = "inst")
    private Boolean inst;

    @Column(name = "upd")
    private Boolean upd;

    @Column(name = "del")
    private Boolean del;

    @ManyToOne
    @JoinColumn(name = "role_id", referencedColumnName = "id")//join column condition
    private Role role_id;

    @ManyToOne
    @JoinColumn(name = "module_id",  referencedColumnName = "id")
    private Module module_id;
}
