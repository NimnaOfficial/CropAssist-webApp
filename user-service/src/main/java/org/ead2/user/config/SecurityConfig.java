package org.ead2.user.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * SecurityConfig disables Spring Security's default filter chain behavior.
 *
 * WHY THIS IS NEEDED:
 * The user-service includes 'spring-security-crypto' for password hashing (BCrypt).
 * However, Spring Boot auto-detects ANY Spring Security dependency on the classpath
 * and automatically enables a SecurityFilterChain that:
 *   1. Requires authentication on ALL endpoints (including /Api/login)
 *   2. Blocks all CORS preflight OPTIONS requests with 403 Forbidden
 *
 * This config explicitly tells Spring Security to:
 *   - Permit ALL requests without authentication
 *   - Disable CSRF (not needed for stateless REST APIs)
 *   - Enable CORS so the frontend (localhost:3000) can communicate freely
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Enable CORS using the WebMvcConfigurer bean defined in AppConfig
            .cors(cors -> cors.configure(http))
            // Disable CSRF protection (this is a stateless REST API, not a form-based app)
            .csrf(csrf -> csrf.disable())
            // Permit ALL requests to ALL endpoints without requiring authentication
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            );

        return http.build();
    }
}
