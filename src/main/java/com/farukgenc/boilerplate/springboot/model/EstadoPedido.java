package com.farukgenc.boilerplate.springboot.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EstadoPedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estado_pedido", nullable = false)
    private Long id;

    @NotNull(message = "Debe tener un estado asisgnado")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Estado estado;

    @NotNull(message = "La fecha de cambio no puede ser nula")
    @Column(name = "fecha_cambio", nullable = false)
    private LocalDateTime fechaCambio;

    @NotNull(message = "Debe tener asociado un detalle de pedido")
    @ManyToOne
    @JoinColumn(name = "detalle_pedido_id", nullable = false, foreignKey = @ForeignKey(name = "fk_estado_detellePedido"))
    private DetallePedido detallePedido;
}
