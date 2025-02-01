package com.farukgenc.boilerplate.springboot.security.dto;

import lombok.Data;

import java.util.Date;

@Data
public class AbonoDTO {
    private Long idPedido;
    private double monto;
    private Date fecha;
    private String metodoPago;


}
