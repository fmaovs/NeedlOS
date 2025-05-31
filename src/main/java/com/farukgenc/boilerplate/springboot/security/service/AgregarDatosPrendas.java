package com.farukgenc.boilerplate.springboot.security.service;

import com.farukgenc.boilerplate.springboot.model.Prenda;
import com.farukgenc.boilerplate.springboot.repository.PrendaRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Data
public class AgregarDatosPrendas implements CommandLineRunner {

    @Autowired
    private PrendaRepository prendaRepository;

    public void run(String... args) {
        if (prendaRepository.count() == 0) {
            List<Prenda> prendas = List.of(
                    new Prenda(null, "camisa", 18000.0, null),
                    new Prenda(null, "camiseta", 12000.0, null),
                    new Prenda(null, "pantalon", 12000.0, null),
                    new Prenda(null, "jeans", 12000.0, null),
                    new Prenda(null, "saco", 15000.0, null),
                    new Prenda(null, "corbata", 4200.0, null),
                    new Prenda(null, "chaqueta", 15000.0, null),
                    new Prenda(null, "gaban", 9500.0, null),
                    new Prenda(null, "abrigo", 9500.0, null),
                    new Prenda(null, "sueter", 6500.0, null),
                    new Prenda(null, "buso", 6500.0, null),
                    new Prenda(null, "chaleco", 6500.0, null),
                    new Prenda(null, "blusa", 6500.0, null),
                    new Prenda(null, "falda", 7500.0, null),
                    new Prenda(null, "jardinera", 7500.0, null),
                    new Prenda(null, "bata", 7500.0, null),
                    new Prenda(null, "enterizo", 7200.0, null),
                    new Prenda(null, "sudadera", 13000.0, null),
                    new Prenda(null, "chal", 6500.0, null),
                    new Prenda(null, "bufanda", 5300.0, null),
                    new Prenda(null, "ruana", 7700.0, null),
                    new Prenda(null, "bermuda", 6500.0, null),
                    new Prenda(null, "gorra", 7700.0, null),
                    new Prenda(null, "bolso", 13500.0, null),
                    new Prenda(null, "morral", 12000.0, null),
                    new Prenda(null, "overol", 11000.0, null),
                    new Prenda(null, "almohada", 8000.0, null),
                    new Prenda(null, "cubrecama", 24000.0, null),
                    new Prenda(null, "sabana", 8000.0, null),
                    new Prenda(null, "cobija", 20500.0, null),
                    new Prenda(null, "hamaca", 15000.0, null),
                    new Prenda(null, "cojin", 8000.0, null),
                    new Prenda(null, "mantel", 15000.0, null),
                    new Prenda(null, "toalla", 6500.0, null),
                    new Prenda(null, "cortina", 5300.0, null),
                    new Prenda(null, "muñeco", 70000.0, null),
                    new Prenda(null, "vestido", 12000.0, null),
                    new Prenda(null, "boxer", 3000.0, null),
                    new Prenda(null, "cama de mascota", 12000.0, null),
                    new Prenda(null, "forro cojin", 6500.0, null),
                    new Prenda(null, "delantal", 4000.0, null),
                    new Prenda(null, "levantadora", 7000.0, null),
                    new Prenda(null, "bermuda", 10000.0, null),
                    new Prenda(null, "short", 6500.0, null),
                    new Prenda(null, "vestido de baño", 12000.0, null),
                    new Prenda(null, "brasier", 7000.0, null),
                    new Prenda(null, "top", 15000.0, null),
                    new Prenda(null, "faja", 15000.0, null),
                    new Prenda(null, "kimono", 18000.0, null),
                    new Prenda(null, "pantaloneta", 12000.0, null),
                    new Prenda(null, "guantes", 10000.0, null)
            );
            prendaRepository.saveAll(prendas);
            System.out.println("datos insertados en la base de datos.");
        } else {
            System.out.println("prendas ya existentes");
        }
    }

}