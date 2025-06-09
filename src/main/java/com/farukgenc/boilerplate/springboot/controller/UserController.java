package com.farukgenc.boilerplate.springboot.controller;

import com.farukgenc.boilerplate.springboot.model.Cargo;
import com.farukgenc.boilerplate.springboot.model.User;
import com.farukgenc.boilerplate.springboot.repository.UserRepository;
import com.farukgenc.boilerplate.springboot.security.dto.SastreResponse;
import com.farukgenc.boilerplate.springboot.security.dto.UserDTO;
import com.farukgenc.boilerplate.springboot.security.dto.UserResponse;
import com.farukgenc.boilerplate.springboot.security.jwt.JwtTokenManager;
import com.farukgenc.boilerplate.springboot.security.service.EmailService;
import com.farukgenc.boilerplate.springboot.security.service.UserService;
import com.farukgenc.boilerplate.springboot.security.service.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {


    @Autowired
    private UserServiceImpl userServiceImpl;

    @Autowired
    private JwtTokenManager jwtTokenManager;

    @Autowired
    private EmailService emailService;

    private final UserRepository userRepository;

    @Autowired
    private final BCryptPasswordEncoder bCryptPasswordEncoder;


    // Implementar los métodos de la clase UserService
    @GetMapping("/all")
    public List<SastreResponse> getUsers() {
        return userServiceImpl.findAll();
    }

    @GetMapping("/cargo/{cargo}")
    public List<UserResponse> getUsersByCargo(String cargo) {
        String cargoUpperCase = cargo.toUpperCase();
        List<UserResponse> users = userServiceImpl.findAllByCargo(Cargo.valueOf(cargoUpperCase));
        return users;

    }
    @PutMapping("/update/{id}")
    public User updateUser(Long id, @RequestBody UserDTO user) {
        return userServiceImpl.updateUser(id, user);
    }

    @PatchMapping("/password/{id}")
    public ResponseEntity<String> updatePassword(@PathVariable Long id,  String password) {
        userServiceImpl.updatePassword(id, password);
        return ResponseEntity.ok("Password updated successfully");
    }

    @GetMapping("/{id}")
    public UserResponse getUser(@PathVariable Long id) {
        return userServiceImpl.convertUsertoUserResponse(id);
    }

    // Obtener correo del usuario para restablecer contraseña
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String username) {
        String email = userRepository.findByUsername(username).getEmail();
        Optional<User> optionalUser = userServiceImpl.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }

        String token = jwtTokenManager.generatePasswordResetToken(email);
        String resetLink = "http://localhost:5173/reset-password?token=" + token;

        emailService.send(email, "Recuperación de contraseña",
                "Haz clic en el siguiente enlace para restablecer tu contraseña:\n" + resetLink);

        return ResponseEntity.ok("Correo de recuperación enviado");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        try {
            String email = jwtTokenManager.getEmailFromResetToken(token);

            Optional<User> optionalUser = userServiceImpl.findByEmail(email);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
            }

            User user = optionalUser.get();
            user.setPassword(bCryptPasswordEncoder.encode(newPassword));
            userRepository.save(user);

            return ResponseEntity.ok("Contraseña actualizada con éxito");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token inválido o expirado");
        }
    }

    @PatchMapping("/{id}/Estado")
    public ResponseEntity<UserResponse> cambioEstado(@PathVariable Long id, @RequestParam boolean enabled) {
        UserResponse updatedUser = userServiceImpl.cambioEstado(id, enabled);
        return ResponseEntity.ok(updatedUser);
    }

}
