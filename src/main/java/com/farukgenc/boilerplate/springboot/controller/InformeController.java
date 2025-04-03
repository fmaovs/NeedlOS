package com.farukgenc.boilerplate.springboot.controller;

import com.farukgenc.boilerplate.springboot.security.dto.InformeDTO;
import com.farukgenc.boilerplate.springboot.service.InformeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    @GetMapping("/excel")
    public void generarDocumento(LocalDate fechaInicio, LocalDate fechaFin) throws IOException {
        FileOutputStream fileOut = informeService.escribirInformeEnExcel(fechaInicio,fechaFin);
    }
}
