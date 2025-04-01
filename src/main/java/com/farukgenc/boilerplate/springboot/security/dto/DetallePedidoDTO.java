package com.farukgenc.boilerplate.springboot.security.dto;

import com.farukgenc.boilerplate.springboot.model.User;
import lombok.*;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DetallePedidoDTO {
    private Long prendaId; // ID de la prenda asociada
    private int cantidad;  // Cantidad de unidades de la prenda
    private String detallePedido;
    private Long user;     // Sastre que se encarga del pedido
    private String concepto; // Concepto del pedido
}
