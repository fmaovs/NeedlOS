package com.farukgenc.boilerplate.springboot.service;

import com.farukgenc.boilerplate.springboot.model.Pedido;
import com.farukgenc.boilerplate.springboot.model.User;
import com.farukgenc.boilerplate.springboot.security.dto.PedidoResponse;
import com.farukgenc.boilerplate.springboot.security.service.UserServiceImpl;
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

    @Autowired
    private UserServiceImpl userService;

    public List<PedidoResponse> obtenerPedidosByUserAndDateBetween(Long userId, Date fechaInicio, Date fechaFin) {
        LocalDate monday = LocalDate.now().with(DayOfWeek.MONDAY);
        LocalDate saturday = LocalDate.now().with(DayOfWeek.SATURDAY);

        User user = userService.findById(userId);
        String userName = user.getName() + " " + user.getLastname();
        System.out.println(userName);

        List<PedidoResponse> pedidos = pedidoService.findPedidosByFechaBetween(fechaInicio, fechaFin);
        List<PedidoResponse> pedidosByUser = new ArrayList<>();
        for (PedidoResponse pedido : pedidos) {
            System.out.println(pedido.getSastre());
            if (pedido.getSastre().equals(userName) && pedido.getFechaPedido().after(Date.from(monday.atStartOfDay(ZoneId.systemDefault()).toInstant())) && pedido.getFechaPedido().before(Date.from(saturday.atStartOfDay(ZoneId.systemDefault()).toInstant())) ) {
                if (pedido.getEstado().toString().equals("FINALIZADO") || pedido.getEstado().toString().equals("ENTREGADO")){
                    pedidosByUser.add(pedido);
                }
            }
        }
        return pedidosByUser;
    }
}
