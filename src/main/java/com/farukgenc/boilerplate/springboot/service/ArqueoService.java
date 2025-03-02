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
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

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
        List<PedidoResponse> pedidos = new ArrayList<>();

        for (AbonoDTO abono : abonos) {
            Optional<PedidoResponse> pedido = pedidoService.findById(abono.getIdPedido());

            if (pedido.isPresent()) {
                PedidoResponse p = pedido.get();
                System.out.println("Pedido ID: " + p.getId() + ", Estado: " + p.getEstado());

                if (p.getEstado() == Estado.ENTREGADO && p.getSaldo() == 0) {
                    pedidos.add(p);
                }
            }
        }
        return pedidos;
    }




}
