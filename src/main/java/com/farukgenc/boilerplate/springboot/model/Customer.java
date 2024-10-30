package com.farukgenc.boilerplate.springboot.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "clientes")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String lastname;

    @Column(nullable = false)
    private Date fecha_registro;
}
