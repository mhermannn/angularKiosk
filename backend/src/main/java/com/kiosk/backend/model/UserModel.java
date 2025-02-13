package com.kiosk.backend.model;

import com.kiosk.backend.model.entity.User;
import com.kiosk.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Component
public class UserModel {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserModel(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(int id) {
        return userRepository.findById(id);
    }

    public int getUserIdByUsername(String login) {
        return userRepository.findByLogin(login)
                .orElseThrow(() -> new NoSuchElementException("User not found with login: " + login))
                .getId();
    }

    public User addUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        System.out.println("Dodano użytkownika: " + savedUser.getLogin() + "\n");
        return savedUser;
    }

    public User updateUser(int id, User updatedUser) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + id));

        // Update the login if provided
        if (updatedUser.getLogin() != null) {
            existingUser.setLogin(updatedUser.getLogin());
        }

        // Update the password only if it has changed and is not already hashed
        if (updatedUser.getPassword() != null) {
            String newPassword = updatedUser.getPassword();

            // Check if the new password is already hashed
            if (isPasswordHashed(newPassword)) {
                // If it's already hashed, set it directly
                existingUser.setPassword(newPassword);
            } else {
                // If it's not hashed, encode it before setting
                existingUser.setPassword(passwordEncoder.encode(newPassword));
            }
        }

        return userRepository.save(existingUser);
    }

    // Helper method to check if a password is already hashed
    private boolean isPasswordHashed(String password) {
        // BCrypt hashed passwords start with "$2a$", "$2b$", or "$2y$" and are 60 characters long
        return password != null && password.length() == 60 &&
                (password.startsWith("$2a$") || password.startsWith("$2b$") || password.startsWith("$2y$"));
    }

    public boolean deleteUser(int id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean matchesPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

}

