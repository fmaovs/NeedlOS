package com.farukgenc.boilerplate.springboot.controller;

import com.farukgenc.boilerplate.springboot.model.Cargo;
import com.farukgenc.boilerplate.springboot.model.User;
import com.farukgenc.boilerplate.springboot.security.dto.UserDTO;
import com.farukgenc.boilerplate.springboot.security.dto.UserResponse;
import com.farukgenc.boilerplate.springboot.security.service.UserService;
import com.farukgenc.boilerplate.springboot.security.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/users")
public class UserController {


    @Autowired
    private UserServiceImpl userServiceImpl;

    // Implementar los métodos de la clase UserService
    @GetMapping("/all")
    public Iterable<User> getUsers() {
        return userServiceImpl.findAll();
    }

    @GetMapping("/cargo/{cargo}")
    public List<UserResponse> getUsersByCargo(String cargo) {
        String cargoUpperCase = cargo.toUpperCase();
        List<UserResponse> users = userServiceImpl.findAllByCargo(Cargo.valueOf(cargoUpperCase));
        return users;

    }
    @PutMapping("/update/{id}")
    public User updateUser(Long id, UserDTO user) {
        return userServiceImpl.updateUser(id, user);
    }
}
