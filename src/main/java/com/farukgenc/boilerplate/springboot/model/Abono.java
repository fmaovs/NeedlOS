package com.farukgenc.boilerplate.springboot.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
    @Column(name = "id_abono")
    private Long id;

    @Positive(message = "El monto debe ser mayor que cero")
    @DecimalMax(value = "1000000.00", message = "El monto no debe superar 1 millón")
    @Column(nullable = false)
    private Double monto;

    @NotNull(message = "La fecha no puede ser nula")
    @Column(nullable = false)
    private Date fecha;

    @NotNull(message = "Debe seleccionar un método de pago")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MetodoPago metodoPago;

    @NotNull(message = "El abono debe estar asociado a un pedido")
    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false, foreignKey = @ForeignKey(name = "fk_abono_pedido"))
    private Pedido pedido;
}