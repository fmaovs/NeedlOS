package com.farukgenc.boilerplate.springboot.security.service;

import com.farukgenc.boilerplate.springboot.model.Cargo;
import com.farukgenc.boilerplate.springboot.security.dto.*;
import com.farukgenc.boilerplate.springboot.security.jwt.JwtTokenManager;
import com.farukgenc.boilerplate.springboot.service.UserValidationService;
import com.farukgenc.boilerplate.springboot.model.User;
import com.farukgenc.boilerplate.springboot.model.UserRole;
import com.farukgenc.boilerplate.springboot.security.mapper.UserMapper;
import com.farukgenc.boilerplate.springboot.utils.GeneralMessageAccessor;
import com.farukgenc.boilerplate.springboot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private static final String REGISTRATION_SUCCESSFUL = "registration_successful";

	private final UserRepository userRepository;

	private final BCryptPasswordEncoder bCryptPasswordEncoder;

	private final UserValidationService userValidationService;

	private final GeneralMessageAccessor generalMessageAccessor;

	private final EmailService emailService;

	private final JwtTokenManager jwtTokenManager;

	@Override
	public User findByUsername(String username) {

		return userRepository.findByUsername(username);
	}

	@Override
	public User findById(Long id) {
        User user = userRepository.findUserById(id);
        System.out.println("el id es ="+user.getId());
        return user;
	}

	@Override
	public RegistrationResponse registration(RegistrationRequest registrationRequest) {

		userValidationService.validateUser(registrationRequest);

		final User user = UserMapper.INSTANCE.convertToUser(registrationRequest);
		user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
		user.setUserRole(registrationRequest.getUser_role());
		user.setCargo(Cargo.valueOf(String.valueOf(registrationRequest.getCargo())));
		user.setEstado(true);
		userRepository.save(user);

		final String username = registrationRequest.getUsername();
		final String registrationSuccessMessage = generalMessageAccessor.getMessage(null, REGISTRATION_SUCCESSFUL, username);

		log.info("{} registered successfully!", username);

		//Enviar correo con la información del registro
		String email = user.getEmail();
		String token = jwtTokenManager.generatePasswordResetToken(email);
		String changeLink = "http://localhost:3000/reset-password?token=" + token;
		emailService.send(email, "Cambio de contraseña por primera vez:\n",
					"Usuario: " + user.getUsername() + "\n" +
							"Contraseña: " + registrationRequest.getPassword() + "\n" +
				"Haz clic en el siguiente enlace para cambiar tu contraseña:\n" + changeLink);

		return new RegistrationResponse(registrationSuccessMessage);
	}

	@Override
	public AuthenticatedUserDto findAuthenticatedUserByUsername(String username) {

		final User user = findByUsername(username);

		return UserMapper.INSTANCE.convertToAuthenticatedUserDto(user);
	}

	public List<SastreResponse> findAll() {
		List<User> users = userRepository.findAll();
		List<SastreResponse> usersResponse = new ArrayList<>();
		for (User user : users) {
			SastreResponse userResponse = new SastreResponse();
			userResponse.setId(user.getId());
			userResponse.setUsername(user.getUsername());
			userResponse.setEmail(user.getEmail());
			userResponse.setCargo(user.getCargo().getCargoName());
			userResponse.setPhone(user.getPhone());
			userResponse.setName(user.getName());
			userResponse.setLastname(user.getLastname());
			userResponse.setEstado(user.isEstado());
			usersResponse.add(userResponse);
		}
		return usersResponse;
	}

	public List<UserResponse> findAllByCargo(Cargo cargo){
		List<UserResponse> users = new ArrayList<>();
		for(User user : userRepository.findAllByCargo(cargo)){
			UserResponse userTemporal = new UserResponse();
			userTemporal.setId(user.getId());
			userTemporal.setUsername(user.getUsername());
			userTemporal.setEmail(user.getEmail());
			userTemporal.setCargo(user.getCargo().getCargoName());
			userTemporal.setRol(String.valueOf(user.getUserRole()));
			userTemporal.setPhone(user.getPhone());
			userTemporal.setName(user.getName());
			userTemporal.setLastname(user.getLastname());
			userTemporal.setEstado(user.isEstado());
			users.add(userTemporal);
		}
		return users;
	};

	public User updateUser(Long id, UserDTO user) {
		User userToUpdate = userRepository.findUserById(id);
		if (userToUpdate != null) {
			// Actualizar solo los campos no nulos
			if (user.getName() != null && !user.getName().isEmpty()) {
				userToUpdate.setName(user.getName());
			}
			if (user.getLastname() != null && !user.getLastname().isEmpty()) {
				userToUpdate.setLastname(user.getLastname());
			}
			// Validar el email
			if (user.getEmail() != null && !user.getEmail().isEmpty()) {
				for (User user1 : userRepository.findAll()) {
					if (user1.getEmail().equals(user.getEmail()) && !user1.getId().equals(id)) {
						return null;
					}
				}
				userToUpdate.setEmail(user.getEmail());
			}
			// Validar el teléfono (tipo Long)
			if (user.getPhone() != null) {
				for (User user1 : userRepository.findAll()) {
					if (user1.getPhone().equals(user.getPhone()) && !user1.getId().equals(id)) {
						return null;
					}
				}
				userToUpdate.setPhone(user.getPhone());
			}
			// Actualizar el cargo
			if (user.getCargo() != null && !user.getCargo().isEmpty()) {
				String cargo = user.getCargo().toUpperCase();
				userToUpdate.setCargo(Cargo.valueOf(cargo));
			}
			// Actualizar el rol del usuario
			if (user.getUser_role() != null && !user.getUser_role().isEmpty()) {
				String userRole = user.getUser_role().toUpperCase();
				userToUpdate.setUserRole(UserRole.valueOf(userRole));
			}
			// Si no se proporciona el rol, mantener el actual
			else {
				User userActual = userRepository.findById(id).orElse(null);
				if (userActual != null) {
					userToUpdate.setUserRole(UserRole.valueOf(userActual.getUserRole().toString()));
				}
			}
			// Validar el username
			if (user.getUsername() != null && !user.getUsername().isEmpty()) {
				for (User user1 : userRepository.findAll()) {
					if (user1.getUsername().equals(user.getUsername()) && !user1.getId().equals(id)) {
						return null;
					}
				}
				userToUpdate.setUsername(user.getUsername());
			}
			// Guardar los cambios
			userRepository.save(userToUpdate);
		}
		return userToUpdate;
	}

	public Long findIdByNombre(String nombre) {
		List<User> users = userRepository.findAll();
		Long id = null;
		for (User user : users) {
			if (user.getName().equals(nombre)) {
				id = user.getId();
			}
		}
		return id;
	}

	public void updatePassword(Long id, String contrasena) {
		User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
		System.out.println("Contraseña: " + contrasena);
		System.out.println("User: " + user.getName());
		user.setPassword(bCryptPasswordEncoder.encode(contrasena));
		userRepository.save(user);
		System.out.println(user.getPassword());
	}


	public UserResponse convertUsertoUserResponse(Long id) {
		User user = userRepository.findById(id).orElse(null);
		if (user == null) {
			return null;
		}
		UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
		userResponse.setUsername(user.getUsername());
		userResponse.setEmail(user.getEmail());
		userResponse.setCargo(user.getCargo().getCargoName());
		userResponse.setRol(user.getUserRole().toString());
		userResponse.setPhone(user.getPhone());
		userResponse.setName(user.getName());
		userResponse.setLastname(user.getLastname());
		userResponse.setEstado(user.isEstado());
		return userResponse;
	}

	public String getEmailByUsername(String username){
		return userRepository.findByUsername(username).getEmail();
	}

	public Optional<User> findByEmail(String email){
		return Optional.ofNullable(userRepository.findByEmail(email));
	}

	public UserResponse cambioEstado(Long id, Boolean estado) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

		user.setEstado(estado);
		userRepository.save(user);

		UserResponse userResponse = new UserResponse();
		userResponse.setId(user.getId());
		userResponse.setUsername(user.getUsername());
		userResponse.setEmail(user.getEmail());
		userResponse.setCargo(user.getCargo().getCargoName());
		userResponse.setRol(user.getUserRole().toString());
		userResponse.setPhone(user.getPhone());
		userResponse.setName(user.getName());
		userResponse.setLastname(user.getLastname());
		userResponse.setEstado(user.isEstado());
		return userResponse;
	}

}
