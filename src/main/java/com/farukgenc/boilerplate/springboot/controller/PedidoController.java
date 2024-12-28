package com.farukgenc.boilerplate.springboot.controller;

import com.farukgenc.boilerplate.springboot.security.dto.PedidoDTO;
import com.farukgenc.boilerplate.springboot.security.dto.PedidoResponse;
import com.farukgenc.boilerplate.springboot.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*")
public class PedidoController {
    @Autowired
    private PedidoService pedidoService;

    @GetMapping("/all")
    public ResponseEntity<List<PedidoResponse>> getOrders() {
        return ResponseEntity.ok(pedidoService.findAll());
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<PedidoResponse>> getOrdersByEstado(@PathVariable String estado) {
        return ResponseEntity.ok(pedidoService.findAllByEstado(estado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<PedidoResponse>> getOrderById(@PathVariable Long id_order) {
        return ResponseEntity.ok(pedidoService.findById(id_order));
    }

    @PostMapping
    public ResponseEntity<String> createOrder(@RequestBody PedidoDTO pedidoDTO) {
        try {
            pedidoService.createPedido(pedidoDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body("Pedido creado correctamente");
        } catch (Exception e) {
            // Imprime el error en la consola para depuración
            e.printStackTrace();

            // Respuesta detallada para identificar el problema
            String errorMessage = "Error al crear el pedido: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
        }
    }

}
