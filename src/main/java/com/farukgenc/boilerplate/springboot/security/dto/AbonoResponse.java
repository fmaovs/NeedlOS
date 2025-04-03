package com.farukgenc.boilerplate.springboot.security.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Data
@Setter
@Getter
public class AbonoResponse {
    private Long id;
    private double monto;
    private Date fecha;
    private Long pedidoId;
    private String metodoPago;
}
