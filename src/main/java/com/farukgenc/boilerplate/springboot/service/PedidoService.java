package com.farukgenc.boilerplate.springboot.service;

import com.farukgenc.boilerplate.springboot.model.*;
import com.farukgenc.boilerplate.springboot.repository.*;
import com.farukgenc.boilerplate.springboot.security.dto.DetallePedidoDTO;
import com.farukgenc.boilerplate.springboot.security.dto.PedidoDTO;
import com.farukgenc.boilerplate.springboot.security.dto.PedidoResponse;
import com.farukgenc.boilerplate.springboot.security.dto.PrendaDTO;
import com.farukgenc.boilerplate.springboot.security.service.UserService;
import com.farukgenc.boilerplate.springboot.security.service.UserServiceImpl;
import jakarta.transaction.Transactional;
import org.hibernate.query.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
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
    public PedidoResponse createPedido(PedidoDTO pedidoDTO) {
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

        // 7. Crear el PedidoResponse
        PedidoResponse pedidoResponse = new PedidoResponse();
        pedidoResponse.setId(pedido.getId());
        pedidoResponse.setCustomerName(customer.getName() + " " + customer.getLastname());
        pedidoResponse.setTelefono(customer.getPhone());
        pedidoResponse.setFechaPedido(pedido.getDate());
        pedidoResponse.setFechaEntrega(pedido.getDetalles().get(0).getFechaEntrega());
        pedidoResponse.setSaldo(pedido.getSaldo());
        List<PrendaDTO> prendasPedido = new ArrayList<>();
        for (DetallePedido detallePedido: pedido.getDetalles()) {
            PrendaDTO prendaDTO = new PrendaDTO();
            prendaDTO.setDescripcion(detallePedido.getPrenda().getDescripcion());
            prendaDTO.setValor(detallePedido.getValorTotal());
            prendaDTO.setCantidad(detallePedido.getCantidad());
            prendasPedido.add(prendaDTO);
        }
        pedidoResponse.setPrenda(prendasPedido);
        pedidoResponse.setSastre(pedido.getDetalles().get(0).getUser().getName() + " " + pedido.getDetalles().get(0).getUser().getLastname());
        pedidoResponse.setEstado(Estado.valueOf(pedido.getDetalles().get(0).getEstadoActual().getEstado().toString()));
        pedidoResponse.setConcepto(pedido.getDetalles().get(0).getConcepto().toString());
        return pedidoResponse;
    }

    public List<PedidoResponse> findAll() {
        Map<Long, PedidoResponse> pedidosMap = new HashMap<>();

        for (DetallePedido detallePedido : detallePedidoRepository.findAll()) {
            Long pedidoId = detallePedido.getPedido().getId();

            // Si ya existe un PedidoResponse para este pedido, lo usamos
            PedidoResponse pedidoResponse = pedidosMap.get(pedidoId);
            if (pedidoResponse == null) {
                // Crear un nuevo PedidoResponse si no existe
                pedidoResponse = new PedidoResponse();
                pedidoResponse.setId(pedidoId);
                String nombreCompleto = detallePedido.getPedido().getCustomer().getName()
                        + " " + detallePedido.getPedido().getCustomer().getLastname();
                pedidoResponse.setCustomerName(nombreCompleto);
                pedidoResponse.setTelefono(detallePedido.getPedido().getCustomer().getPhone());
                pedidoResponse.setFechaPedido(detallePedido.getPedido().getDate());
                pedidoResponse.setFechaEntrega(detallePedido.getFechaEntrega());
                pedidoResponse.setSaldo(detallePedido.getPedido().getSaldo());
                pedidoResponse.setPrenda(new ArrayList<>());
                pedidoResponse.setSastre(detallePedido.getUser().getName() + " " + detallePedido.getUser().getLastname());
                pedidoResponse.setEstado(detallePedido.getEstadoActual().getEstado());
                pedidoResponse.setConcepto(detallePedido.getConcepto().toString());

                // Guardar en el mapa
                pedidosMap.put(pedidoId, pedidoResponse);
            }

            // Agregar las prendas al PedidoResponse correspondiente
            PrendaDTO prendaDTO = new PrendaDTO();
            prendaDTO.setDescripcion(detallePedido.getPrenda().getDescripcion());
            prendaDTO.setValor(detallePedido.getValorTotal());
            prendaDTO.setCantidad(detallePedido.getCantidad());
            pedidoResponse.getPrenda().add(prendaDTO);
        }

        // Convertir el mapa a una lista de resultados
        return new ArrayList<>(pedidosMap.values());
    }




    public List<PedidoResponse> findAllByEstado(String estado) {
        List<PedidoResponse> pedidos = new ArrayList<>();
        for (DetallePedido detallePedido : detallePedidoRepository.findPedidosByEstadoActual_Estado(Estado.valueOf(estado.toUpperCase()))) {
            PedidoResponse pedidoResponse = new PedidoResponse();

            List<DetallePedido> detallePedidoList = detallePedidoRepository.findByPedido_Id(detallePedido.getPedido().getId());
            List<PrendaDTO> prendasPedido = new ArrayList<>();
            for (DetallePedido detallePedido1: detallePedidoList) {
                PrendaDTO prendaDTO = new PrendaDTO();
                prendaDTO.setDescripcion(detallePedido1.getPrenda().getDescripcion());
                prendaDTO.setValor(detallePedido1.getValorTotal());
                prendaDTO.setCantidad(detallePedido1.getCantidad());
                prendasPedido.add(prendaDTO);
            }

            pedidoResponse.setId(detallePedido.getPedido().getId());
            String nombreCompleto = detallePedido.getPedido().getCustomer().getName() + " " + detallePedido.getPedido().getCustomer().getLastname();
            pedidoResponse.setCustomerName(nombreCompleto);
            pedidoResponse.setTelefono(detallePedido.getPedido().getCustomer().getPhone());
            pedidoResponse.setFechaPedido(detallePedido.getPedido().getDate());
            pedidoResponse.setFechaEntrega(detallePedido.getFechaEntrega());
            pedidoResponse.setSaldo(detallePedido.getPedido().getSaldo());
            pedidoResponse.setPrenda(prendasPedido);
            pedidoResponse.setSastre(detallePedido.getUser().getName() + " " + detallePedido.getUser().getLastname());
            pedidoResponse.setEstado(detallePedido.getEstadoActual().getEstado());
            pedidoResponse.setConcepto(detallePedido.getConcepto().toString());
            pedidos.add(pedidoResponse);
        }
        return pedidos;
    }

    public Optional<PedidoResponse> findById(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado"));
        PedidoResponse pedidoResponse = new PedidoResponse();
        List<DetallePedido> detallePedidoList = detallePedidoRepository.findByPedido_Id(pedido.getId());
        List<PrendaDTO> prendasPedido = new ArrayList<>();
        pedidoResponse.setId(pedido.getId());
        String nombreCompleto = pedido.getCustomer().getName() + " " + pedido.getCustomer().getLastname();
        pedidoResponse.setCustomerName(nombreCompleto);
        pedidoResponse.setTelefono(pedido.getCustomer().getPhone());
        pedidoResponse.setFechaPedido(pedido.getDate());
        pedidoResponse.setFechaEntrega(detallePedidoList.get(0).getFechaEntrega());
        pedidoResponse.setSaldo(pedido.getSaldo());
        for (DetallePedido detallePedido: detallePedidoList) {
            PrendaDTO prendaDTO = new PrendaDTO();
            prendaDTO.setDescripcion(detallePedido.getPrenda().getDescripcion());
            prendaDTO.setValor(detallePedido.getValorTotal());
            prendaDTO.setCantidad(detallePedido.getCantidad());
            prendasPedido.add(prendaDTO);
        }
        pedidoResponse.setPrenda(prendasPedido);
        pedidoResponse.setSastre(detallePedidoList.get(0).getUser().getName() + " " + detallePedidoList.get(0).getUser().getLastname());
        pedidoResponse.setEstado(detallePedidoList.get(0).getEstadoActual().getEstado());
        pedidoResponse.setConcepto(detallePedidoList.get(0).getConcepto().toString());
        return Optional.of(pedidoResponse);
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

                List<DetallePedido> detallePedidoList = detallePedidoRepository.findByPedido_Id(detallePedido.getPedido().getId());
                List<PrendaDTO> prendasPedido = new ArrayList<>();
                for (DetallePedido detallePedido1: detallePedidoList) {
                    PrendaDTO prendaDTO = new PrendaDTO();
                    prendaDTO.setDescripcion(detallePedido1.getPrenda().getDescripcion());
                    prendaDTO.setValor(detallePedido1.getValorTotal());
                    prendaDTO.setCantidad(detallePedido1.getCantidad());
                    prendasPedido.add(prendaDTO);
                }

                pedidoResponse.setId(detallePedido.getPedido().getId());
                String nombreCompleto = detallePedido.getPedido().getCustomer().getName() + " " + detallePedido.getPedido().getCustomer().getLastname();
                pedidoResponse.setCustomerName(nombreCompleto);
                pedidoResponse.setTelefono(detallePedido.getPedido().getCustomer().getPhone());
                pedidoResponse.setFechaPedido(detallePedido.getPedido().getDate());
                pedidoResponse.setFechaEntrega(detallePedido.getFechaEntrega());
                pedidoResponse.setSaldo(detallePedido.getPedido().getSaldo());
                pedidoResponse.setPrenda(prendasPedido);
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

    public List<PedidoResponse> findAllByCustomer(String customer) {
        List<Pedido> pedidos = pedidoRepository.findAll();
        List<PedidoResponse> pedidosResponse = new ArrayList<>();

        for (Pedido pedido : pedidos) {
            String nombreCompleto = pedido.getCustomer().getName() + " " + pedido.getCustomer().getLastname();
            if (nombreCompleto.equals(customer)) {
                PedidoResponse pedidoResponse = new PedidoResponse();
                pedidoResponse.setId(pedido.getId());
                pedidoResponse.setCustomerName(nombreCompleto);
                pedidoResponse.setTelefono(pedido.getCustomer().getPhone());
                pedidoResponse.setFechaPedido(pedido.getDate());
                pedidoResponse.setFechaEntrega(pedido.getDetalles().get(0).getFechaEntrega());
                pedidoResponse.setSaldo(pedido.getSaldo());
                List<PrendaDTO> prendasPedido = new ArrayList<>();
                for (DetallePedido detallePedido: pedido.getDetalles()) {
                    PrendaDTO prendaDTO = new PrendaDTO();
                    prendaDTO.setDescripcion(detallePedido.getPrenda().getDescripcion());
                    prendaDTO.setValor(detallePedido.getValorTotal());
                    prendaDTO.setCantidad(detallePedido.getCantidad());
                    prendasPedido.add(prendaDTO);
                }
                pedidoResponse.setPrenda(prendasPedido);
                pedidoResponse.setSastre(pedido.getDetalles().get(0).getUser().getName() + " " + pedido.getDetalles().get(0).getUser().getLastname());
                pedidoResponse.setEstado(Estado.valueOf(pedido.getDetalles().get(0).getEstadoActual().getEstado().toString()));
                pedidoResponse.setConcepto(pedido.getDetalles().get(0).getConcepto().toString());
                pedidosResponse.add(pedidoResponse);
            }
        }
        return pedidosResponse;
    }

    public List<PedidoResponse> findPedidosByDetalleSastreName(String nombre){
        List<PedidoResponse> pedidos = new ArrayList<>();
        for (DetallePedido detallePedido : detallePedidoRepository.findDetallePedidosByUser_Name(nombre)) {
            PedidoResponse pedidoResponse = new PedidoResponse();
            List<DetallePedido> detallePedidoList = detallePedidoRepository.findByPedido_Id(detallePedido.getPedido().getId());
            List<PrendaDTO> prendasPedido = new ArrayList<>();
            for (DetallePedido detallePedido1: detallePedidoList) {
                PrendaDTO prendaDTO = new PrendaDTO();
                prendaDTO.setDescripcion(detallePedido1.getPrenda().getDescripcion());
                prendaDTO.setValor(detallePedido1.getValorTotal());
                prendaDTO.setCantidad(detallePedido1.getCantidad());
                prendasPedido.add(prendaDTO);
            }

            pedidoResponse.setId(detallePedido.getPedido().getId());
            String nombreCompleto = detallePedido.getPedido().getCustomer().getName() + " " + detallePedido.getPedido().getCustomer().getLastname();
            pedidoResponse.setCustomerName(nombreCompleto);
            pedidoResponse.setTelefono(detallePedido.getPedido().getCustomer().getPhone());
            pedidoResponse.setFechaPedido(detallePedido.getPedido().getDate());
            pedidoResponse.setFechaEntrega(detallePedido.getFechaEntrega());
            pedidoResponse.setSaldo(detallePedido.getPedido().getSaldo());
            pedidoResponse.setPrenda(prendasPedido);
            pedidoResponse.setSastre(detallePedido.getUser().getName() + " " + detallePedido.getUser().getLastname());
            pedidoResponse.setEstado(detallePedido.getEstadoActual().getEstado());
            pedidoResponse.setConcepto(detallePedido.getConcepto().toString());
            pedidos.add(pedidoResponse);
        }
        return pedidos;
    }

    public List<PedidoResponse> findPedidosByCustomerPhone(Long phone){
        List<PedidoResponse> pedidos = new ArrayList<>();
        for (Pedido pedido : pedidoRepository.findPedidosByCustomer_Phone(phone)) {
            PedidoResponse pedidoResponse = new PedidoResponse();
            List<DetallePedido> detallePedidoList = detallePedidoRepository.findByPedido_Id(pedido.getId());
            List<PrendaDTO> prendasPedido = new ArrayList<>();
            for (DetallePedido detallePedido: detallePedidoList) {
                PrendaDTO prendaDTO = new PrendaDTO();
                prendaDTO.setDescripcion(detallePedido.getPrenda().getDescripcion());
                prendaDTO.setValor(detallePedido.getValorTotal());
                prendaDTO.setCantidad(detallePedido.getCantidad());
                prendasPedido.add(prendaDTO);
            }

            pedidoResponse.setId(pedido.getId());
            String nombreCompleto = pedido.getCustomer().getName() + " " + pedido.getCustomer().getLastname();
            pedidoResponse.setCustomerName(nombreCompleto);
            pedidoResponse.setTelefono(pedido.getCustomer().getPhone());
            pedidoResponse.setFechaPedido(pedido.getDate());
            pedidoResponse.setFechaEntrega(detallePedidoList.get(0).getFechaEntrega());
            pedidoResponse.setSaldo(pedido.getSaldo());
            pedidoResponse.setPrenda(prendasPedido);
            pedidoResponse.setSastre(detallePedidoList.get(0).getUser().getName() + " " + detallePedidoList.get(0).getUser().getLastname());
            pedidoResponse.setEstado(detallePedidoList.get(0).getEstadoActual().getEstado());
            pedidoResponse.setConcepto(detallePedidoList.get(0).getConcepto().toString());
            pedidos.add(pedidoResponse);
        }
        return pedidos;
    };







}

