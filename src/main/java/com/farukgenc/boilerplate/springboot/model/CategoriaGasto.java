package com.farukgenc.boilerplate.springboot.model;

import lombok.Getter;

@Getter
public enum CategoriaGasto {
    ARRIENDO,
    AGUA,
    LUZ,
    GAS,
    TELEFONO,
    INTERNET,
    NOMINA,
    GASOLINA,
    PLASTICOS,
    GANCHOS,
    PAPELERIA,
    BOLSAS,

    //SE AGREGAN A LOS QUE YA TENIAN PREDETERMINADOS
    MATERIAL,
    MANTENIMIENTO,
    VALE
}
