package com.farukgenc.boilerplate.springboot.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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

    @OneToMany(mappedBy = "prenda", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetallePedido> detalles;

    public Long getId() {
        return id_prenda;
    }

    //******************************************

    // faltan foreignkey con tablas
    // detalle de pedido
    // empleado

    //******************************************

}
