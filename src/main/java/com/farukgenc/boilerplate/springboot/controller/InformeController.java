package com.farukgenc.boilerplate.springboot.controller;

import com.farukgenc.boilerplate.springboot.model.Gastos;
import com.farukgenc.boilerplate.springboot.repository.GastoRepository;
import com.farukgenc.boilerplate.springboot.security.dto.AbonoResponse;
import com.farukgenc.boilerplate.springboot.security.dto.InformeDTO;
import com.farukgenc.boilerplate.springboot.security.dto.PedidoResponse;
import com.farukgenc.boilerplate.springboot.service.AbonoService;
import com.farukgenc.boilerplate.springboot.service.GastoService;
import com.farukgenc.boilerplate.springboot.service.InformeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/informe")
@CrossOrigin(origins = "*")
public class InformeController {

    @Autowired
    private InformeService informeService;

    @Autowired
    private AbonoService abonoService;

    @Autowired
    private GastoRepository gastoRepository;

    @GetMapping("/total")
    public ResponseEntity<InformeDTO> getInformeMensual(LocalDate fechaInicio, LocalDate fechaFin){
        InformeDTO informeDTO = informeService.buildInformeTotalMensual(fechaInicio,fechaFin);
        return ResponseEntity.ok(informeDTO);
    }

    @GetMapping("/mensual")
    public ResponseEntity<List<InformeDTO>> getInformeMouthlyByDay(LocalDate fechaInicio, LocalDate fechaFin){
        List<InformeDTO> informesote = informeService.buildInformeMouthlyByDay(fechaInicio,fechaFin);
        return ResponseEntity.ok(informesote);
    }

    @GetMapping("/pdf/mensual")
    public ResponseEntity<byte[]> generarPdfinforme(LocalDate fechaInicio, LocalDate fechaFin) {
        String fechaI = fechaInicio.toString();
        String fechaF = fechaFin.toString();

        byte[] pdfListo = informeService.informeMensualPdf(fechaInicio, fechaFin);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Informe-mensual" + fechaI + "||" + fechaF + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfListo);
    }
}
