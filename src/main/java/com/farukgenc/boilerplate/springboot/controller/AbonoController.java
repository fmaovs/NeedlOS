package com.farukgenc.boilerplate.springboot.controller;

import com.farukgenc.boilerplate.springboot.model.Abono;
import com.farukgenc.boilerplate.springboot.security.dto.AbonoDTO;
import com.farukgenc.boilerplate.springboot.service.AbonoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping("/abonos")
@CrossOrigin(origins = "*")
public class AbonoController {

    @Autowired
    private AbonoService abonoService;

    @PostMapping
    public Abono createAbono(@RequestBody AbonoDTO abonoDTO) throws ParseException {
        return abonoService.createAbono(abonoDTO);
    }

    @GetMapping("/{id}")
    public Abono getAbono(@PathVariable Long id) {
        return abonoService.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Abono no encontrado"));
    }

    @GetMapping("/all")
    public List<Abono> getAbonos() {
        return abonoService.getAbonos();
    }
}
