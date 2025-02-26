package com.farukgenc.boilerplate.springboot.repository;

import com.farukgenc.boilerplate.springboot.model.Estado;
import com.farukgenc.boilerplate.springboot.model.Pedido;
import com.farukgenc.boilerplate.springboot.security.dto.PedidoResponse;
import org.springframework.cglib.core.Local;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findPedidosByCustomer_Phone(Long phone);
    List<Pedido> findByDetalles_EstadoActual_Estado(Estado estado);
    List<Pedido> findPedidosByDetalles_User_Name(String name);

    List<Pedido> findPedidosByDateBetween(Date fechaInicio, Date fechaFin);

    List<Pedido> findPedidosByDateBetweenAndDetalles_EstadoActual_Estado(LocalDateTime date1, LocalDateTime date2, Estado estado);
}
