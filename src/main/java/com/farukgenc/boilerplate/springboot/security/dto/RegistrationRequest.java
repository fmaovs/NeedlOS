package com.farukgenc.boilerplate.springboot.security.dto;

import com.farukgenc.boilerplate.springboot.model.Cargo;
import com.farukgenc.boilerplate.springboot.model.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@ToString
@NoArgsConstructor
public class RegistrationRequest {

	@NotEmpty(message = "{registration_name_not_empty}")
	private String name;

	@NotEmpty(message = "{registration_lastname_not_empty}")
	private String lastname;

	@Email(message = "{registration_email_is_not_valid}")
	@NotEmpty(message = "{registration_email_not_empty}")
	private String email;

	@NotNull(message = "{registration_phone_not_empty}")
	private Long phone;

	@NotEmpty(message = "{registration_username_not_empty}")
	private String username;

	@NotEmpty(message = "{registration_password_not_empty}")
	private String password;

	@NotNull(message = "{registration_user_role_not_null}")
	private UserRole user_role;

	@NotNull(message = "{registration_cargo_not_null}")
	private Cargo cargo;

}
