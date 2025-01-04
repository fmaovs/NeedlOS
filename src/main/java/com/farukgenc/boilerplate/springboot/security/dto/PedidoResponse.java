package com.farukgenc.boilerplate.springboot.security.dto;

import com.farukgenc.boilerplate.springboot.model.Estado;
import com.farukgenc.boilerplate.springboot.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoResponse {
    private Long id; // Identificador del pedido
    private String customerName; // Nombre del cliente asociado
    private Long telefono; // Telefono del cliente asociado
    private Date fechaPedido; // Fecha de realizacion del pedido
    private Date fechaEntrega; // Fecha de entrega de la prenda
    private double saldo; // Saldo pendiente del pedido
    private String prenda; // Nombre de la prenda asociada
    private String sastre; // Sastre encargado del pedido
    private Estado estado; // Estado actual del pedido

    public String orElseThrow(Object pedidoNoEncontrado) {
        return String.valueOf(pedidoNoEncontrado);
    }
}
