package com.farukgenc.boilerplate.springboot.controller;

import com.farukgenc.boilerplate.springboot.model.CategoriaGasto;
import com.farukgenc.boilerplate.springboot.model.Gastos;
import com.farukgenc.boilerplate.springboot.security.dto.GastosRequest;
import com.farukgenc.boilerplate.springboot.service.GastoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("gastos")
@CrossOrigin(origins = "*")
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

    @GetMapping("valor-total/dias")
    public double obtenerValorToalDiario(@RequestParam("Día")String fecha){

        LocalDate Dia = LocalDate.parse(fecha);
        return gastosService.obtenervalorTotalDia(Dia);
    }

    @GetMapping("/detalles/dia")
    public ResponseEntity<List<GastosRequest>> obtenerDetallesGastosDia(@RequestParam("Día") String fecha){
        LocalDate Dia = LocalDate.parse(fecha);
        return ResponseEntity.ok(gastosService.obtenerDetallesGastosDia(Dia));
    }

    @GetMapping("/categoria/vales/semanal/empleado/{id}")
    public double obtenerValesSemanalesPorEmpleado(@PathVariable Long id, @RequestParam("fechaInicio")LocalDate fechaInicio, @RequestParam("fechaFin")LocalDate fechaFin, @RequestParam("categoria") CategoriaGasto categoria) {
        return gastosService.obtenerValesByEmpleado(id, fechaInicio, fechaFin, categoria);
    }

    @GetMapping("/valor/categoria/EntreFechas")
    public double obtenerTotalGastosPorCategoriaYRango(@RequestParam("categoria") CategoriaGasto categoria, @RequestParam("fechaInicio")LocalDate fechaInicio, @RequestParam("fechaFin")LocalDate fechaFin){
        return  gastosService.obtenerTotalGastosPorCategoriaYRango(categoria,fechaInicio, fechaFin);
    }

    @GetMapping("/detalles/categoria/EntreFechas")
    public ResponseEntity<List<GastosRequest>> obtenerDetallesGastosPorCategoriaYRango(@RequestParam("categoria") CategoriaGasto categoria, @RequestParam("fechaInicio")LocalDate fechaInicio, @RequestParam("fechaFin") LocalDate fechaFin){
        return ResponseEntity.ok(gastosService.obtenerDetallesGastosorCategoriaYRango(categoria, fechaInicio, fechaFin));
    }

    /*----------controller para pdf de vale----------*/

    @GetMapping("/PDF/vale")
    public ResponseEntity<byte[]> generarPdfVale(@RequestParam Long id){
        GastosRequest gasto = gastosService.obtenerGastoId(id);

        byte[] pdfContent = gastosService.pdfVale(gasto);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=VAle-" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfContent);

    }

}
