package com.kiosk.backend.dto;

public class AuthResponse {
    private String token;
    private int userId;
    private String username;

    public AuthResponse(String token, int userId, String username) {
        this.token = token;
        this.userId = userId;
        this.username = username;
    }

    public String getToken() { return token; }
    public int getUserId() { return userId; }
    public String getUsername() { return username; }
}