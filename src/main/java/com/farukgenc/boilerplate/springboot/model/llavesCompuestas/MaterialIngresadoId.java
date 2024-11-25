package com.farukgenc.boilerplate.springboot.model.llavesCompuestas;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class MaterialIngresadoId implements Serializable{
        private Long id_ingreso;
        private Long id_material;
}
