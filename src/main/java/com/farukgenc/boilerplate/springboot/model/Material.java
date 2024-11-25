package com.farukgenc.boilerplate.springboot.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Materiales")
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_material;

    @Column
    private String nombre;

    @Column
    private String  descripcion;

    @Column
    private Long stock_actual;
}
