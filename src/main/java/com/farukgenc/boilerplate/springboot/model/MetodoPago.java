package com.farukgenc.boilerplate.springboot.model;


import com.fasterxml.jackson.annotation.JsonCreator;

public enum MetodoPago {
    EFECTIVO, NEQUI, DAVIPLATA, BANCOLOMBIA;

    @JsonCreator
    public static MetodoPago fromValue(String value) {
        return MetodoPago.valueOf(value.toUpperCase());
    }
}
