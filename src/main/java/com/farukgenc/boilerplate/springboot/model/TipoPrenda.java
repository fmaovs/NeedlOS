package com.farukgenc.boilerplate.springboot.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
public enum TipoPrenda {
    CAMISA(1, "Camisa", 18000),
    CAMISETA(2, "Camiseta", 12000),
    PANTALON(3, "Pantalon", 12000),
    JEANS(4, "Jeans", 12000),
    SACO(5, "Saco", 15000),
    CORBATA(6, "Corbata", 4200),
    CHAQUETA(7, "Chaqueta", 15000),
    GABAN(8, "Gaban", 9500),
    ABRIGO(9, "Abrigo", 9500),
    SUETER(10, "Sueter", 6500),
    BUSO(11, "Buso", 6500),
    CHALECO(12, "Chaleco", 6500),
    BLUSA(13, "Blusa", 6500),
    FALDA(14, "Falda", 7500),
    JARDINERA(15, "Jardinera", 7500),
    BATA(16, "Bata", 7500),
    CONJUNTO_DAMA(17, "Conjunto Dama", 13000),
    ENTERIZO(18, "Enterizo", 7200),
    SUDADERA(19, "Sudadera", 13000),
    CHAL(20, "Chal", 6500),
    BUFANDA(21, "Bufanda", 5300),
    RUANA(22, "Ruana", 7700),
    BERMUDA(23, "Bermuda", 6500),
    GORRA(24, "Gorra", 7700),
    BOLSO(25, "Bolso Dama", 13500),
    MORRAL(26, "Morral", 12000),
    OVEROL(27, "Overol", 11000),
    ALMOHADA(28, "Almohada", 8000),
    CUBRECAMA(29, "Cubrecama", 24000),
    DUVET(30, "Duvet", 13000),
    SABANA(31, "Sabana", 8000),
    COBIJA(33, "Cobija", 20500),
    HAMACA(34, "Hamaca", 15000),
    COJIN(35, "Cojin", 8000),
    MANTEL(36, "Mantel", 15000),
    TOALLA(38, "Toalla", 6500),
    CORTINA(39, "Cortina", 5300),
    TAPETE(40, "Tapete", 12000),
    MUÑECO(41, "Muñeco", 70000),
    VESTIDO(42, "Vestido", 12000),
    FORROS_DE_CARRO(44, "Forros De Carro", 6500),
    BOXER(45, "Boxer", 3000),
    MEDIAS(46, "Medias", 3000),
    CAMA_DE_MASCOTA(47, "Cama De Mascota", 12000),
    FORRO_COJIN(48, "Forro Cojin", 6500),
    DELANTAL(49, "Delantal", 4000),
    LEVANTADORA(50, "Levantadora", 7000),
    SHORT(52, "Short", 6500),
    PROTECTOR_DE_COLCHON(54, "Protector De Colchon", 18000),
    LICRA(55, "Licra", 15000),
    CORREA(57, "Correa", 6500),
    VESTIDO_DE_BAÑO(60, "Vestido De Baño", 12000),
    BRASIER(61, "Brasier", 7000),
    TOP(65, "Top", 15000),
    ESQUELETO(66, "Esqueleto", 7000),
    FAJA(68, "Faja", 15000),
    KIMONO(69, "Kimono", 18000),
    PANTALONETA(70, "Pantaloneta", 12000),
    GUANTES(72, "Guantes", 10000);

    TipoPrenda(int cod,
               String Prenda,
               int Valor) {
    }
}
