package com.farukgenc.boilerplate.springboot.service;

import com.farukgenc.boilerplate.springboot.model.Abono;
import com.farukgenc.boilerplate.springboot.model.MetodoPago;
import com.farukgenc.boilerplate.springboot.repository.AbonoRepository;
import com.farukgenc.boilerplate.springboot.security.dto.InformeDTO;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class InformeService {
    @Autowired
    private GastoService gastoService;

    @Autowired
    private AbonoRepository abonoRepository;

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

    public FileOutputStream escribirInformeEnExcel(LocalDate fechaInicio, LocalDate fechaFin) throws IOException {
        List<InformeDTO> informes = buildInformeMouthlyByDay(fechaInicio, fechaFin);
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Informe Mensual");

        int diasDelMes = fechaInicio.lengthOfMonth();

        // 🔹 Crear la fila de encabezado con los días del mes
        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("Concepto"); // Primera celda fija
        for (int dia = 1; dia <= diasDelMes; dia++) {
            headerRow.createCell(dia).setCellValue(dia); // Encabezados de días
        }

        // 🔹 Crear las filas de Ingreso, Gasto y Saldo
        Row ingresoRow = sheet.createRow(1);
        ingresoRow.createCell(0).setCellValue("Ingreso");

        Row gastoRow = sheet.createRow(2);
        gastoRow.createCell(0).setCellValue("Gasto");

        Row saldoRow = sheet.createRow(3);
        saldoRow.createCell(0).setCellValue("Saldo");

        // 🔹 Llenar los datos en cada columna según el día
        for (InformeDTO informe : informes) {
            int dia = informe.getFecha().getDayOfMonth(); // Obtener el número del día

            ingresoRow.createCell(dia).setCellValue(informe.getIngresos());
            gastoRow.createCell(dia).setCellValue(informe.getGastos());
            saldoRow.createCell(dia).setCellValue(informe.getSaldo());
        }

        // 🔹 Guardar el archivo
        try (FileOutputStream fileOut = new FileOutputStream("informe_mensual.xlsx")) {
            workbook.write(fileOut);
        }
        workbook.close();

        System.out.println("Informe Excel generado con éxito.");
        return null;
    }

}
