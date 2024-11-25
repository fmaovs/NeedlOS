package com.farukgenc.boilerplate.springboot.security.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialIngresadoRequest {
    private Long id_material;
    private Long id_ingreso;
    private Double precio;
    private Long cantidad_ingresada;
}
