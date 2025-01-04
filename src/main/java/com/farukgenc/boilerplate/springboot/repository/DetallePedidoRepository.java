package com.farukgenc.boilerplate.springboot.repository;

import com.farukgenc.boilerplate.springboot.model.Concepto;
import com.farukgenc.boilerplate.springboot.model.DetallePedido;
import com.farukgenc.boilerplate.springboot.model.Estado;
import com.farukgenc.boilerplate.springboot.security.dto.PedidoResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Long> {
    public List<DetallePedido> findPedidosByEstadoActual_Estado(Estado estadoActual);

    public List<DetallePedido> findPedidosByUser_Id(Long id);
    List<DetallePedido> findPedidosByConcepto(Concepto concepto);
}
