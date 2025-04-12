package com.farukgenc.boilerplate.springboot.security.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

@Data
@Getter
@Setter
public class InformeDTO {
    private LocalDate fecha;
    private double ingresos;
    private double gastos;
    private double saldo;
}
