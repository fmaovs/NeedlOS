package com.farukgenc.boilerplate.springboot.model;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
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

    @NotBlank(message = "la descripcionno puede esatr vacia")
    @Size(min = 5, max = 100)
    @Column(nullable = false, length = 100)
    private String descripcion;

    @Column(nullable = false)
    @Positive(message = "la el monto debe ser un número positivo")
    private Double monto;

    @CreationTimestamp
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    @Column(nullable = false)
    private LocalDate fecha;


    @NotNull(message = "Debe seleccionar una categoría")
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CategoriaGasto categoria;

    @NotNull(message = "Debe asociar un empleado")
    @ManyToOne
    @JoinColumn(nullable = false, name = "empleado_id", referencedColumnName = "id", foreignKey = @ForeignKey(name = "fk_gasto_empleado"))
    private User empleado;

}
