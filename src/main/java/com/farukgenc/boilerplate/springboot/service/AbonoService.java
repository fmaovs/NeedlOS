package com.farukgenc.boilerplate.springboot.service;

import com.farukgenc.boilerplate.springboot.model.Abono;
import com.farukgenc.boilerplate.springboot.model.DetallePedido;
import com.farukgenc.boilerplate.springboot.model.MetodoPago;
import com.farukgenc.boilerplate.springboot.repository.AbonoRepository;
import com.farukgenc.boilerplate.springboot.security.dto.AbonoDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class AbonoService {
    @Autowired
    private AbonoRepository abonoRepository;

    @Autowired
    private DetallePedidoService detallePedidoService;

    public Optional<Abono> findById(Long id) {
        return Optional.of(abonoRepository.findById(id).get());
    }

    public List<Abono> getAbonos() {
        return abonoRepository.findAll();
    }

    @Transactional
    public Abono createAbono(AbonoDTO abonoDTO) throws ParseException {
        DetallePedido detallePedido = detallePedidoService.findById(abonoDTO.getDetallePedidoId())
                .orElseThrow(() -> new IllegalArgumentException("Detalle de pedido no encontrado"));

        if (detallePedido.getPedido().getSaldo() <= 0) {
            throw new IllegalArgumentException("El pedido ya está pagado");
        }

        if (abonoDTO.getMonto() > detallePedido.getPedido().getSaldo()) {
            throw new IllegalArgumentException("El monto del abono es mayor al saldo del pedido");
        }

        Date fecha = abonoDTO.getFecha();
        Abono abono = new Abono();
        abono.setFecha(fecha);
        abono.setMonto(abonoDTO.getMonto());
        abono.setMetodoPago(MetodoPago.valueOf(abonoDTO.getMetodoPago()));
        abono.setDetallePedido(detallePedido);

        detallePedido.getPedido().setTotalAbonos(detallePedido.getPedido().getTotalAbonos() + abonoDTO.getMonto());
        detallePedido.getPedido().setSaldo(detallePedido.getPedido().getSaldo() - abonoDTO.getMonto());


        return abonoRepository.save(abono);
    }

}
