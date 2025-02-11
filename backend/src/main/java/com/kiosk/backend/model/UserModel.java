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

        existingUser.setLogin(updatedUser.getLogin());
        existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        return userRepository.save(existingUser);
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

