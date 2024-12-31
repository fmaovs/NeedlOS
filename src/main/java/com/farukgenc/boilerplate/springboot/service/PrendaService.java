package com.farukgenc.boilerplate.springboot.service;

import com.farukgenc.boilerplate.springboot.model.Prenda;
import com.farukgenc.boilerplate.springboot.repository.PrendaRepository;
import com.farukgenc.boilerplate.springboot.security.dto.PrendaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PrendaService {
    @Autowired
    private PrendaRepository prendaRepository;

    public List<PrendaDTO> getAllPrendas() {
        List<PrendaDTO> prendaDTOList = new ArrayList<>();
        for (Prenda prenda : prendaRepository.findAll()) {
            PrendaDTO prendaDTO = new PrendaDTO();
            prendaDTO.setDescripcion(prenda.getDescripcion());
            prendaDTO.setValor(prenda.getValor());
            prendaDTOList.add(prendaDTO);
        }
        return prendaDTOList;
    }

    public PrendaDTO getPrendaById(Long id) {
        Prenda prenda = prendaRepository.findById(id).orElse(null);
        if (prenda == null) {
            return null;
        }
        PrendaDTO prendaDTO = new PrendaDTO();
        prendaDTO.setDescripcion(prenda.getDescripcion());
        prendaDTO.setValor(prenda.getValor());
        return prendaDTO;
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
