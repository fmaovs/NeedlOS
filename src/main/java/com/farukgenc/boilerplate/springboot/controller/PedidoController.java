package com.farukgenc.boilerplate.springboot.controller;

import com.farukgenc.boilerplate.springboot.model.Pedido;
import com.farukgenc.boilerplate.springboot.security.dto.PedidoDTO;
import com.farukgenc.boilerplate.springboot.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class PedidoController {
    @Autowired
    private PedidoService pedidoService;

    @GetMapping("/all")
    public ResponseEntity<List<Pedido>> getOrders() {
        return ResponseEntity.ok(pedidoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.findById(id));
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
