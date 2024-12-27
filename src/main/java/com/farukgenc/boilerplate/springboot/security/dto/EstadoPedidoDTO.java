package com.farukgenc.boilerplate.springboot.security.dto;

import com.farukgenc.boilerplate.springboot.model.Estado;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EstadoPedidoDTO {
    private Long id;
    private String estado;
    private String fechaCambio;

    public EstadoPedidoDTO(Long id, Estado estado, LocalDateTime fechaCambio) {
    }

    public EstadoPedidoDTO(Estado estado, LocalDateTime fechaCambio) {
    }
}
