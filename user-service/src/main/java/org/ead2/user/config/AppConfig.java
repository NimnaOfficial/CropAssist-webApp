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

}