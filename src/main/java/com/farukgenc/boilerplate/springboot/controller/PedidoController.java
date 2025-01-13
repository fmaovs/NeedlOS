package com.farukgenc.boilerplate.springboot.controller;

import com.farukgenc.boilerplate.springboot.security.dto.PedidoDTO;
import com.farukgenc.boilerplate.springboot.security.dto.PedidoResponse;
import com.farukgenc.boilerplate.springboot.service.PedidoService;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*")
public class PedidoController {
    @Autowired
    private PedidoService pedidoService;

    @GetMapping("/all")
    public ResponseEntity<List<PedidoResponse>> getOrders() {
        return ResponseEntity.ok(pedidoService.findAll());
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<PedidoResponse>> getOrdersByEstado(@PathVariable String estado) {
        return ResponseEntity.ok(pedidoService.findAllByEstado(estado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<PedidoResponse>> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.findById(id));
    }

    @PostMapping
    public ResponseEntity<String> createOrder(@RequestBody PedidoDTO pedidoDTO) {
        try {
            pedidoService.createPedido(pedidoDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body("Pedido creado correctamente");
        } catch (Exception e) {
            // Imprime el error en la consola para depuración
            e.printStackTrace();

            // Respuesta detallada para identificar el problema
            String errorMessage = "Error al crear el pedido: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
        }
    }

    @PostMapping("/{id}/upload-photo-recogida")
    public ResponseEntity<String> uploadPhoto(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            pedidoService.saveFotoRecogida(id, file);
            return ResponseEntity.ok("Foto cargada exitosamente");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al cargar la foto: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/upload-photo-entrega")
    public ResponseEntity<String> uploadPhotoEntrega(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            pedidoService.saveFotoEntrega(id, file);
            return ResponseEntity.ok("Foto cargada exitosamente");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al cargar la foto: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/download-photo-recogida")
    public ResponseEntity<UrlResource> downloadPhotoRecogida(@PathVariable Long id) {
        try {
            // Obtener el archivo desde el servicio
            File fotoRecogida = pedidoService.getFotoRecogida(id);

            // Crear un recurso desde el archivo
            Path path = fotoRecogida.toPath();
            UrlResource resource = new UrlResource(path.toUri());

            // Validar si el recurso es legible
            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("No se pudo leer la imagen: " + fotoRecogida.getName());
            }

            // Determinar el tipo de contenido (por ejemplo, image/png)
            String contentType = Files.probeContentType(path);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            // Construir y devolver la respuesta
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fotoRecogida.getName() + "\"")
                    .body(resource);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }


    @GetMapping("/{id}/download-photo-entrega")
    public ResponseEntity<UrlResource> downloadPhotoEntrega(@PathVariable Long id) {
        try {
            // Obtener el archivo desde el servicio
            File fotoEntrega = pedidoService.getFotoEntrega(id);

            // Crear un recurso desde el archivo
            Path path = fotoEntrega.toPath();
            UrlResource resource = new UrlResource(path.toUri());

            // Validar si el recurso es legible
            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("No se pudo leer la imagen: " + fotoEntrega.getName());
            }

            // Determinar el tipo de contenido (por ejemplo, image/png)
            String contentType = Files.probeContentType(path);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            // Construir y devolver la respuesta
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fotoEntrega.getName() + "\"")
                    .body(resource);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }


    @GetMapping("/concepto/{concepto}")
    public ResponseEntity<List<PedidoResponse>> getOrdersByConcepto(@PathVariable String concepto) {
        return ResponseEntity.ok(pedidoService.findPedidosByConcepto(concepto));
    }

    @GetMapping("/customer/{customer}")
    public ResponseEntity<List<PedidoResponse>> getOrdersByCustomer(@PathVariable String customer) {
        return ResponseEntity.ok(pedidoService.findAllByCustomer(customer));
    }

}
