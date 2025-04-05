package com.farukgenc.boilerplate.springboot.controller;

import com.farukgenc.boilerplate.springboot.model.Abono;
import com.farukgenc.boilerplate.springboot.model.Estado;
import com.farukgenc.boilerplate.springboot.security.dto.AbonoDTO;
import com.farukgenc.boilerplate.springboot.security.dto.PedidoResponse;
import com.farukgenc.boilerplate.springboot.service.AbonoService;
import com.farukgenc.boilerplate.springboot.service.ArqueoService;
import com.farukgenc.boilerplate.springboot.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/arqueo")
@CrossOrigin(origins = "*")
public class ArqueoController {

    @Autowired
    private ArqueoService arqueoService;

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private AbonoService abonoService;

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


    @GetMapping("pedidos/{date}")
    public ResponseEntity<List<PedidoResponse>> obtenerPedidosDelDia(@PathVariable String date) {
        List<PedidoResponse> pedidos = pedidoService.getPedidosByDate(date);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("pedidos/abonos/{date}")
    public ResponseEntity<List<PedidoResponse>> obtenerPedidosConAbonosDelDia(@PathVariable String date) {
        List<PedidoResponse> pedidos = arqueoService.obtenerPedidosDelDia(date);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("pedidos/{date}/{estado}")
    public ResponseEntity<List<PedidoResponse>> obtenerPedidosPorEstadoYFecha(@PathVariable String date, @PathVariable String estado) {
        List<PedidoResponse> pedidos = pedidoService.getPedidosByDateAndEstado(date, estado);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("prendas/{date}")
    public ResponseEntity<Integer> obtenerPedidosConPrendasDelDia(@PathVariable String date) {
        Integer cantidad = pedidoService.getCantidadPrendasByEstadoAndDate(date);
        return ResponseEntity.ok(cantidad);
    }

    @GetMapping("abonos/efectivo/{date}")
    public ResponseEntity<List<AbonoDTO>> obtenerAbonosPorMetodoPagoEnEfectivoYFecha(@PathVariable String date) {
        List<AbonoDTO> abonos = abonoService.getAbonosByDateAndMetodoPago_Efectivo(date);
        System.out.println(abonos);
        return ResponseEntity.ok(abonos);
    }

    @GetMapping("abonos/electronico/{date}")
    public ResponseEntity<List<Abono>> obtenerAbonosPorMetodoPagoElectronicoYFecha(@PathVariable String date, String date2) {
        List<Abono> abonos = arqueoService.obtenerAbonosByDateAndMetodoPago_ElectronicoPendientes(date, date2);
        return ResponseEntity.ok(abonos);
    }

    @GetMapping("abonos/entregados/efectivo/{date}")
    public ResponseEntity<List<AbonoDTO>> obtenerPedidosEntregadosConAbonosDelDiaEnEfectivo(@PathVariable String date) {
        List<AbonoDTO> abonos = arqueoService.obtenerPedidosEntregadosConAbonosDelDiaEnEfectivo(date);
        return ResponseEntity.ok(abonos);
    }

    @GetMapping("abonos/entregados/electronico/{date}")
    public ResponseEntity<List<AbonoDTO>> obtenerPedidosEntregadosConAbonosDelDiaEnElectronico(@PathVariable String date) {
        List<AbonoDTO> abonos = arqueoService.obtenerAbonosPedidosEntregadosConAbonosDelDiaEnElectronicos(date);
        return ResponseEntity.ok(abonos);
    }

}
