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

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String username) {
        try {
            // Buscar usuario por username
            User user = userRepository.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
            }

            String email = user.getEmail();
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El usuario no tiene email configurado");
            }
            // Verificar que el usuario existe por email también (doble verificación)
            Optional<User> optionalUser = userServiceImpl.findByEmail(email);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado por email");
            }
            String token = jwtTokenManager.generatePasswordResetToken(email);
            String resetLink = "http://localhost:5173/reset-password?token=" + token;

            emailService.send(email, "Recuperación de contraseña",
                    "Haz clic en el siguiente enlace para restablecer tu contraseña:\n" + resetLink);

            return ResponseEntity.ok("Correo de recuperación enviado");

        } catch (Exception e) {
            System.err.println("Error en forgot-password: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno del servidor");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        try {
            // Validar que los parámetros no estén vacíos
            if (token == null || token.trim().isEmpty()) {
                System.err.println("ERROR: Token vacío o nulo");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token no puede estar vacío");
            }
            if (newPassword == null || newPassword.trim().isEmpty()) {
                System.err.println("ERROR: Contraseña vacía o nula");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La nueva contraseña no puede estar vacía");
            }
            String email = jwtTokenManager.getEmailFromResetToken(token);
            if (email == null || email.trim().isEmpty()) {
                System.err.println("ERROR: Email extraído del token está vacío");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token inválido - email vacío");
            }
            Optional<User> optionalUser = userServiceImpl.findByEmail(email);
            if (optionalUser.isEmpty()) {
                System.err.println("ERROR: Usuario no encontrado con email: " + email);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
            }
            User user = optionalUser.get();
            // Encriptar la nueva contraseña
            String encodedPassword = bCryptPasswordEncoder.encode(newPassword);
            System.out.println("Contraseña encriptada generada");
            user.setPassword(encodedPassword);
            // Guardar el usuario actualizado
            User savedUser = userRepository.save(user);
            System.out.println("Usuario guardado exitosamente con ID: " + savedUser.getId());
            System.out.println("=== FIN RESET PASSWORD EXITOSO ===");

            return ResponseEntity.ok("Contraseña actualizada con éxito");

        } catch (RuntimeException e) {
            // Manejo genérico para errores de JWT
            String errorMessage = e.getMessage().toLowerCase();
            if (errorMessage.contains("expired")) {
                System.err.println("Token expirado: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El token ha expirado");
            } else if (errorMessage.contains("signature") || errorMessage.contains("invalid")) {
                System.err.println("Token con firma inválida: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token inválido");
            } else if (errorMessage.contains("malformed")) {
                System.err.println("Token malformado: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token malformado");
            } else {
                throw e; // Re-lanzar si no es un error conocido de JWT
            }

        } catch (Exception e) {
            System.err.println("Error en reset-password: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno del servidor");
        }
    }

    @PatchMapping("/{id}/Estado")
    public ResponseEntity<UserResponse> cambioEstado(@PathVariable Long id, @RequestParam boolean enabled) {
        UserResponse updatedUser = userServiceImpl.cambioEstado(id, enabled);
        return ResponseEntity.ok(updatedUser);
    }

}
