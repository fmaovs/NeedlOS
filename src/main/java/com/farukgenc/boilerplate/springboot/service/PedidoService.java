package com.farukgenc.boilerplate.springboot.service;

import com.farukgenc.boilerplate.springboot.model.Customer;
import com.farukgenc.boilerplate.springboot.model.DetallePedido;
import com.farukgenc.boilerplate.springboot.model.Pedido;
import com.farukgenc.boilerplate.springboot.model.Prenda;
import com.farukgenc.boilerplate.springboot.repository.CustomerRepository;
import com.farukgenc.boilerplate.springboot.repository.PedidoRepository;
import com.farukgenc.boilerplate.springboot.repository.PrendaRepository;
import com.farukgenc.boilerplate.springboot.security.dto.PedidoDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PedidoService {
    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PrendaRepository prendaRepository;

    public List<Pedido> findAll(){
        return pedidoRepository.findAll();
    }

    public Pedido findById(Long id){
        return pedidoRepository.findById(id).get();
    }

    @Transactional
    public void createPedido(PedidoDTO pedidoDTO) {
        // 1. Buscar el cliente
        Customer customer = customerRepository.findById(pedidoDTO.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado"));

        // 2. Crear el pedido
        Pedido pedido = new Pedido();
        pedido.setDate(pedidoDTO.getDate());
        pedido.setTotalAbonos((float) pedidoDTO.getTotalAbonos());
        pedido.setSaldo(0);
        pedido.setCustomer(customer);

        // 3. Crear los detalles del pedido
        List<DetallePedido> detalles = pedidoDTO.getDetalles().stream().map(detalleDTO -> {
            Prenda prenda = prendaRepository.findById(detalleDTO.getPrendaId())
                    .orElseThrow(() -> new IllegalArgumentException("Prenda no encontrada"));

            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedido);
            detalle.setPrenda(prenda);
            detalle.setCantidad(detalleDTO.getCantidad());
            detalle.calcularValorTotal(); // Calcula el valor total para este detalle
            return detalle;
        }).collect(Collectors.toList());

        pedido.setDetalles(detalles);

        double totalPedido = detalles.stream()
                .mapToDouble(DetallePedido::getValorTotal)
                .sum();
        pedido.setSaldo((float) (totalPedido - pedido.getTotalAbonos()));

        pedidoRepository.save(pedido);
    }

    public Pedido update(Pedido pedido){
        return pedidoRepository.save(pedido);
    }

    public void delete(Pedido pedido){
        pedidoRepository.delete(pedido);
    }
}

