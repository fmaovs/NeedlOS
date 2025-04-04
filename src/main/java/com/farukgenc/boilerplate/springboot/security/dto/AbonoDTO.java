package com.farukgenc.boilerplate.springboot.security.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Data
@Getter
@Setter
public class AbonoDTO {
    private Long idPedido;
    private double monto;
    private String metodoPago;

}
