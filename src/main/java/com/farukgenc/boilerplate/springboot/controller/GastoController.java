package com.farukgenc.boilerplate.springboot.controller;

import com.farukgenc.boilerplate.springboot.model.Gastos;
import com.farukgenc.boilerplate.springboot.security.dto.GastosRequest;
import com.farukgenc.boilerplate.springboot.service.GastoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("gastos")
public class GastoController {

    @Autowired
    private GastoService gastosService;

    @PostMapping("/crear")
    public ResponseEntity<String> crearGasto(@RequestBody GastosRequest gastosRequest) {
        try {
            gastosService.nuevoGasto(gastosRequest);
            return ResponseEntity.ok("Gasto creado");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al crear el gasto: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<GastosRequest>> obtenerTodosLosGastos() {
        return ResponseEntity.ok(gastosService.obtenerGastos());
    }
}
