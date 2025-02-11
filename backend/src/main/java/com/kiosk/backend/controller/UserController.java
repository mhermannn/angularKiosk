package com.kiosk.backend.controller;

import com.kiosk.backend.model.entity.User;
import com.kiosk.backend.model.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserModel userModel;

    @Autowired
    public UserController(UserModel userModel) {
        this.userModel = userModel;
    }

    // Allow all users to retrieve a list of users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userModel.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Allow all users to retrieve a specific user
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id) {
        Optional<User> user = userModel.getUserById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Allow logged-in users to retrieve their own data
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        Optional<User> user = userModel.getAllUsers().stream()
                .filter(u -> u.getLogin().equals(username))
                .findFirst();
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Allow logged-in users to update their own data
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable int id, @RequestBody User user, Authentication authentication) {
        String username = authentication.getName();
        Optional<User> existingUser = userModel.getAllUsers().stream()
                .filter(u -> u.getLogin().equals(username))
                .findFirst();

        if (existingUser.isPresent() && existingUser.get().getId() == id) {
            User updatedUser = userModel.updateUser(id, user);
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    // Allow admins or the user themselves to delete their account
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable int id, Authentication authentication) {
        String username = authentication.getName();
        Optional<User> existingUser = userModel.getAllUsers().stream()
                .filter(u -> u.getLogin().equals(username))
                .findFirst();

        if (existingUser.isPresent() && (existingUser.get().getId() == id || existingUser.get().getRole().equals("ADMIN"))) {
            userModel.deleteUser(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}