package com.farukgenc.boilerplate.springboot.security.dto;

import lombok.*;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class AbonoResponse {
    private Long id;
    private double monto;
    private Date fecha;
    private Long pedidoId;
    private String metodoPago;

}
