package com.farukgenc.boilerplate.springboot.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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
    @Column(name = "id_detalle_pedido")
    private Long id_detalle_pedido;

    @NotNull(message = "Debe estar asociado a un pedido")
    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false, foreignKey = @ForeignKey(name = "fk_detallePedido_pedido"))
    private Pedido pedido;

    @NotNull(message = "Debe tener una prenda asociada")
    @ManyToOne
    @JoinColumn(name = "prenda_id", nullable = false, foreignKey = @ForeignKey(name = "fk_detallePedido_prenda"))
    private Prenda prenda;

    @NotNull(message = "Debe tener un sastre asignado")
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_detallePedido_user"))
    private User user;

    @Min(value = 1, message = "la cantidad debe ser al menos 1")
    @Column(nullable = false)
    private int cantidad; // Cantidad de prendas del mismo tipo

    @Positive(message = "el valor debe ser un numero positivo")
    @Column(nullable = false)
    private double valorTotal;

    @NotBlank(message = "El campo no puede estar vacio")
    @Size(min = 10, max = 100, message = "El campo no debe exceder 100 caracteres")
    @Column(nullable = false, length = 100)
    private String detallePedido;

    @NotNull(message = "Debe tener asignado un concepto")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Concepto concepto;

    @OneToMany(mappedBy = "detallePedido", fetch = FetchType.EAGER, orphanRemoval = true)
    private List<EstadoPedido> estados = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "estado_actual_id", foreignKey = @ForeignKey(name = "fk_detallePedido_EstadoActual"))
    private EstadoPedido estadoActual;

    @FutureOrPresent(message = "La fecha no puede ser del pasado")
    @Column(name = "fecha_entrega", nullable = false)
    private Date fechaEntrega;

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
