package com.kiosk.backend.model.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true, nullable = false)
    private String login;

    private String password;

    private Double resources;

    @Column(nullable = false, length = 20)
    private String role;

    public User() {}

    public User(String login, String password, double resources) {
        this.login = login;
        this.password = password;
        this.resources = resources;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public double getResources() {
        return resources;
    }

    public void setResources(Double resources) {
        this.resources = BigDecimal.valueOf(resources).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}

