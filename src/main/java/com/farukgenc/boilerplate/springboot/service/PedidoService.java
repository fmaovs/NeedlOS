package com.farukgenc.boilerplate.springboot.service;

import com.farukgenc.boilerplate.springboot.model.*;
import com.farukgenc.boilerplate.springboot.repository.*;
import com.farukgenc.boilerplate.springboot.security.dto.DetallePedidoDTO;
import com.farukgenc.boilerplate.springboot.security.dto.PedidoDTO;
import com.farukgenc.boilerplate.springboot.security.dto.PedidoResponse;
import com.farukgenc.boilerplate.springboot.security.service.UserService;
import com.farukgenc.boilerplate.springboot.security.service.UserServiceImpl;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PrendaRepository prendaRepository;

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    @Autowired
    private EstadoPedidoRepository estadoPedidoRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private UserServiceImpl userService;

    @Transactional
    public void createPedido(PedidoDTO pedidoDTO) {
        // 1. Buscar el cliente
        Customer customer = customerRepository.findById(pedidoDTO.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado"));

        // 2. Crear el pedido
        Pedido pedido = new Pedido();
        pedido.setDate(pedidoDTO.getDate());
        pedido.setTotalAbonos(0);
        pedido.setSaldo(0);
        pedido.setCustomer(customer);

        // 3. Crear los detalles del pedido
        List<DetallePedido> detalles = new ArrayList<>();
        for (DetallePedidoDTO detalleDTO : pedidoDTO.getDetalles()) {
            // Buscar la prenda
            Prenda prenda = prendaRepository.findById(detalleDTO.getPrendaId())
                    .orElseThrow(() -> new IllegalArgumentException("Prenda no encontrada"));

            // Buscar el sastre
            User user = userService.findById(detalleDTO.getUser());
            System.out.println(user);


            // Crear el detalle del pedido
            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedido);
            detalle.setPrenda(prenda);
            detalle.setUser(user);
            detalle.setCantidad(detalleDTO.getCantidad());
            detalle.setFechaEntrega(pedidoDTO.getFechaEntrega());
            detalle.calcularValorTotal(); // Calcula el valor total
            String concepto = detalleDTO.getConcepto();
            detalle.setConcepto(Concepto.valueOf(concepto.toUpperCase()));
            detallePedidoRepository.save(detalle); // Persistir el detalle primero

            // Crear el estado inicial para este detalle
            EstadoPedido estadoInicial = new EstadoPedido();
            estadoInicial.setEstado(Estado.PENDIENTE);
            estadoInicial.setFechaCambio(LocalDateTime.now());
            estadoInicial.setDetallePedido(detalle); // Ahora el 'detalle' ya está en la base de datos
            estadoPedidoRepository.save(estadoInicial);

            // Asociar el estado inicial al detalle
            detalle.setEstadoActual(estadoInicial);
            detalles.add(detalle);
        }

        // 4. Asociar los detalles al pedido
        pedido.setDetalles(detalles);

        // 5. Calcular el saldo total
        double totalPedido = detalles.stream()
                .mapToDouble(DetallePedido::getValorTotal)
                .sum();
        pedido.setSaldo((float) (totalPedido - pedido.getTotalAbonos()));

        // 6. Guardar el pedido
        pedidoRepository.save(pedido);
    }

    public List<PedidoResponse> findAll() {
        List<PedidoResponse> pedidos = new ArrayList<>();
        for (DetallePedido detallePedido : detallePedidoRepository.findAll()) {
            PedidoResponse pedidoResponse = new PedidoResponse();
            pedidoResponse.setId(detallePedido.getPedido().getId());
            String nombreCompleto = detallePedido.getPedido().getCustomer().getName() + " " + detallePedido.getPedido().getCustomer().getLastname();
            pedidoResponse.setCustomerName(nombreCompleto);
            pedidoResponse.setTelefono(detallePedido.getPedido().getCustomer().getPhone());
            pedidoResponse.setFechaPedido(detallePedido.getPedido().getDate());
            pedidoResponse.setFechaEntrega(detallePedido.getFechaEntrega());
            pedidoResponse.setSaldo(detallePedido.getPedido().getSaldo());
            pedidoResponse.setPrenda(detallePedido.getPrenda().getDescripcion());
            pedidoResponse.setConcepto(detallePedido.getConcepto().toString());
            pedidoResponse.setSastre(detallePedido.getUser().getName() + " " + detallePedido.getUser().getLastname());
            pedidoResponse.setEstado(detallePedido.getEstadoActual().getEstado());
            pedidos.add(pedidoResponse);
        }
        return pedidos;
    }

    public List<PedidoResponse> findAllBySastre(Long id) {
        List<PedidoResponse> pedidos = new ArrayList<>();
        for (DetallePedido detallePedido : detallePedidoRepository.findPedidosByUser_Id(id)) {
            PedidoResponse pedidoResponse = new PedidoResponse();
            pedidoResponse.setId(detallePedido.getPedido().getId());
            String nombreCompleto = detallePedido.getPedido().getCustomer().getName() + " " + detallePedido.getPedido().getCustomer().getLastname();
            pedidoResponse.setCustomerName(nombreCompleto);
            pedidoResponse.setTelefono(detallePedido.getPedido().getCustomer().getPhone());
            pedidoResponse.setFechaPedido(detallePedido.getPedido().getDate());
            pedidoResponse.setFechaEntrega(detallePedido.getFechaEntrega());
            pedidoResponse.setSaldo(detallePedido.getPedido().getSaldo());
            pedidoResponse.setPrenda(detallePedido.getPrenda().getDescripcion());
            pedidoResponse.setSastre(detallePedido.getUser().getName() + " " + detallePedido.getUser().getLastname());
            pedidoResponse.setEstado(detallePedido.getEstadoActual().getEstado());
            pedidoResponse.setConcepto(detallePedido.getConcepto().toString());
            pedidos.add(pedidoResponse);
        }
        return pedidos;
    }

    public List<PedidoResponse> findAllByEstado(String estado) {
        List<PedidoResponse> pedidos = new ArrayList<>();
        for (DetallePedido detallePedido : detallePedidoRepository.findPedidosByEstadoActual_Estado(Estado.valueOf(estado))) {
            PedidoResponse pedidoResponse = new PedidoResponse();
            pedidoResponse.setId(detallePedido.getPedido().getId());
            String nombreCompleto = detallePedido.getPedido().getCustomer().getName() + " " + detallePedido.getPedido().getCustomer().getLastname();
            pedidoResponse.setCustomerName(nombreCompleto);
            pedidoResponse.setTelefono(detallePedido.getPedido().getCustomer().getPhone());
            pedidoResponse.setFechaPedido(detallePedido.getPedido().getDate());
            pedidoResponse.setFechaEntrega(detallePedido.getFechaEntrega());
            pedidoResponse.setSaldo(detallePedido.getPedido().getSaldo());
            pedidoResponse.setPrenda(detallePedido.getPrenda().getDescripcion());
            pedidoResponse.setSastre(detallePedido.getUser().getName() + " " + detallePedido.getUser().getLastname());
            pedidoResponse.setEstado(detallePedido.getEstadoActual().getEstado());
            pedidoResponse.setConcepto(detallePedido.getConcepto().toString());
            pedidos.add(pedidoResponse);
        }
        return pedidos;
    }

    public Optional<PedidoResponse> findById(Long id) {
        return Optional.ofNullable(pedidoRepository.findPedidoResponseById(id));
    }

    public Pedido update(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    public void delete(Pedido pedido) {
        pedidoRepository.delete(pedido);
    }

    public void saveFotoRecogida(Long id, MultipartFile file) throws IOException {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado"));

        String fileName = fileStorageService.saveFile(file);
        pedido.setFotoRecogida(fileName);
        pedidoRepository.save(pedido);
    }

    public void saveFotoEntrega(Long id, MultipartFile file) throws IOException {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado"));

        String fileName = fileStorageService.saveFile(file);
        pedido.setFotoEntrega(fileName);
        pedidoRepository.save(pedido);
    }

    public File getFotoRecogida(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado"));

        return fileStorageService.getFile(pedido.getFotoRecogida());
    }

    public File getFotoEntrega(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado"));

        return fileStorageService.getFile(pedido.getFotoEntrega());
    }



    public List<PedidoResponse> findPedidosByConcepto(String concepto) {
        List<PedidoResponse> pedidos = new ArrayList<>();
        try {
            // Convertir el concepto del tipo String al enum Concepto
            Concepto conceptoEnum = Concepto.valueOf(concepto.toUpperCase());

            // Recuperar los detalles de los pedidos usando el repositorio
            List<DetallePedido> detalles = detallePedidoRepository.findPedidosByConcepto(conceptoEnum);

            for (DetallePedido detallePedido : detalles) {
                PedidoResponse pedidoResponse = new PedidoResponse();
                pedidoResponse.setId(detallePedido.getPedido().getId());
                String nombreCompleto = detallePedido.getPedido().getCustomer().getName() + " " + detallePedido.getPedido().getCustomer().getLastname();
                pedidoResponse.setCustomerName(nombreCompleto);
                pedidoResponse.setTelefono(detallePedido.getPedido().getCustomer().getPhone());
                pedidoResponse.setFechaPedido(detallePedido.getPedido().getDate());
                pedidoResponse.setFechaEntrega(detallePedido.getFechaEntrega());
                pedidoResponse.setSaldo(detallePedido.getPedido().getSaldo());
                pedidoResponse.setPrenda(detallePedido.getPrenda().getDescripcion());
                pedidoResponse.setSastre(detallePedido.getUser().getName() + " " + detallePedido.getUser().getLastname());
                pedidoResponse.setEstado(detallePedido.getEstadoActual().getEstado());
                pedidoResponse.setConcepto(conceptoEnum.name());
                pedidos.add(pedidoResponse);
            }
        } catch (IllegalArgumentException e) {
            // Manejo del caso en que el valor del concepto no sea válido
            throw new IllegalArgumentException("Concepto no válido: " + concepto, e);
        }
        return pedidos;
    }



}

