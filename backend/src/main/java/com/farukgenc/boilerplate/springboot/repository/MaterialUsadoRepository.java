package com.farukgenc.boilerplate.springboot.repository;

import com.farukgenc.boilerplate.springboot.model.MaterialUsado;
import com.farukgenc.boilerplate.springboot.model.llavesCompuestas.MaterialUsadoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialUsadoRepository extends JpaRepository<MaterialUsado, MaterialUsadoId> {
}