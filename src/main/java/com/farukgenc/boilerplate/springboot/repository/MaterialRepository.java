package com.farukgenc.boilerplate.springboot.repository;

import com.farukgenc.boilerplate.springboot.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
}
