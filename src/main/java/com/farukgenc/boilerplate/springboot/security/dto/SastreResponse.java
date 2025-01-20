package com.farukgenc.boilerplate.springboot.security.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SastreResponse {
    private Long id;
    private String username;
    private String email;
    private String cargo;
    private Long phone;
    private String name;
    private String lastname;
}
