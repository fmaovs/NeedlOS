package com.farukgenc.boilerplate.springboot.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Generated;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Ingresos")
public class Ingreso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ingreso")
    private Long id_ingreso;

    @Column(updatable = false, nullable = false)
    @CreationTimestamp
    private Date fecha_ingreso;

    @NotBlank(message = "La clase de ingreso no puede estar vacía")
    @Size(min = 3, max = 50, message = "La clase de ingreso debe tener entre 3 y 50 caracteres")
    @Column(updatable = false, nullable = false, length = 50)
    private String claseIngreso;
}
