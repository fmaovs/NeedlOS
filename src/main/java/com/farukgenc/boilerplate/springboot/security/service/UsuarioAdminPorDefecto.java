package com.farukgenc.boilerplate.springboot.security.service;

import com.farukgenc.boilerplate.springboot.model.Cargo;
import com.farukgenc.boilerplate.springboot.model.User;
import com.farukgenc.boilerplate.springboot.model.UserRole;
import com.farukgenc.boilerplate.springboot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UsuarioAdminPorDefecto implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User usuario = new User();
            usuario.setName("Admin");
            usuario.setLastname("Principal");
            usuario.setUsername("admin");
            usuario.setPassword(new BCryptPasswordEncoder().encode("admin12345"));
            usuario.setEmail("admin@gmail.com");
            usuario.setPhone(1234567890L);
            usuario.setUserRole(UserRole.ADMIN);
            usuario.setCargo(Cargo.ADMIN);

            userRepository.save(usuario);
            System.out.println("Usuario administrador creado");
        } else {
            System.out.println("Usuario ya existente");
        }
    }
}