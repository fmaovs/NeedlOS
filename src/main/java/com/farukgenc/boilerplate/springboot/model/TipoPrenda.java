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
    CONJUNTO_DAMA(17, "Conjunto Dama", 13000),/*REE*/
    ENTERIZO(18, "Enterizo", 7200),
    SUDADERA(19, "Sudadera", 13000),/*REE*/
    CHAL(20, "Chal", 6500),/*REE*/
    BUFANDA(21, "Bufanda", 5300),
    RUANA(22, "Ruana", 7700),
    BERMUDA(23, "Bermuda", 6500),
    GORRA(24, "Gorra", 7700),
    BOLSO_DAMA(25, "Bolso Dama", 13500),
    MORRAL(26, "Morral", 12000),
    OVEROL(27, "Overol", 11000),
    ALMOHADA(28, "Almohada", 8000),
    CUBRECAMA(29, "Cubrecama", 24000),/*REE*/
    DUVET(30, "Duvet", 13000),/*REE*/
    SABANA(31, "Sabana", 8000),/*REE*/
    FUNDA(32, "Funda", 3500),/*REE*/
    COBIJA(33, "Cobija", 20500),/*REE*/
    HAMACA(34, "Hamaca", 15000),/*REE*/
    COJIN(35, "Cojin", 8000),/*REE*/
    MANTEL(36, "Mantel", 15000),
    FALDON_PRENSADO(37, "Faldon Prensado", 25000),/*REE*/
    TOALLA(38, "Toalla", 6500),/*REE*/
    CORTINA(39, "Cortina", 5300),/*REE*/
    TAPETE(40, "Tapete", 12000),/*REE*/
    MUÑECO(41, "Muñeco", 70000),/*REE*/
    VESTIDO(42, "Vestido", 12000),
    TINTURA(43, "Tintura", 18500),/*REE*/
    FORROS_DE_CARRO(44, "Forros De Carro", 6500),/*REE*/
    BOXER(45, "Boxer", 3000),/*REE*/
    MEDIAS(46, "Medias", 3000),/*REE*/
    CAMA_DE_MASCOTA(47, "Cama De Mascota", 12000),/*REE*/
    FORRO_COJIN(48, "Forro Cojin", 6500),/*REE*/
    DELANTAL(49, "Delantal", 4000),
    LEVANTADORA(50, "Levantadora", 7000),/*REE*/
    BERMUDA_2(51, "Bermuda", 10000),/*REE*/
    SHORT(52, "Short", 6500),
    CHAQUETAS_DE_MOTO(53, "Chaquetas De Moto", 8500),/*REE*/
    PROTECTOR_DE_COLCHON(54, "Protector De Colchon", 18000),/*REE*/
    LICRA(55, "Licra", 15000),
    BOLSO(56, "Bolso", 9000),/*REE*/
    CORREA(57, "Correa", 6500),
    FORRO(58, "Forro", 10000),/*REE*/
    TRUZA(59, "Truza", 9000),/*REE*/
    VESTIDO_DE_BAÑO(60, "Vestido De Baño", 12000),
    BRASIER(61, "Brasier", 7000),
    CAMUFLADO(62, "Camuflado", 40000),/*REE*/
    EDREDON(63, "Edredon", 15000),/*REE*/
    CAPOTA(64, "Capota", 6000),/*REE*/
    TOP(65, "Top", 15000),
    ESQUELETO(66, "Esqueleto", 7000),
    ENAGUA(67, "Enagua", 12000),/*REE*/
    FAJA(68, "Faja", 15000),/*REE*/
    KIMONO(69, "Kimono", 18000),/*REE*/
    PANTALONETA(70, "Pantaloneta", 12000),/*REE*/
    BODY(71, "Body", 12000),/*REE*/
    GUANTES(72, "Guantes", 10000);

    TipoPrenda(int cod,
               String Prenda,
               int Valor) {
    }
}
