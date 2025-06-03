package com.farukgenc.boilerplate.springboot.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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
    @Column(name = "id_material")
    private Long id_material;

    @NotBlank(message = "El nombre del material no puede estar vacío")
    @Size(min = 3, max = 50, message = "El nombre debe tener entre 3 y 50 caracteres")
    @Column(nullable = false, length = 50)
    private String nombre;

    @NotBlank(message = "La descripción no puede estar vacía")
    @Size(min = 5, max = 100, message = "La descripción debe tener entre 5 y 100 caracteres")
    @Column(nullable = false, length = 100)
    private String  descripcion;

    @Column(updatable = false, nullable = false)
    @CreationTimestamp
    private LocalDateTime fecha;

    @Column(nullable = false)
    @CreationTimestamp
    private LocalDateTime fecha_actualizacion;
    @PreUpdate
    public void actualizacion() {
        this.fecha_actualizacion = LocalDateTime.now();
    }


    @NotNull(message = "El precio es obligatorio")
    @Column(updatable = false, nullable = false)
    @Positive(message = "El precio debe ser un número positivo")
    private Double precio;

    @NotNull(message = "El stock actual es obligatorio")
    @Min(value = 1, message = "El stock debe ser al menos 1")
    @Positive(message = "El stock debe ser un número positivo")
    @Column(nullable = false)
    private Long stockActual;
}
