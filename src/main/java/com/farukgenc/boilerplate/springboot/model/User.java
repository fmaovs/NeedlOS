package com.farukgenc.boilerplate.springboot.model;

import jakarta.persistence.*;
import lombok.*;

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

	private String name;

	private String lastname;

	@Column(unique = true)
	private String username;

	private String password;

	private String email;

	private Long phone;

	@Enumerated(EnumType.STRING)
	private UserRole userRole;

}
