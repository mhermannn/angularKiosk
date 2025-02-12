package com.kiosk.backend.config;

import com.kiosk.backend.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserRepository userRepository;

    public SecurityConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        System.out.println("not in userDetailsService but in authenticationManager");
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            System.out.println("Loading user: " + username); // Log the username
            return userRepository.findByLogin(username)
                    .map(user -> {
                        System.out.println("User found: " + user.getLogin() + ", Role: " + user.getRole()); // Log user details
                        return org.springframework.security.core.userdetails.User.withUsername(user.getLogin())
                                .password(user.getPassword())
                                .authorities("ROLE_" + user.getRole().toUpperCase())
                                .build();
                    })
                    .orElseThrow(() -> {
                        System.out.println("User not found: " + username); // Log if user is not found
                        return new UsernameNotFoundException("User not found: " + username);
                    });
        };
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/", "/login", "/oauth2/**", "/productlist", "/images/**", "/css/**", "/static/**", "/webjars/**").permitAll()

                        // Admin-only endpoints
                        .requestMatchers("/adminPage", "/adminChange").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/users/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        // API endpoints
                        .requestMatchers(HttpMethod.GET, "/api/**").permitAll() // Allow all users to retrieve data
                        .requestMatchers(HttpMethod.POST, "/api/**").authenticated() // Only logged-in users can create data
                        .requestMatchers(HttpMethod.PUT, "/api/**").authenticated() // Only logged-in users can update data
                        .requestMatchers(HttpMethod.DELETE, "/api/meals/**").hasRole("ADMIN") // Only admins can delete meals
                        .requestMatchers(HttpMethod.DELETE, "/api/cart/**").authenticated() // Allow logged-in users to remove items from their cart

                        // Default rule
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login")
                        .defaultSuccessUrl("/ordertype", true)
                        .failureHandler(new CustomAuthenticationFailureHandler())
                        .permitAll()
                )
                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/login")
                        .defaultSuccessUrl("/ordertype", true)
                        .failureHandler((request, response, exception) -> {
                            response.sendRedirect("/error?message=" + exception.getMessage());
                        })
                )
                .logout(logout -> logout
                        .logoutSuccessUrl("/welcome")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .permitAll()
                )
                .csrf(csrf -> csrf.disable());
        return http.build();
    }
}

