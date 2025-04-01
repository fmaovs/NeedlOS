package com.farukgenc.boilerplate.springboot.service;

import com.farukgenc.boilerplate.springboot.model.Abono;
import com.farukgenc.boilerplate.springboot.model.Estado;
import com.farukgenc.boilerplate.springboot.model.MetodoPago;
import com.farukgenc.boilerplate.springboot.model.Pedido;
import com.farukgenc.boilerplate.springboot.security.dto.AbonoDTO;
import com.farukgenc.boilerplate.springboot.security.dto.PedidoResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.*;

@Service
public class ArqueoService {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private AbonoService abonoService;

    public List<AbonoDTO> obtenerAbonosDelDia(String date) {
        List<Abono> abonos = abonoService.getAbonosByDate(date);
        return abonos.stream().map(abono -> {
            AbonoDTO abonoDTO = new AbonoDTO();
            abonoDTO.setIdPedido(abono.getPedido().getId());
            abonoDTO.setMonto(abono.getMonto());
            abonoDTO.setMetodoPago(abono.getMetodoPago().name());
            return abonoDTO;
        }).toList();
    }

    public double obtenerTotalAbonosDelDia(String date) {
        List<Abono> abonos = abonoService.getAbonosByDate(date);
        return abonos.stream().mapToDouble(Abono::getMonto).sum();
    }

    public List<PedidoResponse> obtenerPedidosDelDia(String date) {
        List<AbonoDTO> abonos = obtenerAbonosDelDia(date);
        Set<Long> pedidosProcesados = new HashSet<>(); // Para evitar duplicados
        List<PedidoResponse> pedidos = new ArrayList<>();

        for (AbonoDTO abono : abonos) {
            if (!pedidosProcesados.contains(abono.getIdPedido())) { // Verifica si ya fue agregado
                Optional<PedidoResponse> pedido = pedidoService.findById(abono.getIdPedido());

                if (pedido.isPresent()) {
                    PedidoResponse p = pedido.get();
                    System.out.println("Pedido ID: " + p.getId() + ", Estado: " + p.getEstado());

                    if (p.getEstado() == Estado.ENTREGADO && p.getSaldo() == 0) {
                        pedidos.add(p);
                        pedidosProcesados.add(p.getId()); // Marcar como agregado
                    }
                }
            }
        }
        return pedidos;
    }

    public List<AbonoDTO> obtenerPedidosEntregadosConAbonosDelDiaEnEfectivo(String date) {
        List<AbonoDTO> abonosDia = abonoService.getAbonosByDateAndMetodoPago_Efectivo(date);
        List<AbonoDTO> abonos = new ArrayList<>();
        for (AbonoDTO abonito: abonosDia){
            Optional<PedidoResponse> pedidoResponse = pedidoService.findById(abonito.getIdPedido());
            if (pedidoResponse.isPresent() && pedidoResponse.get().getEstado().toString().equals("ENTREGADO")){
                System.out.println(abonito);
                abonos.add(abonito);
            }
        }
        return abonos;
    }

    public List<AbonoDTO> obtenerAbonosPedidosEntregadosConAbonosDelDiaEnElectronicos(String date) {
        System.out.println(date);
        List<AbonoDTO> abonosDia = abonoService.getAbonosByDateAndMetodoPago_Electronico(date);
        List<AbonoDTO> abonos = new ArrayList<>();
        for (AbonoDTO abonito: abonosDia){
            PedidoResponse pedidoResponse = pedidoService.findById(abonito.getIdPedido()).orElseThrow();
            System.out.println("pedido del abono"+ pedidoResponse);
            if (pedidoResponse.getEstado().toString().equals("ENTREGADO")){
                System.out.println(abonito);
                abonos.add(abonito);
            }
        }
        return abonos;
    }
}