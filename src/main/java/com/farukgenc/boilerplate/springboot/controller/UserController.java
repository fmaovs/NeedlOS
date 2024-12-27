package com.farukgenc.boilerplate.springboot.controller;

import com.farukgenc.boilerplate.springboot.model.User;
import com.farukgenc.boilerplate.springboot.security.service.UserService;
import com.farukgenc.boilerplate.springboot.security.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
