package com.farukgenc.boilerplate.springboot.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @DateTimeFormat(pattern = "dd-MM-yyyy")
    @Column(nullable = false)
    private Date date;

    @Column(nullable = false)
    private double total_abonos;

    @Column(nullable = false)
    private double saldo;

    @ManyToOne(fetch = FetchType.EAGER)
    private Customer customer;

    @OneToMany(mappedBy = "pedido", fetch = FetchType.EAGER, orphanRemoval = true)
    private List<DetallePedido> detalles;

    @Column(name = "foto_recogida", nullable = true)
    private String fotoRecogida; // Ruta o nombre del archivo de la foto

    public double getTotalAbonos() {
        return total_abonos;
    }

    public void setTotalAbonos(double totalAbonos) {
        this.total_abonos = totalAbonos;
    }


}
