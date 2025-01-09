package com.farukgenc.boilerplate.springboot.repository;

import com.farukgenc.boilerplate.springboot.model.Cargo;
import com.farukgenc.boilerplate.springboot.model.User;
import com.farukgenc.boilerplate.springboot.security.dto.UserResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Created on Ağustos, 2020
 *
 * @author Faruk
 */
public interface UserRepository extends JpaRepository<User, Long> {

	User findByUsername(String username);

	boolean existsByEmail(String email);

	boolean existsByUsername(String username);

	User findByCargo(Cargo cargo);


	List<User> findAllByCargo(Cargo cargo);
}
