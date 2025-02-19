package com.farukgenc.boilerplate.springboot.controller;

import com.farukgenc.boilerplate.springboot.model.CategoriaGasto;
import com.farukgenc.boilerplate.springboot.model.Gastos;
import com.farukgenc.boilerplate.springboot.security.dto.GastosRequest;
import com.farukgenc.boilerplate.springboot.service.GastoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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

    @GetMapping("/EntreFechas")
    public double obtenervalorTotalEnRango(@RequestParam("fechaInicio")String fechaInicio,
                                           @RequestParam("fechaFin")String fechaFin ){
        LocalDate inicio = LocalDate.parse(fechaInicio);
        LocalDate fin = LocalDate.parse(fechaFin);
        return gastosService.obtenervalorTotalEnRango(inicio, fin);
    }

    @GetMapping("/dias")
    public double obtenerValorToalDiario(@RequestParam("Día")String fecha){

        LocalDate Dia = LocalDate.parse(fecha);
        return gastosService.obtenervalorTotalDia(Dia);
    }

    @GetMapping("/categoria/vales/semanal/empleado/{id}")
    public double obtenerValesSemanalesPorEmpleado(@PathVariable Long id, @RequestParam("fechaInicio")LocalDate fechaInicio, @RequestParam("fechaFin")LocalDate fechaFin, @RequestParam("categoria") CategoriaGasto categoria) {
        return gastosService.obtenerValesByEmpleado(id, fechaInicio, fechaFin, categoria);
    }
}
