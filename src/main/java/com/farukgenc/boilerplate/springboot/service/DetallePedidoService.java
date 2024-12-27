package com.farukgenc.boilerplate.springboot.service;

import com.farukgenc.boilerplate.springboot.model.DetallePedido;
import com.farukgenc.boilerplate.springboot.model.Estado;
import com.farukgenc.boilerplate.springboot.model.EstadoPedido;
import com.farukgenc.boilerplate.springboot.repository.DetallePedidoRepository;
import com.farukgenc.boilerplate.springboot.repository.EstadoPedidoRepository;
import com.farukgenc.boilerplate.springboot.security.dto.EstadoPedidoDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DetallePedidoService {
    @Autowired
    private DetallePedidoRepository detallePedidoRepository;
    @Autowired
    private EstadoPedidoRepository estadoPedidoRepository;

    @Transactional
    public void cambiarEstado(Long detallePedidoId, Estado nuevoEstado) {
        // 1. Buscar el detalle del pedido
        DetallePedido detallePedido = detallePedidoRepository.findById(detallePedidoId)
                .orElseThrow(() -> new IllegalArgumentException("DetallePedido no encontrado"));
        System.out.println("detallePedido: " + detallePedido);

        // 2. Crear un nuevo registro de EstadoPedido
        EstadoPedido estadoPedido = new EstadoPedido();
        estadoPedido.setEstado(nuevoEstado);
        estadoPedido.setFechaCambio(LocalDateTime.now());
        estadoPedido.setDetallePedido(detallePedido);
        estadoPedidoRepository.save(estadoPedido);
        System.out.println("estadoPedido: " + estadoPedido);

        // 3. Agregar al historial de estados
        detallePedido.getEstados().add(estadoPedido);

        // 4. Actualizar el estado actual
        detallePedido.setEstadoActual(estadoPedido);

        // 5. Guardar los cambios
        detallePedidoRepository.save(detallePedido);
    }

    public Optional<DetallePedido> findById(Long id) {
        return Optional.of(detallePedidoRepository.findById(id).get());
    }



}
