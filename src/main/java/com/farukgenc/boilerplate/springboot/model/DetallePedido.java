package com.farukgenc.boilerplate.springboot.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "detalle_pedido")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DetallePedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_detalle_pedido;

    @ManyToOne
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "prenda_id")
    private Prenda prenda;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private int cantidad; // Cantidad de prendas del mismo tipo

    @Column(nullable = false)
    private double valorTotal;


    @OneToMany(mappedBy = "detallePedido", fetch = FetchType.EAGER, orphanRemoval = true)
    private List<EstadoPedido> estados = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "estado_actual_id")
    private EstadoPedido estadoActual;

    private Date fechaEntrega;

    @OneToMany(mappedBy = "detallePedido", fetch = FetchType.EAGER, orphanRemoval = true)
    private List<Abono> abono;

    public void calcularValorTotal() {
        if (prenda != null) {
            this.valorTotal = prenda.getValor() * cantidad;
        }
    }

    public void addEstado(EstadoPedido estado) {
        estados.add(estado);
        estado.setDetallePedido(this);
    }

}
