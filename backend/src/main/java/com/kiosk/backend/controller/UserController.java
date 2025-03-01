package com.kiosk.backend.controller;

import com.kiosk.backend.dto.RegisterRequest;
import com.kiosk.backend.model.entity.User;
import com.kiosk.backend.model.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import org.springframework.security.core.GrantedAuthority;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserModel userModel;

    @Autowired
    public UserController(UserModel userModel) {
        this.userModel = userModel;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userModel.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id) {
        Optional<User> user = userModel.getUserById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        Optional<User> user = userModel.getAllUsers().stream()
                .filter(u -> u.getLogin().equals(username))
                .findFirst();
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable int id, @RequestBody User user, Authentication authentication) {
        String username = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_USER");

        Optional<User> existingUser = userModel.getAllUsers().stream()
                .filter(u -> u.getLogin().equals(username))
                .findFirst();

        if (existingUser.isPresent() && (existingUser.get().getId() == id || role.equals("ROLE_ADMIN"))) {
            User updatedUser = userModel.updateUser(id, user);
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable int id, Authentication authentication) {
        String username = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_USER");

        Optional<User> existingUser = userModel.getAllUsers().stream()
                .filter(u -> u.getLogin().equals(username))
                .findFirst();

        System.out.println("Authenticated user: " + username);
        System.out.println("User role: " + role);

        if (existingUser.isPresent() && (existingUser.get().getId() == id || role.equals("ROLE_ADMIN"))) {
            boolean isDeleted = userModel.deleteUser(id);
            if (isDeleted) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            Optional<User> existingUser = userModel.getAllUsers().stream()
                    .filter(u -> u.getLogin().equals(registerRequest.getUsername()))
                    .findFirst();

            if (existingUser.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Username already exists"));
            }

            // Create a new user
            User newUser = new User();
            newUser.setLogin(registerRequest.getUsername());
            System.out.println(newUser);
//            newUser.setId((userModel.getAllUsers().toArray().length) + 1);
//            System.out.println(newUser);
            newUser.setPassword(registerRequest.getPassword());
            System.out.println(newUser);// Hash the password
            newUser.setRole("USER");
            System.out.println(newUser);// Default role for new users
            newUser.setResources(50.0); // Default resources for new users
            System.out.println(newUser);
            userModel.addUser(newUser);
            System.out.println("User registered successfully: " + registerRequest.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "User registered successfully"));

        } catch (Exception e) {
            e.printStackTrace(); // Print stack trace to console for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred during registration: " + e.getMessage()));
        }
    }

}