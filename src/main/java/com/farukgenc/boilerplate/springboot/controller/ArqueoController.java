package com.farukgenc.boilerplate.springboot.controller;

import com.farukgenc.boilerplate.springboot.model.Abono;
import com.farukgenc.boilerplate.springboot.security.dto.AbonoDTO;
import com.farukgenc.boilerplate.springboot.service.ArqueoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/arqueo")
@CrossOrigin(origins = "*")
public class ArqueoController {

    @Autowired
    private ArqueoService arqueoService;

    @GetMapping("/abonos/{date}")
    public ResponseEntity<List<AbonoDTO>> obtenerAbonosDelDia(@PathVariable String date) {
        List<AbonoDTO> abonos = arqueoService.obtenerAbonosDelDia(date);
        return ResponseEntity.ok(abonos);
    }

    @GetMapping("/total-abonos/{date}")
    public ResponseEntity<Double> obtenerTotalAbonosDelDia(@PathVariable String date) {
        double total = arqueoService.obtenerTotalAbonosDelDia(date);
        return ResponseEntity.ok(total);
    }
}
