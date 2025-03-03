package com.farukgenc.boilerplate.springboot.security.service;

import com.farukgenc.boilerplate.springboot.model.User;
import com.farukgenc.boilerplate.springboot.security.dto.AuthenticatedUserDto;
import com.farukgenc.boilerplate.springboot.security.dto.RegistrationRequest;
import com.farukgenc.boilerplate.springboot.security.dto.RegistrationResponse;
import com.farukgenc.boilerplate.springboot.security.dto.UserResponse;


public interface UserService {

	User findByUsername(String username);

	UserResponse findById(Long id);

	RegistrationResponse registration(RegistrationRequest registrationRequest);

	AuthenticatedUserDto findAuthenticatedUserByUsername(String username);

}
