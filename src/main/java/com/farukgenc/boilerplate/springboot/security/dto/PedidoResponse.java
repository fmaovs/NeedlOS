package com.farukgenc.boilerplate.springboot.security.dto;

import com.farukgenc.boilerplate.springboot.model.Estado;
import com.farukgenc.boilerplate.springboot.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoResponse {
    private Long id; // Identificador del pedido
    private String customerName;// Nombre del cliente asociado
    private String customerLastName; // Apellido del cliente asociado
    private Long telefono; // Telefono del cliente asociado
    private Date fechaPedido; // Fecha de realizacion del pedido
    private Date fechaEntrega; // Fecha de entrega de la prenda
    private double saldo; // Saldo pendiente del pedido
    private double totalAbonos; // Total de abonos realizados
    private List<PrendaDTO> prenda; // Nombre de la prenda asociada
    private String sastre; // Sastre encargado del pedido
    private Estado estado; // Estado actual del pedido
    private String concepto; // Concepto del pedido

    public String orElseThrow(Object pedidoNoEncontrado) {
        return String.valueOf(pedidoNoEncontrado);
    }
}
