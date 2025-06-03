package com.farukgenc.boilerplate.springboot.model;


import com.farukgenc.boilerplate.springboot.model.llavesCompuestas.MaterialIngresadoId;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;


import java.time.LocalDateTime;
import java.util.Date;


//llave compuesta


@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Material_ingresaso")
public class MaterialIngresado {

    @EmbeddedId
    private MaterialIngresadoId id_MaterialIngresado;


    @NotNull(message = "El precio es obligatorio")
    @Column(updatable = false, nullable = false)
    @Positive(message = "El precio debe ser un número positivo")
    private Double precio;



    @Column(updatable = false, nullable = false)
    @NotNull(message = "La cantidad ingresada es obligatoria")
    @Positive(message = "La cantidad debe ser positiva")
    @Min(value = 1, message = "La cantidad mínima debe ser 1")
    private Long cantidad_ingresada;

    @Column(updatable = false, nullable = false)
    @CreationTimestamp
    private LocalDateTime fechaIngreso;

    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull(message = "Debe seleccionar un material")
    @MapsId("id_material")
    @JoinColumn(name = "id_material", nullable = false, foreignKey = @ForeignKey(name = "foreignkey_material_materialIngresadp"))
    private Material material;


    @NotNull(message = "Debe seleccionar un ingreso")
    @ManyToOne
    @MapsId("id_ingreso")
    @JoinColumn(name = "id_ingreso", nullable = false, foreignKey = @ForeignKey(name = "foreignkey_ingreso_materialIngresado"))
    private Ingreso ingreso;

}
