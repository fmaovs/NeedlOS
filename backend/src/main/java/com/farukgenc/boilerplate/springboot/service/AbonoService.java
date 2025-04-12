package com.farukgenc.boilerplate.springboot.service;

import com.farukgenc.boilerplate.springboot.model.*;
import com.farukgenc.boilerplate.springboot.repository.AbonoRepository;
import com.farukgenc.boilerplate.springboot.security.dto.AbonoDTO;
import com.farukgenc.boilerplate.springboot.security.dto.AbonoResponse;
import com.farukgenc.boilerplate.springboot.security.dto.PedidoResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

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
        List<Abono> abonosPendientes = new ArrayList<>();
        for (Abono abonoFiltrado : abonos){
            if (abonoFiltrado.getPedido().getDetalles().get(0).getEstadoActual().getEstado().toString().equals("EN_PROCESO")
                    || abonoFiltrado.getPedido().getDetalles().get(0).getEstadoActual().getEstado().toString().equals("FINALIZADO")) {
                abonosPendientes.add(abonoFiltrado);
            }
        }
        return abonosPendientes.stream().map(abono -> {
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

        // Obtener abonos en el rango de fecha
        List<Abono> abonos = abonoRepository.findByFechaBetween(startOfDay, endOfDay);

        System.out.println("Total de abonos encontrados: " + abonos.size());

        // Filtrar los que NO sean en EFECTIVO (Métodos electrónicos) y conservar el último abono por pedido
        Map<Long, Abono> ultimoAbonoPorPedido = abonos.stream()
                .filter(abono -> abono.getMetodoPago() != MetodoPago.EFECTIVO)
                .collect(Collectors.toMap(
                        abono -> abono.getPedido().getId(),
                        abono -> abono,
                        (abono1, abono2) -> abono1.getFecha().after(abono2.getFecha()) ? abono1 : abono2
                ));

        System.out.println("Abonos electrónicos encontrados (últimos por pedido): " + ultimoAbonoPorPedido.size());

        // Convertir a DTO
        return ultimoAbonoPorPedido.values().stream().map(abono -> {
            AbonoDTO abonoDTO = new AbonoDTO();
            abonoDTO.setIdPedido(abono.getPedido().getId());
            abonoDTO.setMonto(abono.getMonto());
            abonoDTO.setMetodoPago(abono.getMetodoPago().name());
            System.out.println(abonoDTO);
            return abonoDTO;
        }).toList();
    }


    public AbonoDTO getAbonoByIdPedido(Long idPedido){
        Abono abono = abonoRepository.findByPedido_Id(idPedido);
        AbonoDTO abonoDTO = new AbonoDTO();
        abonoDTO.setIdPedido(abono.getPedido().getId());
        abonoDTO.setMonto(abono.getMonto());
        abonoDTO.setMetodoPago(abono.getMetodoPago().toString());
        return abonoDTO;
    }

    public List<AbonoResponse> getFechaBetween(String fechaI, String fechaF){
        // Convertir las cadenas de fecha en LocalDate
        LocalDate fechaInicioLD = LocalDate.parse(fechaI);
        LocalDate fechaFinLD = LocalDate.parse(fechaF);

        // Convertir LocalDate a Date con 00:00:00 y 23:59:59
        Date fechaInicio = Date.from(fechaInicioLD.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date fechaFin = Date.from(fechaFinLD.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant());

        List<Abono> abonos = abonoRepository.findByFechaBetween(fechaInicio,fechaFin);
        List<AbonoResponse> abonoResponses = new ArrayList<>();
        for (Abono abono: abonos){
            AbonoResponse abonoResponse = new AbonoResponse();
            abonoResponse.setId(abono.getId());
            abonoResponse.setMonto(abono.getMonto());
            abonoResponse.setFecha(abono.getFecha());
            System.out.println(abono.getFecha());
            abonoResponse.setPedidoId(abono.getPedido().getId());
            abonoResponse.setMetodoPago(abono.getMetodoPago().toString());
            abonoResponses.add(abonoResponse);
        }
        return abonoResponses;
    }

}
