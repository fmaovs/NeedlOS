package com.farukgenc.boilerplate.springboot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ArqueoService {

    @Autowired
    private PedidoService pedidoService;
}
