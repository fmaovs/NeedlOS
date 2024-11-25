package com.farukgenc.boilerplate.springboot.controller;

import com.farukgenc.boilerplate.springboot.model.Material;
import com.farukgenc.boilerplate.springboot.model.MaterialIngresado;
import com.farukgenc.boilerplate.springboot.model.MaterialUsado;
import com.farukgenc.boilerplate.springboot.security.dto.MaterialIngresadoRequest;
import com.farukgenc.boilerplate.springboot.security.dto.MaterialUsadoRequest;
import com.farukgenc.boilerplate.springboot.service.MaterialInventarioService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventario")
public class InventarioController {

    @Autowired
    private MaterialInventarioService inventario;

    @PostMapping("/nuevo")
    @Operation(tags = "inventario", description = "agregar nuevo material al inventario")
    public Material nuevomaterialingresado(@RequestBody Material material){
        return inventario.nuevomaterial(material);
    }

    @GetMapping("/all")
    @Operation(tags = "inventario", description = "ver todo el inventario")
    public ResponseEntity<List<Material>> inventarioActual(){
        return ResponseEntity.ok(inventario.inventarioActual());
    }


    @PutMapping("/ingresando")
    @Operation(tags = "inventario", description = "agrega la cantida del material")
    public ResponseEntity<String> ingresarMaterial(@RequestBody MaterialIngresadoRequest request){
        inventario.ingresaMaterial(request);
        return ResponseEntity.ok("Stock actualizado correctamente" );
    }

    @PutMapping("/Usando")
    @Operation(tags = "inventario", description = "restar la cantida del  material")
    public ResponseEntity<String> usarMaterial(@RequestBody MaterialUsadoRequest request) {
        inventario.usarMaterial(request);
        return ResponseEntity.ok("Stock actualizado correctamente");
    }
}
