package com.farukgenc.boilerplate.springboot.repository;

import com.farukgenc.boilerplate.springboot.model.MaterialIngresado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialIngresadoRepository extends JpaRepository<MaterialIngresado, Long> {
}
