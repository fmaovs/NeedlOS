package com.farukgenc.boilerplate.springboot.service;

import com.farukgenc.boilerplate.springboot.model.CategoriaGasto;
import com.farukgenc.boilerplate.springboot.model.Gastos;
import com.farukgenc.boilerplate.springboot.model.User;
import com.farukgenc.boilerplate.springboot.repository.GastoRepository;
import com.farukgenc.boilerplate.springboot.repository.UserRepository;
import com.farukgenc.boilerplate.springboot.security.dto.GastosRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GastoService {

    @Autowired
    private GastoRepository gastoRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Gastos nuevoGasto(GastosRequest gastosRequest) {
        User empleado = userRepository.findById(gastosRequest.getEmpleadoId())
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        Gastos gastos = new Gastos();
        gastos.setDescripcion(gastosRequest.getDescripcion());
        gastos.setMonto(gastosRequest.getMonto());
        gastos.setFecha(gastosRequest.getFecha());
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
                        gasto.getIdGasto()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public Double obtenervalorTotalDia(LocalDate fecha){
        return gastoRepository.findByfecha(fecha)
                .stream()
                .mapToDouble(Gastos::getMonto)
                .sum();
    }

    @Transactional
    public List<GastosRequest> obtenerDetallesGastosDia(LocalDate fecha){
        List<Gastos> gastos = gastoRepository.findByfecha(fecha);

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

    @Transactional
    public Double obtenervalorTotalEnRango(LocalDate fechaInicio, LocalDate fechaFin){
        return gastoRepository.findByfechaBetween(fechaInicio, fechaFin)
                                .stream()
                                .mapToDouble(Gastos::getMonto)
                                .sum();
    }

    @Transactional
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

    @Transactional
    public double obtenerTotalGastosPorCategoriaYRango(CategoriaGasto categoria, LocalDate fechaInicio, LocalDate FechaFin){
        List<Gastos> gastos = gastoRepository.findByCategoriaAndFechaBetween( categoria,  fechaInicio,  FechaFin);
        return gastos.stream().mapToDouble(Gastos::getMonto).sum();
    }


    @Transactional
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



}
