package com.farukgenc.boilerplate.springboot.service;

import com.farukgenc.boilerplate.springboot.model.*;
import com.farukgenc.boilerplate.springboot.model.llavesCompuestas.MaterialIngresadoId;
import com.farukgenc.boilerplate.springboot.model.llavesCompuestas.MaterialUsadoId;
import com.farukgenc.boilerplate.springboot.repository.*;
import com.farukgenc.boilerplate.springboot.security.dto.MaterialIngresadoRequest;
import com.farukgenc.boilerplate.springboot.security.dto.MaterialUsadoRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MaterialInventarioService {
    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private MaterialIngresadoRepository materialIngresadoRepository;

    @Autowired
    private MaterialUsadoRepository materialUsadoRepository;

    @Autowired
    private PrendaRepository prendaRepository;

    @Autowired
    private IngresoRepository ingresoRepository;

    //para agregar un nuevo material a la bd
    public Material nuevomaterial(Material material){
        return materialRepository.save(material);
    }

    //para agregar cantidad al invetario
    @Transactional
    public void ingresaMaterial(MaterialIngresadoRequest request){
        Material material = materialRepository.findById(request.getId_material())
                .orElseThrow(()-> new RuntimeException("no encontrado, verifique nuevamente o primero cree el material "));
        Ingreso ingreso = ingresoRepository.findById(request.getId_ingreso())
                .orElseThrow(()-> new RuntimeException("no hay ingreso de este material"));

        material.setStock_actual(material.getStock_actual() + request.getCantidad_ingresada());
        materialRepository.save(material);

        MaterialIngresadoId materialIngresadoId = new MaterialIngresadoId(request.getId_material(), request.getId_ingreso());
        MaterialIngresado materialIngresado = new MaterialIngresado(materialIngresadoId, request.getPrecio(), request.getCantidad_ingresada(), LocalDateTime.now(), material, ingreso);
        materialIngresadoRepository.save(materialIngresado);

    }

    // para restar al inventario
    @Transactional
    public void usarMaterial(MaterialUsadoRequest request ) {
        Material material = materialRepository.findById(request.getId_material())
                .orElseThrow(() -> new RuntimeException("Material no encontrado"));
        Prenda prenda = prendaRepository.findById(request.getId_prenda())
                .orElseThrow(() -> new RuntimeException("Prenda no encontrada"));
        if (material.getStock_actual() < request.getCantidad_usada()) {
            throw new RuntimeException("Stock insuficiente");
        }
        material.setStock_actual(material.getStock_actual() - request.getCantidad_usada());
        materialRepository.save(material);

        MaterialUsadoId materialUsadoId = new MaterialUsadoId(request.getId_prenda(), Long.valueOf(request.getId_material()));
        MaterialUsado materialUsado = new MaterialUsado(materialUsadoId, request.getCantidad_usada(),LocalDateTime.now(), prenda, material );
        materialUsadoRepository.save(materialUsado);

    }

    // ver todos los materiales
    public List<Material> inventarioActual(){
        return materialRepository.findAll();
    }

    public Optional<Material> getMaterialById(Long id) {
        return materialRepository.findById(id);
    }

    public List<Material> obtenerMaterialesBajaCantidad() {
        return materialRepository.findByCantidadBaja(5);
    }
}
