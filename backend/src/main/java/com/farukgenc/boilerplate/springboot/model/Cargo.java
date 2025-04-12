package com.farukgenc.boilerplate.springboot.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.Data;
import lombok.Getter;

@Getter
public enum Cargo {
    ADMIN, SASTRE;

    public String getCargoName() {
        return this.name();
    }

    @JsonCreator
    public static Cargo fromValue(String value) {
        return Cargo.valueOf(value.toUpperCase());
    }
}
