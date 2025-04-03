package com.farukgenc.boilerplate.springboot.service;

import com.farukgenc.boilerplate.springboot.model.*;
import com.farukgenc.boilerplate.springboot.repository.*;
import com.farukgenc.boilerplate.springboot.security.dto.DetallePedidoDTO;
import com.farukgenc.boilerplate.springboot.security.dto.PedidoDTO;
import com.farukgenc.boilerplate.springboot.security.dto.PedidoResponse;
import com.farukgenc.boilerplate.springboot.security.dto.PrendaDTO;
import com.farukgenc.boilerplate.springboot.security.service.UserService;
import com.farukgenc.boilerplate.springboot.security.service.UserServiceImpl;
import com.itextpdf.barcodes.Barcode128;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.LineSeparator;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import jakarta.transaction.Transactional;
import org.hibernate.query.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.RowSet;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
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
            detalle.setDetallePedido(detalleDTO.getDetallePedido());
            String concepto = detalleDTO.getConcepto();
            detalle.setConcepto(Concepto.valueOf(concepto.toUpperCase()));
            detallePedidoRepository.save(detalle); // Persistir el detalle primero

            // Crear el estado inicial para este detalle
            EstadoPedido estadoInicial = new EstadoPedido();
            estadoInicial.setEstado(Estado.EN_PROCESO);
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
        pedidoResponse.setTotalAbonos(pedido.getTotalAbonos());
        List<PrendaDTO> prendasPedido = new ArrayList<>();
        for (DetallePedido detallePedido: pedido.getDetalles()) {
            PrendaDTO prendaDTO = new PrendaDTO();
            prendaDTO.setDescripcion(detallePedido.getPrenda().getDescripcion());
            prendaDTO.setValor(detallePedido.getValorTotal());
            prendaDTO.setDetalle_pedido(detallePedido.getDetallePedido());
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
                pedidoResponse.setCustomerName(detallePedido.getPedido().getCustomer().getName());
                pedidoResponse.setCustomerLastName(detallePedido.getPedido().getCustomer().getLastname());
                pedidoResponse.setTelefono(detallePedido.getPedido().getCustomer().getPhone());
                pedidoResponse.setFechaPedido(detallePedido.getPedido().getDate());
                pedidoResponse.setFechaEntrega(detallePedido.getFechaEntrega());
                pedidoResponse.setSaldo(detallePedido.getPedido().getSaldo());
                pedidoResponse.setTotalAbonos(detallePedido.getPedido().getTotalAbonos());
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

        String estadoUpper = estado.toUpperCase();
        Estado estadoEnum = Estado.valueOf(estadoUpper);

        List<PedidoResponse> pedidos = new ArrayList<>();
        for (Pedido pedido : pedidoRepository.findByDetalles_EstadoActual_Estado(estadoEnum)) {
            PedidoResponse pedidoResponse = new PedidoResponse();
            List<DetallePedido> detallePedidoList = detallePedidoRepository.findByPedido_Id(pedido.getId());
            List<PrendaDTO> prendasPedido = new ArrayList<>();
            for (DetallePedido detallePedido1: detallePedidoList) {
                PrendaDTO prendaDTO = new PrendaDTO();
                prendaDTO.setDescripcion(detallePedido1.getPrenda().getDescripcion());
                prendaDTO.setValor(detallePedido1.getValorTotal());
                prendaDTO.setCantidad(detallePedido1.getCantidad());
                prendasPedido.add(prendaDTO);
            }

            pedidoResponse.setId(pedido.getId());
            pedidoResponse.setCustomerName(pedido.getCustomer().getName());
            pedidoResponse.setCustomerLastName(pedido.getCustomer().getLastname());
            pedidoResponse.setTelefono(pedido.getCustomer().getPhone());
            pedidoResponse.setFechaPedido(pedido.getDate());
            pedidoResponse.setFechaEntrega(pedido.getDetalles().get(0).getFechaEntrega());
            pedidoResponse.setSaldo(pedido.getSaldo());
            pedidoResponse.setTotalAbonos(pedido.getTotalAbonos());
            pedidoResponse.setPrenda(prendasPedido);
            pedidoResponse.setSastre(pedido.getDetalles().get(0).getUser().getName() + " " + pedido.getDetalles().get(0).getUser().getLastname());
            pedidoResponse.setEstado(Estado.valueOf(pedido.getDetalles().get(0).getEstadoActual().getEstado().toString()));
            pedidoResponse.setConcepto(pedido.getDetalles().get(0).getConcepto().toString());
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
        pedidoResponse.setCustomerName(pedido.getCustomer().getName());
        pedidoResponse.setCustomerLastName(pedido.getCustomer().getLastname());
        pedidoResponse.setTelefono(pedido.getCustomer().getPhone());
        pedidoResponse.setFechaPedido(pedido.getDate());
        pedidoResponse.setFechaEntrega(detallePedidoList.get(0).getFechaEntrega());
        pedidoResponse.setSaldo(pedido.getSaldo());
        pedidoResponse.setTotalAbonos(pedido.getTotalAbonos());
        for (DetallePedido detallePedido: detallePedidoList) {
            PrendaDTO prendaDTO = new PrendaDTO();
            prendaDTO.setDescripcion(detallePedido.getPrenda().getDescripcion());
            prendaDTO.setValor(detallePedido.getValorTotal());
            prendaDTO.setCantidad(detallePedido.getCantidad());
            prendaDTO.setDetalle_pedido(detallePedido.getDetallePedido());
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
                pedidoResponse.setCustomerName(detallePedido.getPedido().getCustomer().getName());
                pedidoResponse.setCustomerLastName(detallePedido.getPedido().getCustomer().getLastname());
                pedidoResponse.setTelefono(detallePedido.getPedido().getCustomer().getPhone());
                pedidoResponse.setFechaPedido(detallePedido.getPedido().getDate());
                pedidoResponse.setFechaEntrega(detallePedido.getFechaEntrega());
                pedidoResponse.setSaldo(detallePedido.getPedido().getSaldo());
                pedidoResponse.setTotalAbonos(detallePedido.getPedido().getTotalAbonos());
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
                pedidoResponse.setCustomerName(pedido.getCustomer().getName());
                pedidoResponse.setCustomerLastName(pedido.getCustomer().getLastname());
                pedidoResponse.setTelefono(pedido.getCustomer().getPhone());
                pedidoResponse.setFechaPedido(pedido.getDate());
                pedidoResponse.setFechaEntrega(pedido.getDetalles().get(0).getFechaEntrega());
                pedidoResponse.setSaldo(pedido.getSaldo());
                pedidoResponse.setTotalAbonos(pedido.getTotalAbonos());
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

    public List<PedidoResponse> findPedidosByDetalleUserName(String nombre){
        List<PedidoResponse> pedidos = new ArrayList<>();
        for (Pedido pedido : pedidoRepository.findPedidosByDetalles_User_Name(nombre)) {
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
            pedidoResponse.setCustomerName(pedido.getCustomer().getName());
            pedidoResponse.setCustomerLastName(pedido.getCustomer().getLastname());
            pedidoResponse.setTelefono(pedido.getCustomer().getPhone());
            pedidoResponse.setFechaPedido(pedido.getDate());
            pedidoResponse.setFechaEntrega(detallePedidoList.get(0).getFechaEntrega());
            pedidoResponse.setSaldo(pedido.getSaldo());
            pedidoResponse.setTotalAbonos(pedido.getTotalAbonos());
            pedidoResponse.setPrenda(prendasPedido);
            pedidoResponse.setSastre(detallePedidoList.get(0).getUser().getName() + " " + detallePedidoList.get(0).getUser().getLastname());
            pedidoResponse.setEstado(detallePedidoList.get(0).getEstadoActual().getEstado());
            pedidoResponse.setConcepto(detallePedidoList.get(0).getConcepto().toString());
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
            pedidoResponse.setCustomerName(pedido.getCustomer().getName());
            pedidoResponse.setCustomerLastName(pedido.getCustomer().getLastname());
            pedidoResponse.setTelefono(pedido.getCustomer().getPhone());
            pedidoResponse.setFechaPedido(pedido.getDate());
            pedidoResponse.setFechaEntrega(detallePedidoList.get(0).getFechaEntrega());
            pedidoResponse.setSaldo(pedido.getSaldo());
            pedidoResponse.setTotalAbonos(pedido.getTotalAbonos());
            pedidoResponse.setPrenda(prendasPedido);
            pedidoResponse.setSastre(detallePedidoList.get(0).getUser().getName() + " " + detallePedidoList.get(0).getUser().getLastname());
            pedidoResponse.setEstado(detallePedidoList.get(0).getEstadoActual().getEstado());
            pedidoResponse.setConcepto(detallePedidoList.get(0).getConcepto().toString());
            pedidos.add(pedidoResponse);
        }
        return pedidos;
    };

    public void updateSaldo(Long id, double monto) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado"));
        pedido.setSaldo(pedido.getSaldo() - monto);
        pedido.setTotalAbonos(pedido.getTotalAbonos() + monto);
        pedidoRepository.save(pedido);
    }

    @Transactional
    public String cambiarEstado(Long id, String estado) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado"));
        Estado estadoEnum = Estado.valueOf(estado.toUpperCase());
        for (DetallePedido detallePedido : pedido.getDetalles()) {
            EstadoPedido estadoPedido = new EstadoPedido();
            estadoPedido.setEstado(estadoEnum);
            estadoPedido.setFechaCambio(LocalDateTime.now());
            estadoPedido.setDetallePedido(detallePedido);
            estadoPedidoRepository.save(estadoPedido);
            detallePedido.setEstadoActual(estadoPedido);
            detallePedidoRepository.save(detallePedido);
        }
        return "Estado actualizado";
    }

    @Transactional
    public String cambiarSastre(Long id, Long sastreId) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado"));
        User sastre = userService.findById(sastreId);
        for (DetallePedido detallePedido : pedido.getDetalles()) {
            detallePedido.setUser(sastre);
            detallePedidoRepository.save(detallePedido);
        }
        return "Sastre actualizado";
    }

    public Pedido convertPedidoResponseToPedido(PedidoResponse pedidoResponse) {
        Pedido pedido = new Pedido();
        pedido.setId(pedidoResponse.getId());
        pedido.setDate(pedidoResponse.getFechaPedido());
        pedido.setTotalAbonos(pedidoResponse.getTotalAbonos());
        pedido.setSaldo(pedidoResponse.getSaldo());
        Customer customer = new Customer();
        customer.setName(pedidoResponse.getCustomerName());
        customer.setLastname(pedidoResponse.getCustomerLastName());
        customer.setPhone(pedidoResponse.getTelefono());
        pedido.setCustomer(customer);
        List<DetallePedido> detalles = new ArrayList<>();
        for (PrendaDTO prendaDTO : pedidoResponse.getPrenda()) {
            DetallePedido detallePedido = new DetallePedido();
            Prenda prenda = new Prenda();
            prenda.setDescripcion(prendaDTO.getDescripcion());
            detallePedido.setPrenda(prenda);
            detallePedido.setCantidad(prendaDTO.getCantidad());
            detallePedido.setValorTotal(prendaDTO.getValor());
            detalles.add(detallePedido);
        }
        pedido.setDetalles(detalles);
        return pedido;
    }

    public List<PedidoResponse> findPedidosByFechaBetween(Date fechaInicio, Date fechaFin) {

        List<Pedido> pedidos = pedidoRepository.findPedidosByDateBetween(fechaInicio, fechaFin);
        List<PedidoResponse> pedidosResponse = new ArrayList<>();
        for (Pedido pedido : pedidos) {
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
            pedidoResponse.setCustomerName(pedido.getCustomer().getName());
            pedidoResponse.setCustomerLastName(pedido.getCustomer().getLastname());
            pedidoResponse.setTelefono(pedido.getCustomer().getPhone());
            pedidoResponse.setFechaPedido(pedido.getDate());
            pedidoResponse.setFechaEntrega(detallePedidoList.get(0).getFechaEntrega());
            pedidoResponse.setSaldo(pedido.getSaldo());
            pedidoResponse.setTotalAbonos(pedido.getTotalAbonos());
            pedidoResponse.setPrenda(prendasPedido);
            pedidoResponse.setSastre(detallePedidoList.get(0).getUser().getName() + " " + detallePedidoList.get(0).getUser().getLastname());
            pedidoResponse.setEstado(detallePedidoList.get(0).getEstadoActual().getEstado());
            pedidoResponse.setConcepto(detallePedidoList.get(0).getConcepto().toString());
            pedidosResponse.add(pedidoResponse);
        }
        return pedidosResponse;
    }

    public PedidoResponse convertPedidoToPedidoResponse(Pedido pedido) {
        PedidoResponse pedidoResponse = new PedidoResponse();
        pedidoResponse.setId(pedido.getId());
        pedidoResponse.setCustomerName(pedido.getCustomer().getName());
        pedidoResponse.setCustomerLastName(pedido.getCustomer().getLastname());
        pedidoResponse.setTelefono(pedido.getCustomer().getPhone());
        pedidoResponse.setFechaPedido(pedido.getDate());
        pedidoResponse.setFechaEntrega(pedido.getDetalles().get(0).getFechaEntrega());
        pedidoResponse.setSaldo(pedido.getSaldo());
        pedidoResponse.setTotalAbonos(pedido.getTotalAbonos());
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

    public List<PedidoResponse> getPedidosByDate(String date) {

        LocalDate localDate = LocalDate.parse(date);

        Date fechaInicio = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date fechaFin = Date.from(localDate.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant());

        List<Pedido> pedidos = pedidoRepository.findPedidosByDateBetween(fechaInicio, fechaFin);
        List<PedidoResponse> pedidosResponse = new ArrayList<>();
        for (Pedido pedido : pedidos) {
            if (pedido.getDetalles().get(0).getEstadoActual().getEstado()==Estado.EN_PROCESO || pedido.getDetalles().get(0).getEstadoActual().getEstado()==Estado.FINALIZADO){PedidoResponse pedidoResponse = new PedidoResponse();
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
                pedidoResponse.setCustomerName(pedido.getCustomer().getName());
                pedidoResponse.setCustomerLastName(pedido.getCustomer().getLastname());
                pedidoResponse.setTelefono(pedido.getCustomer().getPhone());
                pedidoResponse.setFechaPedido(pedido.getDate());
                pedidoResponse.setFechaEntrega(detallePedidoList.get(0).getFechaEntrega());
                pedidoResponse.setSaldo(pedido.getSaldo());
                pedidoResponse.setTotalAbonos(pedido.getTotalAbonos());
                pedidoResponse.setPrenda(prendasPedido);
                pedidoResponse.setSastre(detallePedidoList.get(0).getUser().getName() + " " + detallePedidoList.get(0).getUser().getLastname());
                pedidoResponse.setEstado(detallePedidoList.get(0).getEstadoActual().getEstado());
                pedidoResponse.setConcepto(detallePedidoList.get(0).getConcepto().toString());
                pedidosResponse.add(pedidoResponse);}
        }
        System.out.println(pedidosResponse);
        return pedidosResponse;
    }

    public List<PedidoResponse> getPedidosByDateAndEstado(String date, String estado) {

        Estado estadoEnum = Estado.valueOf(estado.toUpperCase());
        LocalDateTime date1 = LocalDateTime.parse(date + "T00:00:00");
        LocalDateTime date2 = LocalDateTime.parse(date + "T23:59:59");

        List<Pedido> pedidos = pedidoRepository.findPedidosByDateBetweenAndDetalles_EstadoActual_Estado(date1, date2, estadoEnum);
        List<PedidoResponse> pedidosResponse = new ArrayList<>();
        for (Pedido pedido : pedidos) {
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
            pedidoResponse.setCustomerName(pedido.getCustomer().getName());
            pedidoResponse.setCustomerLastName(pedido.getCustomer().getLastname());
            pedidoResponse.setTelefono(pedido.getCustomer().getPhone());
            pedidoResponse.setFechaPedido(pedido.getDate());
            pedidoResponse.setFechaEntrega(detallePedidoList.get(0).getFechaEntrega());
            pedidoResponse.setSaldo(pedido.getSaldo());
            pedidoResponse.setTotalAbonos(pedido.getTotalAbonos());
            pedidoResponse.setPrenda(prendasPedido);
            pedidoResponse.setSastre(detallePedidoList.get(0).getUser().getName() + " " + detallePedidoList.get(0).getUser().getLastname());
            pedidoResponse.setEstado(detallePedidoList.get(0).getEstadoActual().getEstado());
            pedidoResponse.setConcepto(detallePedidoList.get(0).getConcepto().toString());
            pedidosResponse.add(pedidoResponse);
        }
        return pedidosResponse;
    }

    public Integer getCantidadPrendasByEstadoAndDate(String date) {
        String estadoEnum = "ENTREGADO";
        LocalDateTime date1 = LocalDateTime.parse(date + "T00:00:00");
        LocalDateTime date2 = LocalDateTime.parse(date + "T23:59:59");

        List<PedidoResponse> pedidos = getPedidosByDateAndEstado(date, estadoEnum);
        int cantidadPrendas = 0;
        for (PedidoResponse pedido : pedidos) {
            for (PrendaDTO prenda : pedido.getPrenda()) {
                cantidadPrendas += prenda.getCantidad();
            }
        }
        return cantidadPrendas;
    }




    /*____________________intento para crear PDF de orden_____________________ */

    public byte[] pdfOrden(PedidoResponse pedidoResponse) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdfDocument = new PdfDocument(writer);

            /*tamaño y margenes*/
            PageSize pdfSize = new PageSize(200, 400);
            Document document = new Document(pdfDocument, pdfSize);
            document.setMargins(10,10,10,10);

            /*estilos para las fuentes */
            PdfFont boldFont = PdfFontFactory.createFont("Helvetica-Bold");
            document.setFont(boldFont);

            //fromato de las fechas
            DateTimeFormatter formartof = DateTimeFormatter.ofPattern("E dd MMM yyyy hh:mm a", new Locale("ES", "ES"));

            /*------------------------posicion para logo {CAMBIARLO A IMAGEN}-------------------*/
            document.add(new Paragraph("LOGO-EMPRESA-CAMI")
                    .setFontSize(20).
                    setFont(boldFont).
                    setHorizontalAlignment(HorizontalAlignment.CENTER));


            document.add(new Paragraph(String.valueOf(pedidoResponse.getId()))
                    .setFont(boldFont)
                    .setFontSize(50)
                    .setPadding(0)
                    .setMargin(1)
                    .setTextAlignment(TextAlignment.CENTER).setBorder(new SolidBorder(1)));

            /*codigo de barras*/
            Barcode128 barcode128 = new Barcode128(pdfDocument);
            barcode128.setCode(String.valueOf(pedidoResponse.getId()));
            barcode128.setFont(null);
            document.add(new Image(barcode128.createFormXObject(pdfDocument))
                    .setWidth(90).
                    setHorizontalAlignment(HorizontalAlignment.CENTER));

            document.add(new Paragraph("Cliente\n" + pedidoResponse.getCustomerName() + " " + pedidoResponse.getCustomerLastName())
                    .setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph("Telefono: " + pedidoResponse.getTelefono()));
            document.add(new Paragraph("Fecha: " + pedidoResponse.getFechaPedido()));
            document.add(new LineSeparator(new SolidLine(1)));

            /*----prendas  del pedido -------------*/

            float[] tamañosColumnas ={5, 135, 40};
            Table table = new Table(tamañosColumnas);
            table.addCell("Cant.");
            table.addCell("Detalles.");
            table.addCell("Valor $");


            for (PrendaDTO prenda : pedidoResponse.getPrenda()) {
                table.addCell(String.valueOf(prenda.getCantidad()));
                table.addCell(prenda.getDescripcion()+" " + prenda.getDetalle_pedido() );
                table.addCell("" + prenda.getValor() / prenda.getCantidad());
            }

            table.addCell("");
            table.addCell("Total");
            table.addCell("" + pedidoResponse.getPrenda().stream()
                    .mapToDouble(prenda -> prenda.getValor())
                    .sum());
            document.add(table);
            document.add(new Paragraph("Abonos: $" + pedidoResponse.getTotalAbonos()));
            document.add(new Paragraph("subtotal: $" + pedidoResponse.getSaldo()));
            document.add(new LineSeparator(new SolidLine(1)));
            document.add(new Paragraph("Atendido por: " + pedidoResponse.getSastre()).setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph("Para Entregar: " + pedidoResponse.getFechaEntrega()).setTextAlignment(TextAlignment.CENTER));
            barcode128.setCode(String.valueOf(pedidoResponse.getFechaEntrega()));
            document.add(new Image(barcode128.createFormXObject(pdfDocument))
                    .setWidth(120).
                    setHorizontalAlignment(HorizontalAlignment.CENTER));
            document.add(new LineSeparator(new SolidLine(1)));

            document.add(new Paragraph("fecha 2" + LocalDateTime.now(ZoneId.systemDefault()).format(formartof)));
            document.add(new Paragraph("Desarrollado por grupo NeedlOS"));

            document.close();
            return outputStream.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generando el PDF", e);
        }
    }


}

