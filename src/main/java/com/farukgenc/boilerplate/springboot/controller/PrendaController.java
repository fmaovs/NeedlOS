package com.farukgenc.boilerplate.springboot.controller;

import com.farukgenc.boilerplate.springboot.model.Prenda;
import com.farukgenc.boilerplate.springboot.security.dto.PrendaDTO;
import com.farukgenc.boilerplate.springboot.service.PrendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/prendas")
public class PrendaController {
    @Autowired
    private PrendaService prendaService;

    @GetMapping("/all")
    public List<PrendaDTO> getAllPrendas() {
        return prendaService.getAllPrendas();
    }

    @GetMapping("/{id}")
    public PrendaDTO getPrendaById(@PathVariable Long id) {
        return prendaService.getPrendaById(id);
    }

    @PostMapping("/save")
    public Prenda savePrenda(@RequestBody PrendaDTO prenda) {
        return prendaService.savePrenda(prenda);
    }
}
