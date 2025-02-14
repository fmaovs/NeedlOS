package com.farukgenc.boilerplate.springboot.service;

import com.farukgenc.boilerplate.springboot.model.Abono;
import com.farukgenc.boilerplate.springboot.model.DetallePedido;
import com.farukgenc.boilerplate.springboot.model.MetodoPago;
import com.farukgenc.boilerplate.springboot.model.Pedido;
import com.farukgenc.boilerplate.springboot.repository.AbonoRepository;
import com.farukgenc.boilerplate.springboot.security.dto.AbonoDTO;
import com.farukgenc.boilerplate.springboot.security.dto.PedidoResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class AbonoService {
    @Autowired
    private AbonoRepository abonoRepository;

    @Autowired
    private DetallePedidoService detallePedidoService;

    @Autowired
    private PedidoService pedidoService;

    public Optional<Abono> findById(Long id) {
        return Optional.of(abonoRepository.findById(id).get());
    }

    public List<Abono> getAbonos() {
        return abonoRepository.findAll();
    }

    @Transactional
    public String createAbono(AbonoDTO abonoDTO) throws ParseException {
        PedidoResponse pedidoResponse = pedidoService.findById(abonoDTO.getIdPedido())
                .orElseThrow(() -> new IllegalArgumentException("Detalle de pedido no encontrado"));

        ;

        if (pedidoResponse.getSaldo() <= 0) {
            throw new IllegalArgumentException("El pedido ya está pagado");
        }

        if (abonoDTO.getMonto() > pedidoResponse.getSaldo()) {
            throw new IllegalArgumentException("El monto del abono es mayor al saldo del pedido");
        }


        Abono abono = new Abono();
        abono.setPedido(pedidoService.convertPedidoResponseToPedido(pedidoResponse));
        abono.setFecha(Date.from(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant()));
        abono.setMonto(abonoDTO.getMonto());
        abono.setMetodoPago(MetodoPago.valueOf(abonoDTO.getMetodoPago()));

        pedidoService.updateSaldo(pedidoResponse.getId(), abonoDTO.getMonto());

        abonoRepository.save(abono);
        return "Abono creado";
    }

    public List<Abono> getAbonosByDate(String dateString) {
        LocalDate localDate = LocalDate.parse(dateString);

        // Convertimos LocalDate a Date con 00:00:00 y 23:59:59
        Date startOfDay = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endOfDay = Date.from(localDate.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant());

        return abonoRepository.findByFechaBetween(startOfDay, endOfDay);
    }

}
