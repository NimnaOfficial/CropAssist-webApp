package org.ead2.user.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * AppConfig contains global Spring bean configurations for the user-service.
 */
@Configuration
public class AppConfig {
    
    /**
     * Provides a BCryptPasswordEncoder bean to be injected into services (like UserService).
     * Used for securely hashing passwords before storing them in the database.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configures Global Cross-Origin Resource Sharing (CORS).
     * This prevents the browser from blocking requests when the frontend (localhost:3000)
     * tries to communicate with this backend (localhost:8081).
     */
    @Bean
    public org.springframework.web.servlet.config.annotation.WebMvcConfigurer corsConfigurer() {
        return new org.springframework.web.servlet.config.annotation.WebMvcConfigurer() {
            @Override
            public void addCorsMappings(org.springframework.web.servlet.config.annotation.CorsRegistry registry) {
                // Allow all paths (/**), from any origin (*), using any HTTP method (*), with any headers (*)
                registry.addMapping("/**").allowedOrigins("*").allowedMethods("*").allowedHeaders("*");
            }
        };
    }
}