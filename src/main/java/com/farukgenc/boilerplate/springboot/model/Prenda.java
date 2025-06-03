package com.farukgenc.boilerplate.springboot.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Prendas")
public class Prenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_prenda")
    private Long id_prenda;

    @NotBlank(message = "el campo no puede estar vacio")
    @Size(min = 3, max = 50)
    @Column(nullable = false, length = 50)
    private String descripcion;

    @NotNull(message = "el campo no puede estar vacio")
    @Positive(message = "la el monto debe ser un número positivo")
    @Column(nullable = false)
    private Double valor;

    @OneToMany(mappedBy = "prenda", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetallePedido> detalles;

    public Long getId() {
        return id_prenda;
    }


}
