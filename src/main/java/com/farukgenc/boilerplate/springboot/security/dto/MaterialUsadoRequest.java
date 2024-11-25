package com.farukgenc.boilerplate.springboot.security.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialUsadoRequest {
    private Long id_prenda;
    private Long id_material;
    private Integer cantidad_usada;
}
