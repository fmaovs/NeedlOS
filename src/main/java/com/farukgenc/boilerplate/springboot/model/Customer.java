package com.farukgenc.boilerplate.springboot.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Entity
@Table(name = "clientes")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_Customer")
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 3, max = 20, message = "El nombre no debe ser menor a tres caracteres y no superior a 20")
    @Pattern(regexp = "^[A-Za-záéíóúÁÉÍÓÚñÑ ]+$", message = "Solo se permiten letras y espacios")
    @Column(nullable = false ,length = 20)
    private String name;

    @NotBlank(message = "El apellido es obligatorio")
    @Size(min = 3, max = 20, message = "El apellido no debe ser menor a tres caracteres y no superior a 20")
    @Pattern(regexp = "^[A-Za-záéíóúÁÉÍÓÚñÑ ]+$", message = "Solo se permiten letras y espacios")
    @Column(nullable = false,length = 20)
    private String lastname;

    @NotNull(message = "El numero de teléfono es obligatorio")
    @Digits(integer = 10, fraction = 0, message = "El teléfono debe tener hasta 10 digitos y solo numeros")
    @Column(nullable = false, length = 10)
    private Long phone;

    @NotNull(message = "la fecha es obligatoria")
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    @Column(name = "fecha_registro", nullable = false)
    private Date fecha_registro;
}
