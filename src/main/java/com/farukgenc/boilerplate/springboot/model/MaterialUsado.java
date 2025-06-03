package com.farukgenc.boilerplate.springboot.model;

import com.farukgenc.boilerplate.springboot.model.llavesCompuestas.MaterialUsadoId;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
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
@Table(name = "Material_usado")
public class MaterialUsado {

    @EmbeddedId
    private MaterialUsadoId id_MaterialUsado;

    @Column(nullable = false)
    @NotNull(message = "el campo no puede estar vacio")
    @Min(value = 1, message = "La cantidad mínima debe ser al menos 1")
    private Integer cantidad_usada;

    @Column(updatable = false, nullable = false)
    @CreationTimestamp
    private LocalDateTime fechaConsumo;

    @ManyToOne
    @NotNull(message = "el campo no puede esatr vacio")
    @MapsId("id_prenda")
    @JoinColumn(name = "id_prenda", nullable = false, foreignKey = @ForeignKey(name = "foreignkey_prenda_materialUsado"))
    private Prenda prenda;


    @ManyToOne
    @NotNull(message = "el campo no puede esatr vacio")
    @MapsId("id_material")
    @JoinColumn(name = "id_material", nullable = false, foreignKey = @ForeignKey(name = "foreignkey_material_materialUsado"))
    private Material material;

}

