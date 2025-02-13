package com.kiosk.backend.dto;

public class AuthResponse {
    private String token;
    private int userId;
    private String username;
    private String role;
    private Double resources;

    public AuthResponse(String token, int userId, String username, String role, Double resources) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.role = role;
        this.resources = resources;
    }

    public String getToken() { return token; }
    public int getUserId() { return userId; }
    public String getUsername() { return username; }
    public String getRole() { return role;}
    public Double getResources() { return resources; }
}