package com.farukgenc.boilerplate.springboot.service;

import com.farukgenc.boilerplate.springboot.model.Ingreso;

import com.farukgenc.boilerplate.springboot.repository.IngresoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IngresoService {

    @Autowired
    private IngresoRepository ingresoRepository;

    public Ingreso nuevoIngreso(Ingreso ingreso){
        return ingresoRepository.save(ingreso);
    }

    public List<Ingreso> obtenerIngresos(){
        return ingresoRepository.findAll();
    }
}
