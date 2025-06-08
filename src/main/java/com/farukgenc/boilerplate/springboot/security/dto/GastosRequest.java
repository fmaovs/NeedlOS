package com.farukgenc.boilerplate.springboot.security.dto;

import com.farukgenc.boilerplate.springboot.model.CategoriaGasto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GastosRequest {

    private String descripcion;
    private Double monto;
    private CategoriaGasto categoria;
    private Long empleadoId;
}
