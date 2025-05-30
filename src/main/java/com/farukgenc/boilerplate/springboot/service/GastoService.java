package com.farukgenc.boilerplate.springboot.service;

import com.farukgenc.boilerplate.springboot.model.CategoriaGasto;
import com.farukgenc.boilerplate.springboot.model.Gastos;
import com.farukgenc.boilerplate.springboot.model.User;
import com.farukgenc.boilerplate.springboot.repository.GastoRepository;
import com.farukgenc.boilerplate.springboot.repository.UserRepository;
import com.farukgenc.boilerplate.springboot.security.dto.GastosRequest;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.LineSeparator;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GastoService {

    @Autowired
    private GastoRepository gastoRepository;

    @Autowired
    private UserRepository userRepository;


    public Gastos nuevoGasto(GastosRequest gastosRequest) {
        User empleado = userRepository.findById(gastosRequest.getEmpleadoId())
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        Gastos gastos = new Gastos();
        gastos.setDescripcion(gastosRequest.getDescripcion());
        gastos.setMonto(gastosRequest.getMonto());
        gastos.setFecha(LocalDate.now());
        gastos.setCategoria(gastosRequest.getCategoria());
        gastos.setEmpleado(empleado);
        return gastoRepository.save(gastos);
    }

    public List<GastosRequest> obtenerGastos() {
        List<Gastos> gastos = gastoRepository.findAll();

        return gastos.stream()
                .map(gasto -> new GastosRequest(
                        gasto.getDescripcion(),
                        gasto.getMonto(),
                        gasto.getFecha(),
                        gasto.getCategoria(),
                        gasto.getEmpleado().getId()
                ))
                .collect(Collectors.toList());
    }


    public Double obtenervalorTotalDia(LocalDate fecha){
        return gastoRepository.findByfecha(fecha)
                .stream()
                .mapToDouble(Gastos::getMonto)
                .sum();
    }


    public List<GastosRequest> obtenerDetallesGastosDia(LocalDate fecha){
        List<Gastos> gastos = gastoRepository.findByfecha(fecha);

        return gastos.stream()
                .map(gasto -> new GastosRequest(
                        gasto.getDescripcion(),
                        gasto.getMonto(),
                        gasto.getFecha(),
                        gasto.getCategoria(),
                        gasto.getEmpleado().getId()
                ))
                .collect(Collectors.toList());
    }


    public Double obtenervalorTotalEnRango(LocalDate fechaInicio, LocalDate fechaFin){
        return gastoRepository.findByfechaBetween(fechaInicio, fechaFin)
                                .stream()
                                .mapToDouble(Gastos::getMonto)
                                .sum();
    }


    public double obtenerValesByEmpleado(Long id, LocalDate fechaInicio, LocalDate fechaFin, CategoriaGasto categoria) {
        List<Gastos> gastos = gastoRepository.findByEmpleado_IdAndFechaBetweenAndCategoria(id, fechaInicio, fechaFin, categoria);

        List<GastosRequest> vales = gastos.stream()
                .map(gasto -> new GastosRequest(
                        gasto.getDescripcion(),
                        gasto.getMonto(),
                        gasto.getFecha(),
                        gasto.getCategoria(),
                        gasto.getIdGasto()
                ))
                .collect(Collectors.toList());

        double total = 0;
        for (GastosRequest vale : vales) {
            total += vale.getMonto();
        }
        return total;
    }


    public double obtenerTotalGastosPorCategoriaYRango(CategoriaGasto categoria, LocalDate fechaInicio, LocalDate FechaFin){
        List<Gastos> gastos = gastoRepository.findByCategoriaAndFechaBetween( categoria,  fechaInicio,  FechaFin);
        return gastos.stream().mapToDouble(Gastos::getMonto).sum();
    }



    public List<GastosRequest> obtenerDetallesGastosorCategoriaYRango(CategoriaGasto categoria, LocalDate fechaInicio, LocalDate fechaFin){
        List<Gastos> gastos = gastoRepository.findByCategoriaAndFechaBetween(categoria, fechaInicio, fechaFin);

        return gastos.stream()
                .map(gasto -> new GastosRequest(
                        gasto.getDescripcion(),
                        gasto.getMonto(),
                        gasto.getFecha(),
                        gasto.getCategoria(),
                        gasto.getIdGasto()
                ))
                .collect(Collectors.toList());
    }

    public GastosRequest obtenerGastoId(Long id){
        Optional<Gastos> gastos = gastoRepository.findById(id);
        GastosRequest gastosRequest = new GastosRequest();
        gastosRequest.setDescripcion(gastos.get().getDescripcion());
        gastosRequest.setCategoria(gastos.get().getCategoria());
        gastosRequest.setMonto(gastos.get().getMonto());
        gastosRequest.setFecha(gastos.get().getFecha());
        gastosRequest.setEmpleadoId(gastos.get().getEmpleado().getId());
        return gastosRequest;

    }


    /*---------documento pdf de comprobante de egreso tipo VALE-----------*/
    public byte[] pdfVale(GastosRequest gastos){

        if (!CategoriaGasto.VALE.equals(gastos.getCategoria())){
            throw new IllegalArgumentException("Solo se genera el PDF para VALE");
        }else{
            try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
                PdfWriter writer = new PdfWriter(outputStream);
                PdfDocument pdfDocument = new PdfDocument(writer);


                PageSize pdfSize = new PageSize(200f, 270f);
                Document document = new Document(pdfDocument, pdfSize);
                document.setMargins(10f,10f,10f,10f);

                /*FORMATO DE FECHA*/
                DateTimeFormatter formartofg = DateTimeFormatter.ofPattern("E dd MMM yyyy hh:mm a", new Locale("ES", "ES"));

                /**ESTILO PARA FUENTE*/
                PdfFont fuenteGeneral = PdfFontFactory.createFont("Helvetica-Bold");
                PdfFont fuentetexto = PdfFontFactory.createFont("Helvetica");
                document.setFont(fuenteGeneral).setFontSize(9.7f);


                document.add(new Paragraph("COMPROBANTE ADELANTO NOMINA ").setMarginTop(10f).setFontSize(9.8f).setTextAlignment(TextAlignment.CENTER));
                Long idEmpleado = gastos.getEmpleadoId();
                String nombreEmpleado = userRepository.findUserById(idEmpleado).getName();
                document.add(new Paragraph("Yo, " + nombreEmpleado + " recibí de Sastreria Vesti Estilo Sede Barrancas la suma de " + gastos.getMonto() +
                        " pesos como adelanto de la nómina, los cuales autorizo sean descontados de mi próximo pago." ).setFont(fuentetexto));

                document.add(new Paragraph("Recibí"));
                document.add(new LineSeparator(new SolidLine(1f)));
                document.add(new Paragraph(nombreEmpleado.toUpperCase()));
                document.add(new Paragraph("Entregado Por: "));
                document.add(new Paragraph("MIGDALIA BURBANO").setTextAlignment(TextAlignment.RIGHT));
                document.add(new LineSeparator(new SolidLine(1f)).setMarginBottom(1.8f));
                document.add(new LineSeparator(new SolidLine(1f)));
                document.add(new Paragraph("Fecha de impresión: " + LocalDateTime.now(ZoneId.systemDefault()).format(formartofg)).setFontSize(7.9f).setMarginBottom(0.2f).setTextAlignment(TextAlignment.CENTER));
                document.add(new Paragraph("Desarrollado por grupo NeedlOS®").setTextAlignment(TextAlignment.CENTER));

                document.close();
                return outputStream.toByteArray();

            } catch (Exception e) {
                throw new RuntimeException("Error generando el PDF", e);
            }
        }
    }
}
