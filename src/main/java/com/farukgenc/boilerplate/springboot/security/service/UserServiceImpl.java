package com.farukgenc.boilerplate.springboot.security.service;

import com.farukgenc.boilerplate.springboot.model.Cargo;
import com.farukgenc.boilerplate.springboot.security.dto.*;
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


@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private static final String REGISTRATION_SUCCESSFUL = "registration_successful";

	private final UserRepository userRepository;

	private final BCryptPasswordEncoder bCryptPasswordEncoder;

	private final UserValidationService userValidationService;

	private final GeneralMessageAccessor generalMessageAccessor;

	@Override
	public User findByUsername(String username) {

		return userRepository.findByUsername(username);
	}

	@Override
	public User findById(Long id) {
		return userRepository.findById(id).orElse(null);
	}

	@Override
	public RegistrationResponse registration(RegistrationRequest registrationRequest) {

		userValidationService.validateUser(registrationRequest);

		final User user = UserMapper.INSTANCE.convertToUser(registrationRequest);
		user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
		user.setUserRole(registrationRequest.getUser_role());
		user.setCargo(Cargo.valueOf(String.valueOf(registrationRequest.getCargo())));
		userRepository.save(user);

		final String username = registrationRequest.getUsername();
		final String registrationSuccessMessage = generalMessageAccessor.getMessage(null, REGISTRATION_SUCCESSFUL, username);

		log.info("{} registered successfully!", username);

		return new RegistrationResponse(registrationSuccessMessage);
	}

	@Override
	public AuthenticatedUserDto findAuthenticatedUserByUsername(String username) {

		final User user = findByUsername(username);

		return UserMapper.INSTANCE.convertToAuthenticatedUserDto(user);
	}

	public Iterable<User> findAll() {
		return userRepository.findAll();
	}

	public List<UserResponse> findAllByCargo(Cargo cargo){
		List<UserResponse> users = new ArrayList<>();
		for(User user : userRepository.findAllByCargo(cargo)){
			UserResponse userTemporal = new UserResponse();
			userTemporal.setUsername(user.getUsername());
			userTemporal.setEmail(user.getEmail());
			userTemporal.setCargo(user.getCargo().getCargoName());
			userTemporal.setPhone(user.getPhone());
			userTemporal.setName(user.getName());
			userTemporal.setLastname(user.getLastname());
			users.add(userTemporal);
		}
		return users;
	};

	public User updateUser(Long id, UserDTO user) {
		User userToUpdate = userRepository.findById(id).orElse(null);
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


}
