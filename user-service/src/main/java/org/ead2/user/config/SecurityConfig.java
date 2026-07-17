package org.ead2.user.config;

/**
 * ========================================================================================
 * FILE: SecurityConfig.java
 * ========================================================================================
 *
 * WHAT THIS FILE DOES:
 *   This file configures Spring Security to DISABLE its default security behavior.
 *   By default, Spring Security locks down ALL endpoints and requires a login for everything.
 *   We don't want that — our User Service is a REST API that handles its own authentication
 *   (via the /Api/login endpoint), so we need to tell Spring Security to step aside.
 *
 * WHY IT EXISTS:
 *   We added the "spring-security-crypto" library to our project ONLY because we need
 *   BCrypt password hashing (see AppConfig.java). However, Spring Boot is "smart" — when it
 *   sees ANY Spring Security library on the classpath, it automatically enables a full
 *   security system that:
 *     1. Blocks ALL HTTP requests unless the user is authenticated (logged in)
 *     2. Blocks all CORS preflight OPTIONS requests with a 403 Forbidden error
 *     3. Shows a default login page at /login
 *
 *   This is a problem because:
 *     - Our frontend (React/Next.js) at localhost:3000 can't reach ANY endpoint
 *     - Even our /Api/login endpoint would be blocked (you'd need to log in to log in!)
 *     - CORS preflight requests from the browser would fail
 *
 *   So this config explicitly says: "Let ALL requests through. We'll handle security ourselves."
 *
 * WHAT IS CORS?
 *   CORS = Cross-Origin Resource Sharing. When your frontend (localhost:3000) tries to talk
 *   to your backend (localhost:8080), the browser blocks it by default for security reasons
 *   (they're on different "origins"). CORS tells the browser: "It's okay, let them communicate."
 *
 * WHAT IS CSRF?
 *   CSRF = Cross-Site Request Forgery. It's a type of attack where a malicious website tricks
 *   your browser into making requests to your backend. CSRF protection is important for
 *   traditional web apps with forms, but NOT needed for stateless REST APIs (like ours)
 *   that use JSON requests. So we disable it.
 *
 * ========================================================================================
 */

// --- IMPORTS ---

// @Bean: Marks a method so that the object it returns is registered in Spring's container.
//   Other parts of the app can then use this object automatically.
import org.springframework.context.annotation.Bean;

// @Configuration: Tells Spring that this class contains configuration settings and bean definitions.
//   Spring reads this at startup to know how to set things up.
import org.springframework.context.annotation.Configuration;

// HttpSecurity: This is the main object used to configure web security rules.
//   Think of it as a control panel where you can turn security features on or off.
//   You can set which URLs require login, enable/disable CORS, enable/disable CSRF, etc.
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

// @EnableWebSecurity: Tells Spring: "I want to customize the web security settings myself."
//   Without this, Spring would use its default security settings (which block everything).
//   With this, Spring will use OUR custom settings defined in the filterChain() method below.
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

// SecurityFilterChain: This is the "chain of security checks" that every incoming HTTP request
//   passes through. Think of it like a series of gates at a building entrance.
//   Each gate checks something different (is the user logged in? is CSRF token valid? etc.)
//   We're configuring this chain to let everyone through without any checks.
import org.springframework.security.web.SecurityFilterChain;

/**
 * @Configuration — Tells Spring: "This is a configuration class with setup instructions."
 *   Spring will read this class at startup to configure the application.
 */
@Configuration
/**
 * @EnableWebSecurity — Tells Spring: "I want to OVERRIDE the default security settings
 *   with my own custom rules." Without this annotation, our custom filterChain() method
 *   would be ignored, and Spring would use its default (block everything) behavior.
 */
@EnableWebSecurity
public class SecurityConfig {

    /**
     * filterChain() — Defines the custom security rules for our application.
     *
     * WHAT IT DOES:
     *   Creates a SecurityFilterChain that allows ALL requests to pass through
     *   without any authentication. It also enables CORS and disables CSRF.
     *
     * WHY IT EXISTS:
     *   Without this, Spring Security's default behavior would block every single
     *   HTTP request to our API, making it completely unusable.
     *
     * @Bean — Registers the returned SecurityFilterChain in Spring's container so
     *   Spring uses OUR security rules instead of the default ones.
     *
     * @param http — The HttpSecurity builder provided by Spring. We use it to configure
     *               our security rules step by step (like building with LEGO blocks).
     * @return A fully configured SecurityFilterChain that permits all requests.
     * @throws Exception — Required by the HttpSecurity methods in case something goes wrong
     *                     during configuration.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // STEP 1: Enable CORS (Cross-Origin Resource Sharing)
            // This allows the frontend (running on a different port, e.g., localhost:3000)
            // to send requests to this backend (running on e.g., localhost:8080).
            // Without this, the browser would block all requests from the frontend.
            .cors(cors -> cors.configure(http))

            // STEP 2: Disable CSRF (Cross-Site Request Forgery) protection
            // CSRF protection is designed for traditional websites that use HTML forms.
            // Our app is a REST API that sends/receives JSON, so CSRF protection is not
            // needed and would actually cause problems (it would reject our POST/PUT requests).
            .csrf(csrf -> csrf.disable())

            // STEP 3: Allow ALL requests to ALL URLs without requiring login
            // "anyRequest()" means every single URL in the app.
            // "permitAll()" means no authentication is required — anyone can access it.
            // This is intentional because our app handles authentication manually
            // through the /Api/login endpoint in UserController.
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            );

        // Build and return the final SecurityFilterChain with all our settings applied.
        return http.build();
    }
}
