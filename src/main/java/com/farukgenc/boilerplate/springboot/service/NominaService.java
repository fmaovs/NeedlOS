package com.farukgenc.boilerplate.springboot.service;

import com.farukgenc.boilerplate.springboot.model.Pedido;
import com.farukgenc.boilerplate.springboot.security.dto.PedidoResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class NominaService {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private GastoService gastoService;

    public List<PedidoResponse> obtenerPedidosByUserAndDateBetween(String username) {
        LocalDate monday = LocalDate.now().with(DayOfWeek.MONDAY);
        LocalDate saturday = LocalDate.now().with(DayOfWeek.SATURDAY);

        List<PedidoResponse> pedidos = pedidoService.findPedidosByFechaBetween(Date.from(monday.atStartOfDay(ZoneId.systemDefault()).toInstant()), Date.from(saturday.atStartOfDay(ZoneId.systemDefault()).toInstant()));
        List<PedidoResponse> pedidosByUser = new ArrayList<>();
        for (PedidoResponse pedido : pedidos) {
            System.out.println(pedido.getSastre());
            if (pedido.getSastre().equals(username)) {
                pedidosByUser.add(pedido);
            }
        }
        return pedidosByUser;
    }
}
