package com.farukgenc.boilerplate.springboot.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "abono")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Abono {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Double Monto;
    @Column(nullable = false)
    private Date fecha;

    @Enumerated(EnumType.STRING)
    private MetodoPago metodoPago;

    @ManyToOne(fetch = FetchType.EAGER)
    private DetallePedido detallePedido;

}
