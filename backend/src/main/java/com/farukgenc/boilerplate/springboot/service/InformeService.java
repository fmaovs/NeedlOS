package com.farukgenc.boilerplate.springboot.service;

import com.farukgenc.boilerplate.springboot.model.*;
import com.farukgenc.boilerplate.springboot.repository.AbonoRepository;
import com.farukgenc.boilerplate.springboot.repository.GastoRepository;
import com.farukgenc.boilerplate.springboot.repository.PedidoRepository;
import com.farukgenc.boilerplate.springboot.security.dto.*;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.LineSeparator;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class InformeService {
    @Autowired
    private GastoService gastoService;

    @Autowired
    private GastoRepository gastoRepository;

    @Autowired
    private AbonoRepository abonoRepository;

    @Autowired
    private AbonoService abonoService;

    @Autowired
    private ArqueoService arqueoService;

    @Autowired
    private PedidoRepository pedidoRepository;

    public InformeDTO buildInformeTotalMensual(LocalDate fechaInicio, LocalDate fechaFin){
        double gastoMensual = gastoService.obtenervalorTotalEnRango(fechaInicio,fechaFin);
        Map<MetodoPago, Double> ingresos = Arrays.stream(MetodoPago.values())
                .collect(Collectors.toMap(
                        metodo -> metodo,
                        metodo -> abonoRepository.findByFechaBetweenAndMetodoPago(
                                        Date.from(fechaInicio.atStartOfDay(ZoneId.systemDefault()).toInstant()), Date.from(fechaFin.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant()), metodo)
                                .stream()
                                .mapToDouble(Abono::getMonto)
                                .sum()
                ));

        double ingresoMensualBancolombia = ingresos.getOrDefault(MetodoPago.BANCOLOMBIA, 0.0);
        double ingresoMensualNequi = ingresos.getOrDefault(MetodoPago.NEQUI, 0.0);
        double ingresoMensualDaviplata = ingresos.getOrDefault(MetodoPago.DAVIPLATA, 0.0);
        double ingresoMensualEfectivo = ingresos.getOrDefault(MetodoPago.EFECTIVO, 0.0);

        double ingresoMensual = ingresoMensualBancolombia + ingresoMensualDaviplata + ingresoMensualEfectivo + ingresoMensualNequi;
        double saldo = ingresoMensual - gastoMensual;

        InformeDTO informeDTO = new InformeDTO();
        informeDTO.setIngresos(ingresoMensual);
        informeDTO.setGastos(gastoMensual);
        informeDTO.setSaldo(saldo);

        return informeDTO;
    }

    public List<InformeDTO> buildInformeMouthlyByDay(LocalDate fechaInicio, LocalDate fechaFin){
        List<InformeDTO> informecito = new ArrayList<>();
        for (int i = 1; i <= fechaInicio.lengthOfMonth(); i++) {
            InformeDTO informeDTO = buildInformeTotalMensual(fechaInicio.withDayOfMonth(i),fechaFin.withDayOfMonth(i));
            informeDTO.setFecha(fechaInicio.withDayOfMonth(i));
            informecito.add(informeDTO);
        }
        return informecito;
    }

    /**____________________ CREACIÓN DE INFORME EN FORMATO PDF_____________________ */

    public byte[] informeMensualPdf(LocalDate fechaInicio, LocalDate fechaFin) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdfDocument = new PdfDocument(writer);

            /*tamaño y margenes*/
            PageSize pdfSize = new PageSize(200f, 400f);
            Document document = new Document(pdfDocument, pdfSize);
            document.setMargins(8f,8f,8f,8f);

            /*estilos para las fuentes */
            PdfFont boldFont = PdfFontFactory.createFont("Helvetica-Bold");
            document.setFont(boldFont);

            //fromato de las fechas
            DateTimeFormatter formartofg = DateTimeFormatter.ofPattern("dd-MMM-yyyy");
            SimpleDateFormat formato = new SimpleDateFormat("E dd MMM yyyy hh:mm a", new Locale("ES", "ES"));


            document.add(new Paragraph("VESTI ESTILOS\n"+"Agencia Creditos\n"+"REPORTE DINERO PERIODICO").setFontSize(11f).setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph(LocalDateTime.now(ZoneId.systemDefault()).format(formartofg)).setFontSize(8f).setTextAlignment(TextAlignment.CENTER));
            document.add(new LineSeparator(new SolidLine(1f)));
            document.add(new Paragraph("Abonos y Otros Facturador").setFontSize(9.5f).setMarginBottom(1f));

            float[] tamañosColumnas ={5f, 135f, 40f};
            Table abonoTable = new Table(tamañosColumnas);
            abonoTable.addHeaderCell("ID").setFontSize(8f).setMarginBottom(1f);
            abonoTable.addHeaderCell("Detalles").setFontSize(8f).setMarginBottom(1f);
            abonoTable.addHeaderCell("Valor").setFontSize(8f).setMarginBottom(1f);

            //convertir fecha a String como lo pide el servise de getFechaBetween
            String fechaI = fechaInicio.toString();
            String fechaF = fechaFin.toString();
            Date dateInicio = Date.from(fechaInicio.atStartOfDay(ZoneId.systemDefault()).toInstant());
            Date dateFin = Date.from(fechaFin.atStartOfDay(ZoneId.systemDefault()).toInstant());


            List<AbonoResponse> abonos = abonoService.getFechaBetween(fechaI, fechaF);
            float totalAbonos = 0;
            for (AbonoResponse abono : abonos){
                abonoTable.addCell(abono.getId().toString()).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER);
                abonoTable.addCell("Abo-mos-" + abono.getMetodoPago()).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER);
                abonoTable.addCell("$" + abono.getMonto()).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER);
                totalAbonos += abono.getMonto();
            }
            abonoTable.addCell(new Cell(1, 2).add(new Paragraph("Total Abonos y Otros " + abonos.size())).setFontSize(8f).setMarginTop(5f));
            abonoTable.addCell("$" + totalAbonos).setFontSize(8f).setMarginTop(5f);
            document.add(abonoTable);

            document.add(new LineSeparator(new SolidLine(1)));
            document.add(new Paragraph("Salidas Facturador").setFontSize(9.5f).setMarginBottom(1f));
            document.add(new LineSeparator(new SolidLine(1)));

            Table gastosTable = new Table(tamañosColumnas);
            gastosTable.addHeaderCell("ID").setFontSize(8f).setMarginBottom(1f);
            gastosTable.addHeaderCell("Detalles").setFontSize(8f).setMarginBottom(1f);
            gastosTable.addHeaderCell("Valor").setFontSize(8f).setMarginBottom(1f);

            List<Gastos> gastos = gastoRepository.findByfechaBetween(fechaInicio, fechaFin);

            float totalGastos = 0;
            for (Gastos gasto: gastos){
                gastosTable.addCell(gasto.getIdGasto().toString());
                gastosTable.addCell( "Pag-mos-"+ gasto.getDescripcion());
                gastosTable.addCell(gasto.getMonto().toString());
                totalGastos += gasto.getMonto();
            }

            gastosTable.addCell(new Cell(1, 2).add(new Paragraph("Total Salidas Facturador " + abonos.size())).setFontSize(8f).setMarginTop(5f));
            gastosTable.addCell("$" + totalGastos ).setFontSize(8f).setMarginTop(5f);

            gastosTable.addCell(new Cell(1, 2).add(new Paragraph("Total Ingresos Facturador " + abonos.size())).setFontSize(8f).setMarginTop(5f));
            gastosTable.addCell("$" + (totalGastos + totalAbonos) ).setFontSize(8f).setMarginTop(5f);

            gastosTable.addCell(new Cell(1, 2).add(new Paragraph("Total Ingresos " + abonos.size())).setFontSize(8f).setMarginTop(5f));
            gastosTable.addCell("$" + (totalGastos + totalAbonos) ).setFontSize(8f).setMarginTop(5f);
            document.add(gastosTable);

            document.add(new Paragraph("RESUMEN DE CAJA").setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph("Total en Caja:\n" + (totalAbonos - totalGastos)).setTextAlignment(TextAlignment.CENTER).setBorder(new SolidBorder(1f)));
            document.add(new LineSeparator(new SolidLine(1)));

            List<Pedido> pedidos = pedidoRepository.findPedidosByDateBetween(dateInicio, dateFin);

            int totalPrendas = 0;
            int totalEntregadas = 0;
            int totalPrendasEntregadas = 0;

            //for para tarer informaciond de las prendas y de los pedido entregados
            for (Pedido pedido : pedidos) {
                if (pedido.getDetalles() != null) {
                    for (DetallePedido detalle : pedido.getDetalles()) {
                        totalPrendas += detalle.getCantidad();
                        if (Estado.ENTREGADO.equals(detalle.getEstadoActual().getEstado())) {
                            totalEntregadas ++;
                            totalPrendasEntregadas += detalle.getCantidad();
                        }
                    }
                }
            }

            float[] tamañosColumnas2 ={90f, 50f, 50f};
            Table detallesTable = new Table(tamañosColumnas2);

            detallesTable.addCell(new Cell().add(new Paragraph("Concepto").setTextAlignment(TextAlignment.LEFT)).setFontSize(8f).setMarginBottom(1f));
            detallesTable.addCell(new Cell().add(new Paragraph("Mostrad").setTextAlignment(TextAlignment.CENTER)).setFontSize(8f).setMarginBottom(1f));
            detallesTable.addCell(new Cell().add(new Paragraph("Total").setTextAlignment(TextAlignment.RIGHT)).setFontSize(8f).setMarginBottom(1f));

            detallesTable.addCell(new Cell().add(new Paragraph("Ord.Gener")).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER));
            detallesTable.addCell(new Cell().add(new Paragraph(String.valueOf(pedidos.size()))).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER));
            detallesTable.addCell(new Cell().add(new Paragraph(String.valueOf(pedidos.size()))).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER));

            detallesTable.addCell(new Cell().add(new Paragraph("Pzs.Ingre")).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER));
            detallesTable.addCell(new Cell().add(new Paragraph(String.valueOf(totalPrendas))).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER));
            detallesTable.addCell(new Cell().add(new Paragraph(String.valueOf(totalPrendas))).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER));

            detallesTable.addCell(new Cell().add(new Paragraph("Ord.Salen")).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER));
            detallesTable.addCell(new Cell().add(new Paragraph(String.valueOf(totalPrendasEntregadas))).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER));
            detallesTable.addCell(new Cell().add(new Paragraph(String.valueOf(totalEntregadas))).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER));

            detallesTable.addCell(new Cell().add(new Paragraph("Pzs.Salen")).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER));
            detallesTable.addCell(new Cell().add(new Paragraph("0")).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER));
            detallesTable.addCell(new Cell().add(new Paragraph(String.valueOf(totalPrendasEntregadas))).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER));

            detallesTable.addCell(new Cell().add(new Paragraph("Pagos")).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER));
            detallesTable.addCell(new Cell().add(new Paragraph(String.valueOf(totalGastos))).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER));
            detallesTable.addCell(new Cell().add(new Paragraph(String.valueOf(totalGastos))).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER));

            detallesTable.addCell(new Cell().add(new Paragraph("Otros")).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER));
            detallesTable.addCell(new Cell().add(new Paragraph(" ")).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER));
            detallesTable.addCell(new Cell().add(new Paragraph(" ")).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER));

            detallesTable.addCell(new Cell().add(new Paragraph("Tot.Ingre.")).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER));
            detallesTable.addCell(new Cell().add(new Paragraph("$" + (totalGastos + totalAbonos))).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER));
            detallesTable.addCell(new Cell().add(new Paragraph("$" + (totalGastos + totalAbonos))).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER));

            detallesTable.addCell(new Cell().add(new Paragraph("Gastos")).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER));
            detallesTable.addCell(new Cell().add(new Paragraph(" ")).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER));
            detallesTable.addCell(new Cell().add(new Paragraph("0")).setFontSize(8f).setMarginBottom(1f).setBorder(Border.NO_BORDER));

            document.add(detallesTable);

            document.add(new LineSeparator(new SolidLine(2)));
            document.add(new Paragraph("Fecha de impresión: " + LocalDateTime.now(ZoneId.systemDefault()).format(formartofg)).setFontSize(5.5f).setMarginBottom(1f).setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph("Desarrollado por grupo NeedlOS®").setFontSize(7f).setMarginBottom(1f).setTextAlignment(TextAlignment.CENTER));

            document.close();
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error al generar el PDF",e);
        }
    }
}
