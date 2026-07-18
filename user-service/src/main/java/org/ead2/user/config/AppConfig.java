package org.ead2.user.config;

/**
 * ========================================================================================
 * FILE: AppConfig.java
 * ========================================================================================
 *
 * WHAT THIS FILE DOES:
 *   This is a configuration class that creates and registers shared tools (called "beans")
 *   that other parts of the application can use. Right now, it creates a PasswordEncoder
 *   bean that is used to securely hash (scramble) passwords before storing them in the database.
 *
 * WHY IT EXISTS:
 *   We NEVER want to store passwords as plain text in the database (e.g., "myPassword123").
 *   If someone hacks the database, they'd see everyone's passwords! Instead, we use a
 *   "password encoder" to turn the password into a scrambled string (called a "hash") that
 *   looks like: "$2a$10$N9qo8uLOickgx2ZMRZoMye..."
 *
 *   This hash CANNOT be reversed back into the original password, so even if the database
 *   is stolen, the passwords are safe.
 *
 *   By creating the PasswordEncoder as a "bean" here, we make it available for Spring to
 *   automatically inject (provide) it wherever it's needed — like in UserService.
 *
 * HOW IT FITS IN THE PROJECT:
 *   AppConfig (creates PasswordEncoder) → UserService (uses it to hash/verify passwords)
 *
 * ========================================================================================
 */

// --- IMPORTS ---

// @Bean: This annotation marks a method as a "bean factory" — the object returned by the
//   method will be managed by Spring and can be automatically injected into other classes.
//   Think of it as registering a tool in a shared toolbox that anyone in the app can borrow.
import org.springframework.context.annotation.Bean;

// @Configuration: This annotation tells Spring: "This class contains bean definitions."
//   Spring will read this class at startup and call all @Bean methods to create the beans.
//   It's like a recipe book that Spring reads to know what tools to prepare.
import org.springframework.context.annotation.Configuration;

// BCryptPasswordEncoder: This is the actual password hashing tool. BCrypt is a widely-used
//   algorithm that:
//     1. Takes a plain-text password (e.g., "hello123")
//     2. Adds a random "salt" (extra random characters) to make the hash unique
//     3. Scrambles it into a long string (e.g., "$2a$10$N9qo8uLOickgx2ZMRZoMye...")
//     4. The scrambling is intentionally SLOW to make it hard for hackers to guess passwords
//   BCrypt is one of the most secure password hashing methods available today.
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

// PasswordEncoder: This is an INTERFACE (a contract/blueprint) that defines what any
//   password encoder must be able to do: encode() a password and matches() to compare.
//   We use this interface type (instead of BCryptPasswordEncoder directly) so that if we
//   ever want to switch to a different hashing method, we only need to change this one file.
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.client.RestTemplate;

/**
 * @Configuration — Tells Spring: "This class is a configuration class."
 *   Spring will scan this class at startup and execute all methods marked with @Bean
 *   to create the objects (beans) that the application needs.
 *   Think of it as a setup file that prepares tools before the app starts running.
 */
@Configuration
public class AppConfig {
    
    /**
     * passwordEncoder() — Creates and returns a BCryptPasswordEncoder bean.
     *
     * WHAT IT DOES:
     *   Creates a BCryptPasswordEncoder object and registers it with Spring as a bean.
     *   This means any class that needs a PasswordEncoder (like UserService) can simply
     *   declare it in its constructor, and Spring will automatically provide this object.
     *
     * WHY IT EXISTS:
     *   - We need to hash passwords before saving them to the database (for security).
     *   - We need to verify passwords during login (compare the typed password with the hash).
     *   - By creating it as a bean, we use ONE shared instance across the entire app,
     *     instead of creating a new one every time we need it.
     *
     * @Bean — Tells Spring: "The object returned by this method should be stored in Spring's
     *   container and made available for automatic injection into other classes."
     *   When UserService's constructor asks for a PasswordEncoder, Spring will give it
     *   the BCryptPasswordEncoder created here.
     *
     * @return A new BCryptPasswordEncoder instance that can hash and verify passwords.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * restTemplate() — Creates and returns a RestTemplate bean.
     * We use this to make HTTP calls to other microservices.
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

}