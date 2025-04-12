package com.farukgenc.boilerplate.springboot.controller;

import com.farukgenc.boilerplate.springboot.model.DetallePedido;
import com.farukgenc.boilerplate.springboot.model.Estado;
import com.farukgenc.boilerplate.springboot.model.EstadoPedido;
import com.farukgenc.boilerplate.springboot.security.dto.EstadoPedidoDTO;
import com.farukgenc.boilerplate.springboot.service.DetallePedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/detalle-pedido")
public class DetallePedidoController {
    @Autowired
    private DetallePedidoService detallePedidoService;

}
