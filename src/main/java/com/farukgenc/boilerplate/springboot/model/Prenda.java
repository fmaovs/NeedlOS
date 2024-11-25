package com.farukgenc.boilerplate.springboot.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Prendas")
public class Prenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_prenda;

    @Column
    private String descripcion;

    @Column
    private Double valor;

    //******************************************

    //faltan foreignkey con tablas
    // detalle de pedido
    // empleado

    //******************************************

}
