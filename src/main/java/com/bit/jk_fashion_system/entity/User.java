package com.bit.jk_fashion_system.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.Set;

@Entity //applied as an entity class
@Table(name ="user") //for map with given table
@Data//GENERATE SETTERS AND GETTERS
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all grgument constructor
public class User {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private Integer id ;

    @Column(name = "username", unique = true)
    @NotNull
    private String username ;

    @Column(name = "password")
    @NotNull
    private String password;

    @Column(name = "email", unique = true)
    @NotNull
    private String email ;

    @Column(name = "status")
    @NotNull
    private Boolean status;

    @Column(name = "created_at")
    @NotNull
    private LocalDateTime created_at;

    @Column(name = "note")
    private String note;
    
    @ManyToOne (cascade = CascadeType.MERGE)
    @JoinColumn(name="employee_id", referencedColumnName = "id")
    private Employee employee_id;


    //user and role has many to many relationship
    @ManyToMany(cascade = CascadeType.MERGE)
    @JoinTable(name = "user_has_role", joinColumns = @JoinColumn(name="user_id"),
            inverseJoinColumns = @JoinColumn(name="role_id"))
    private Set<Role> roles;


    private byte[] photo;

    @Column(name = "photopath")
    private String photopath ;

}
