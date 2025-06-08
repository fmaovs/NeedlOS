package com.farukgenc.boilerplate.springboot.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "USERS")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "el campo no puede estar vacio")
	@Size(min = 3, max = 20)
	@Column(nullable = false, length = 20)
	private String name;

	@NotBlank(message = "el campo no puede estar vacio")
	@Size(min = 3, max = 20)
	@Column(nullable = false, length = 20)
	private String lastname;

	@NotBlank(message = "el campo no puede estar vacio")
	@Size(min = 5, max = 20)
	@Column(unique = true, length = 20)
	private String username;

	@NotBlank(message = "el campo no puede estar vacio")
	@Size(min=8)
	@Column(nullable = false)
	private String password;

	@NotBlank(message = "el campo no puede estar vacio")
	@Email(message = "verificar que lo ingresado sea un correo")
	@Size(max=100, message = "el correo no puede ser tan largo")
	@Column(nullable = false, length = 100,unique = true)
	private String email;

	@NotNull(message = "El numero de teléfono es obligatorio")
	@Digits(integer = 10, fraction = 0, message = "El teléfono debe tener hasta 10 digitos y solo numeros")
	@Column(nullable = false, length = 10)
	private Long phone;

	@NotNull(message = "el campo no puede estar vacio")
	@Enumerated(EnumType.STRING)
	private UserRole userRole;

	@NotNull(message = "el campo no puede estar vacio")
	@Enumerated(EnumType.STRING)
	private Cargo cargo;

	@NotNull(message = "el campo no puede estar vacio")
	@Column(nullable = false)
	private boolean estado = true;

	@OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	private List<DetallePedido> detallePedido;

	@OneToMany(mappedBy = "empleado", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	private List<Gastos> gastos;

}
