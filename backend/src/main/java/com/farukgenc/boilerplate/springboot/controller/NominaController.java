package com.farukgenc.boilerplate.springboot.controller;

import com.farukgenc.boilerplate.springboot.security.dto.PedidoResponse;
import com.farukgenc.boilerplate.springboot.service.NominaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/nomina")
@CrossOrigin(origins = "*")
public class NominaController {

    @Autowired
    private NominaService nominaService;

    @GetMapping("/pedidos/{UserId}")
    public List<PedidoResponse> obtenerPedidosByUserAndDateBetween(@PathVariable Long UserId,
                                                                   @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date fechaInicio,
                                                                   @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date fechaFin) {
        return nominaService.obtenerPedidosByUserAndDateBetween(UserId, fechaInicio, fechaFin);
    }

}
