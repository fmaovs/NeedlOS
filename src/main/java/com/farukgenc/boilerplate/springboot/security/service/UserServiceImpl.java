package com.farukgenc.boilerplate.springboot.security.service;

import com.farukgenc.boilerplate.springboot.model.Cargo;
import com.farukgenc.boilerplate.springboot.security.dto.UserResponse;
import com.farukgenc.boilerplate.springboot.service.UserValidationService;
import com.farukgenc.boilerplate.springboot.model.User;
import com.farukgenc.boilerplate.springboot.model.UserRole;
import com.farukgenc.boilerplate.springboot.security.dto.AuthenticatedUserDto;
import com.farukgenc.boilerplate.springboot.security.dto.RegistrationRequest;
import com.farukgenc.boilerplate.springboot.security.dto.RegistrationResponse;
import com.farukgenc.boilerplate.springboot.security.mapper.UserMapper;
import com.farukgenc.boilerplate.springboot.utils.GeneralMessageAccessor;
import com.farukgenc.boilerplate.springboot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Created on Ağustos, 2020
 *
 * @author Faruk
 */
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
}
