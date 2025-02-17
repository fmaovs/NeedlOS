package com.farukgenc.boilerplate.springboot.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Materiales")
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_material;

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(nullable = false, length = 255)
    private String  descripcion;

    @Column(updatable = false, nullable = false)
    @CreationTimestamp
    private LocalDateTime fecha;

    @Column(nullable = false)
    private LocalDateTime fecha_actualizacion;
    @PreUpdate
    public void actualizacion() {
        this.fecha_actualizacion = LocalDateTime.now();
    }

    @Column(updatable = false, nullable = false)
    @Positive(message = "El precio debe ser un número positivo")
    private Double precio;

    @Column(nullable = false)
    @Positive(message = "el stock_actual debe ser un número positivo")
    @Min(value = 1, message = "el stock_actual mínimo debe ser 1")
    private Long stockActual;
}
