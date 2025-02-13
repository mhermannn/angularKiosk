package com.kiosk.backend.controller;

import com.kiosk.backend.dto.AuthRequest;
import com.kiosk.backend.dto.AuthResponse;
import com.kiosk.backend.model.entity.User;
import com.kiosk.backend.repository.UserRepository;
import com.kiosk.backend.config.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            System.out.println("Attempting to authenticate user: " + request.getUsername());
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            System.out.println("Authentication successful for user: " + request.getUsername());

            // Fetch the user from the database to get the ID
            Optional<User> userOptional = userRepository.findByLogin(request.getUsername());
            if (userOptional.isEmpty()) {
                throw new RuntimeException("User not found");
            }

            User user = userOptional.get();
            String token = jwtUtil.generateToken(user.getLogin());

            return ResponseEntity.ok(new AuthResponse(token, user.getId(), user.getLogin(), user.getRole(), user.getResources()));

        } catch (Exception e) {
            System.out.println("Authentication failed for user: " + request.getUsername() + ", Error: " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid credentials");
            return ResponseEntity.status(401).body(errorResponse);
        }
    }

}
