package com.farukgenc.boilerplate.springboot.repository;

import com.farukgenc.boilerplate.springboot.model.Abono;
import com.farukgenc.boilerplate.springboot.model.MetodoPago;
import com.farukgenc.boilerplate.springboot.security.dto.AbonoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Repository
public interface AbonoRepository extends JpaRepository<Abono, Long> {


    @Query("SELECT a FROM Abono a WHERE a.fecha BETWEEN :start AND :end")
    List<Abono> findByFechaBetween(@Param("start") Date start, @Param("end") Date end);
    List<Abono> findByFechaBetweenAndMetodoPago(Date start, Date end, MetodoPago metodoPago);

    Abono findByPedido_Id(Long idPedido);

}
