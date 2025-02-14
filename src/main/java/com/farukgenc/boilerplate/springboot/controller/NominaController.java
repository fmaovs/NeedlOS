package com.farukgenc.boilerplate.springboot.controller;

import com.farukgenc.boilerplate.springboot.security.dto.PedidoResponse;
import com.farukgenc.boilerplate.springboot.service.NominaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/nomina")
@CrossOrigin(origins = "*")
public class NominaController {

    @Autowired
    private NominaService nominaService;

    @GetMapping("/pedidos/{username}")
    public List<PedidoResponse> obtenerPedidosByUserAndDateBetween(@PathVariable String username) {
        return nominaService.obtenerPedidosByUserAndDateBetween(username);
    }

}
