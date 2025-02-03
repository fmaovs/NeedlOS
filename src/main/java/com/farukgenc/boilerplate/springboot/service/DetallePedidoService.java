package com.farukgenc.boilerplate.springboot.service;

import com.farukgenc.boilerplate.springboot.model.*;
import com.farukgenc.boilerplate.springboot.repository.DetallePedidoRepository;
import com.farukgenc.boilerplate.springboot.repository.EstadoPedidoRepository;
import com.farukgenc.boilerplate.springboot.security.dto.EstadoPedidoDTO;
import com.farukgenc.boilerplate.springboot.security.service.UserServiceImpl;
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
    @Autowired
    private UserServiceImpl userService;


    @Transactional
    public void cambiarSastre(Long detallePedidoId, Long userId) {
        // 1. Buscar el detalle del pedido
        DetallePedido detallePedido = detallePedidoRepository.findById(detallePedidoId)
                .orElseThrow(() -> new IllegalArgumentException("DetallePedido no encontrado"));
        // 2. Buscar el usuario
        try {
            User user = userService.findById(userId);
        } catch (Exception e) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
        // 2. Cambiar el usuario sastre

        detallePedido.setUser(userService.findById(userId));

        // 3. Guardar los cambios
        detallePedidoRepository.save(detallePedido);
    }

    public Optional<DetallePedido> findById(Long id) {
        return Optional.of(detallePedidoRepository.findById(id).get());
    }



}
