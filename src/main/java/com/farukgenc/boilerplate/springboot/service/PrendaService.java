package com.farukgenc.boilerplate.springboot.service;

import com.farukgenc.boilerplate.springboot.model.Prenda;
import com.farukgenc.boilerplate.springboot.repository.PrendaRepository;
import com.farukgenc.boilerplate.springboot.security.dto.PrendaDTO;
import com.farukgenc.boilerplate.springboot.security.dto.PrendaResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PrendaService {
    @Autowired
    private PrendaRepository prendaRepository;

    public List<PrendaResponseDTO> getAllPrendas() {
        List<PrendaResponseDTO> prendaDTOList = new ArrayList<>();
        for (Prenda prenda : prendaRepository.findAll()) {
            PrendaResponseDTO prendaDTO = new PrendaResponseDTO();
            prendaDTO.setId(prenda.getId());
            prendaDTO.setDescripcion(prenda.getDescripcion());
            prendaDTO.setValor(prenda.getValor());
            prendaDTOList.add(prendaDTO);
        }
        return prendaDTOList;
    }

    public PrendaResponseDTO getPrendaById(Long id) {
        Prenda prenda = prendaRepository.findById(id).orElse(null);
        if (prenda == null) {
            return null;
        }
        PrendaResponseDTO prendaResponseDTO = new PrendaResponseDTO();
        prendaResponseDTO.setId(prenda.getId());
        prendaResponseDTO.setDescripcion(prenda.getDescripcion());
        prendaResponseDTO.setValor(prenda.getValor());
        return prendaResponseDTO;
    }

    public Prenda savePrenda(PrendaDTO prendaDTO) {
        Prenda prenda = new Prenda();
        prenda.setDescripcion(prendaDTO.getDescripcion());
        prenda.setValor(prendaDTO.getValor());
        return prendaRepository.save(prenda);
    }

    public void deletePrenda(Long id) {
        prendaRepository.deleteById(id);
    }

}
