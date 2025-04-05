package com.farukgenc.boilerplate.springboot.repository;

import com.farukgenc.boilerplate.springboot.model.CategoriaGasto;
import com.farukgenc.boilerplate.springboot.model.Gastos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface GastoRepository extends JpaRepository<Gastos, Long> {

    List<Gastos> findByfechaBetween(LocalDate fechaInicio, LocalDate fechaFin);

    List<Gastos> findByfecha(LocalDate fecha);

    List<Gastos> findByEmpleado_IdAndFechaBetweenAndCategoria(Long id, LocalDate fechaInicio, LocalDate fechaFin, CategoriaGasto categoria);

    List<Gastos> findByCategoriaAndFechaBetween(CategoriaGasto categoria, LocalDate fechaInicio, LocalDate fechaFin);

    Optional<Gastos> findById(Long id);
}
