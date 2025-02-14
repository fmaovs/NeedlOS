package com.farukgenc.boilerplate.springboot.service;

import com.farukgenc.boilerplate.springboot.model.Abono;
import com.farukgenc.boilerplate.springboot.model.MetodoPago;
import com.farukgenc.boilerplate.springboot.security.dto.AbonoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

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
}
