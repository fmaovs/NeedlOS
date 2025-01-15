package com.farukgenc.boilerplate.springboot.controller;

import com.farukgenc.boilerplate.springboot.model.Prenda;
import com.farukgenc.boilerplate.springboot.security.dto.PrendaDTO;
import com.farukgenc.boilerplate.springboot.security.dto.PrendaRequest;
import com.farukgenc.boilerplate.springboot.security.dto.PrendaResponseDTO;
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
    public List<PrendaResponseDTO> getAllPrendas() {
        return prendaService.getAllPrendas();
    }

    @GetMapping("/{id}")
    public PrendaResponseDTO getPrendaById(@PathVariable Long id) {
        return prendaService.getPrendaById(id);
    }

    @PostMapping("/save")
    public Prenda savePrenda(@RequestBody PrendaRequest prenda) {
        return prendaService.savePrenda(prenda);
    }
}
