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
import java.util.Optional;

@RestController
@RequestMapping("/inventario")
@CrossOrigin(origins = "*") /*Cambio de crossOrigin*/
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

    @GetMapping("/baja-cantidad")
    @Operation(tags = "inventario", description = "muestra los materiales que estan próximos a agotarse")
    public ResponseEntity<List<Material>> listarMaterialesConBajaCantidad() {
        List<Material> materiales = inventario.obtenerMaterialesBajaCantidad();
        return ResponseEntity.ok(materiales);
    }

    @GetMapping("/{id}")
    @Operation(tags = "inventario", description = "muestra los materiales por Id")
    public ResponseEntity<Material> getMaterialById(@RequestParam("id")Long id) {
        Optional<Material> material = inventario.getMaterialById(id);
        return material.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
