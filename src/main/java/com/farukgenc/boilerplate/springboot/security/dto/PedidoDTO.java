package com.farukgenc.boilerplate.springboot.security.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PedidoDTO {
    private Date date;
    private double totalAbonos;
    private double saldo;
    private Long customerId; // ID del cliente asociado
    private List<DetallePedidoDTO> detalles; // Lista de detalles del pedido
}
