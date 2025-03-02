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

    public Optional<AbonoDTO> findById(Long id) {
        Abono abono = abonoRepository.findById(id).orElse(null);
        if (abono == null) {
            return Optional.empty();
        } else {
            AbonoDTO abonoDTO = new AbonoDTO();
            abonoDTO.setIdPedido(abono.getPedido().getId());
            abonoDTO.setMonto(abono.getMonto());
            abonoDTO.setMetodoPago(abono.getMetodoPago().name());
            return Optional.of(abonoDTO);
        }
    }

    public List<AbonoDTO> getAbonos() {
        List<Abono> abonos = abonoRepository.findAll();
        return abonos.stream().map(abono -> {
            AbonoDTO abonoDTO = new AbonoDTO();
            abonoDTO.setIdPedido(abono.getPedido().getId());
            abonoDTO.setMonto(abono.getMonto());
            abonoDTO.setMetodoPago(abono.getMetodoPago().name());
            return abonoDTO;
        }).toList();
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

    public List<AbonoDTO> getAbonosByDateAndMetodoPago_Efectivo(String dateString) {
        LocalDate localDate = LocalDate.parse(dateString);
        MetodoPago metodoPago = MetodoPago.EFECTIVO;
        // Convertimos LocalDate a Date con 00:00:00 y 23:59:59
        Date startOfDay = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endOfDay = Date.from(localDate.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant());
        List<Abono> abonos = abonoRepository.findByFechaBetweenAndMetodoPago(startOfDay, endOfDay, metodoPago);
        return abonos.stream().map(abono -> {
            AbonoDTO abonoDTO = new AbonoDTO();
            abonoDTO.setIdPedido(abono.getPedido().getId());
            abonoDTO.setMonto(abono.getMonto());
            abonoDTO.setMetodoPago(abono.getMetodoPago().name());
            return abonoDTO;
        }).toList();

    }

    public List<AbonoDTO> getAbonosByDateAndMetodoPago_Electronico(String dateString) {
        LocalDate localDate = LocalDate.parse(dateString);
        // Convertimos LocalDate a Date con 00:00:00 y 23:59:59
        Date startOfDay = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endOfDay = Date.from(localDate.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant());
        List<Abono> abonos = abonoRepository.findByFechaBetween(startOfDay, endOfDay);
        for (Abono abono : abonos) {
            if (abono.getMetodoPago() == MetodoPago.EFECTIVO) {
                abonos.remove(abono);
            }
        }
        return abonos.stream().map(abono -> {
            AbonoDTO abonoDTO = new AbonoDTO();
            abonoDTO.setIdPedido(abono.getPedido().getId());
            abonoDTO.setMonto(abono.getMonto());
            abonoDTO.setMetodoPago(abono.getMetodoPago().name());
            return abonoDTO;
        }).toList();

    }

}
