package com.farukgenc.boilerplate.springboot.security.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DetallePedidoDTO {
    private Long prendaId; // ID de la prenda asociada
    private int cantidad;  // Cantidad de unidades de la prenda
}
