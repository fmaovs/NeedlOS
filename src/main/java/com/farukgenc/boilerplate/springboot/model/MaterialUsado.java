package com.farukgenc.boilerplate.springboot.model;

import com.farukgenc.boilerplate.springboot.model.llavesCompuestas.MaterialUsadoId;
import jakarta.persistence.*;
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
    private Integer cantidad_usada;

    @Column(updatable = false, nullable = false)
    @CreationTimestamp
    private LocalDateTime fechaConsumo;


    @ManyToOne
    @MapsId("id_prenda")
    @JoinColumn(name = "id_prenda", nullable = false, foreignKey = @ForeignKey(name = "foreignkey_prenda_materialUsado"))
    private Prenda prenda;

    @ManyToOne
    @MapsId("id_material")
    @JoinColumn(name = "id_material", nullable = false, foreignKey = @ForeignKey(name = "foreignkey_material_materialUsado"))
    private Material material;

}

