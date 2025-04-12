package com.farukgenc.boilerplate.springboot.controller;


import com.farukgenc.boilerplate.springboot.model.Ingreso;
import com.farukgenc.boilerplate.springboot.service.IngresoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ingresos")
@CrossOrigin(origins = "*")
public class IngresoController {

    @Autowired
    private IngresoService ingresoService;

    @PostMapping("/nuevo")
    public Ingreso nuevoIngreso(@RequestBody Ingreso ingreso){
        return ingresoService.nuevoIngreso(ingreso);
    }

    @GetMapping("/all")
    public List<Ingreso> obtenerIngresos(){
        return ingresoService.obtenerIngresos();
    }
}
