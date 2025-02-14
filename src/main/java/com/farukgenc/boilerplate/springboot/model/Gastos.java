package com.farukgenc.boilerplate.springboot.model;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Entity
@Table(name = "gastos")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Gastos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_gasto")
    private Long idGasto;

    @Column(nullable = false, length = 255)
    private String descripcion;

    @Column(nullable = false)
    @Positive(message = "la el monto debe ser un número positivo")
    private Double monto;

    @DateTimeFormat(pattern = "dd-MM-yyyy")
    @Column(nullable = false)
    private Date fecha;

    @Enumerated(EnumType.STRING)
    private CategoriaGasto categoria;

    @ManyToOne
    @JoinColumn(name = "empleado_id", referencedColumnName = "id", foreignKey = @ForeignKey(name = "fk_gasto_empleado"))
    private User empleado;

}
