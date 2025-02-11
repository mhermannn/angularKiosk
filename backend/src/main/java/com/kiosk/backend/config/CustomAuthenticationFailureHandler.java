package com.kiosk.backend.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import java.io.IOException;

public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException{
        String attemptedUsername = request.getParameter("username");
        String attemptedPassword = request.getParameter("password");
        System.out.println("Nieudana próba logowania:");
        System.out.println("Attempted login: " + attemptedUsername);
        System.out.println("Attempted password: " + attemptedPassword);
        System.out.println("Błąd: " + exception.getMessage());
        response.sendRedirect("/login?error=true");
    }
}
