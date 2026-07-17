/**
 * ========================================================================================
 * FILE: CorsConfig.java
 * ========================================================================================
 *
 * WHAT THIS FILE DOES:
 * --------------------
 * This file sets up CORS (Cross-Origin Resource Sharing) rules for the API Gateway.
 *
 * WHAT IS CORS? (Simple Explanation):
 * ------------------------------------
 * Imagine your frontend (React app) runs on http://localhost:3000 and your API Gateway
 * runs on http://localhost:8080. These are DIFFERENT "origins" (different port = different
 * origin). By default, web browsers BLOCK requests between different origins for security
 * reasons. This is called the "Same-Origin Policy."
 *
 * CORS is the mechanism that tells the browser: "Hey, it's okay! Allow requests from
 * this other origin." Without this configuration, your frontend would get a CORS error
 * in the browser console and none of your API calls would work.
 *
 * WHY THIS FILE EXISTS:
 * ---------------------
 * The API Gateway is the single entry point for ALL frontend requests. So the CORS rules
 * MUST be set here at the gateway level. If we didn't have this file, the browser would
 * block every single request from the frontend to the gateway, and the app would be broken.
 *
 * HOW IT FITS IN THE BIG PICTURE:
 * --------------------------------
 * Browser (React at localhost:3000)
 *   --> sends request to API Gateway (localhost:8080)
 *   --> Gateway checks CORS rules (THIS FILE) and says "allowed!"
 *   --> Gateway forwards the request to the correct backend service
 *   --> Response comes back through the gateway to the browser
 * ========================================================================================
 */

// This line declares the package — it tells Java which folder/group this file belongs to.
// "org.ead2.gateway.config" means this file lives in: org/ead2/gateway/config/
// The "config" sub-package is a common convention for storing configuration classes.
package org.ead2.gateway.config;

// --- IMPORTS ---
// Each import brings in a specific class from the Spring Framework libraries.

// @Bean is an annotation that tells Spring: "The method below this annotation creates
// an object that Spring should manage." Spring will call this method automatically,
// take the object it returns, and keep it in its container (called the "application context")
// so it can be used throughout the application.
import org.springframework.context.annotation.Bean;

// @Configuration is an annotation that tells Spring: "This class contains configuration
// settings and/or @Bean methods." Spring will read this class at startup and process
// any beans or settings defined inside it. Think of it as a "settings file" written in Java.
import org.springframework.context.annotation.Configuration;

// CorsConfiguration is a class that holds all the CORS rules — which origins are allowed,
// which HTTP methods are allowed (GET, POST, PUT, DELETE, etc.), which headers are allowed,
// and how long the browser should cache these rules. It's like a "rulebook" for CORS.
import org.springframework.web.cors.CorsConfiguration;

// CorsWebFilter is a "filter" — a piece of code that runs BEFORE every incoming request
// is processed. This specific filter checks each incoming request against the CORS rules
// and adds the necessary CORS headers to the response. This is the REACTIVE version
// (used with WebFlux/Netty), which is what Spring Cloud Gateway uses internally.
// Note: "reactive" means it uses a non-blocking, event-driven approach — the gateway
// doesn't use traditional Tomcat/Servlet, it uses Netty/WebFlux instead.
import org.springframework.web.cors.reactive.CorsWebFilter;

// UrlBasedCorsConfigurationSource maps URL patterns to CORS rules. For example, you can
// say "apply these CORS rules to all URLs matching /api/**" or "apply to everything (/**)".
// This is the REACTIVE version (for WebFlux), matching the reactive nature of the gateway.
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

/**
 * CorsConfig enables cross-origin access for the API Gateway.
 * The gateway sits in front of the backend services, so it must allow the frontend
 * to call the routed endpoints without browser CORS blocking.
 */
// @Configuration — This annotation marks this class as a configuration class.
// When the application starts, Spring Boot automatically finds this class (because
// @SpringBootApplication in GatewayApplication.java triggers a component scan of this
// package and all sub-packages, including "config"). Spring then reads this class and
// processes any @Bean methods inside it.
// Without @Configuration, Spring would NOT know this class exists and would NOT apply
// the CORS rules — meaning the frontend would get CORS errors.
@Configuration
public class CorsConfig {

    // @Bean — This annotation tells Spring: "Call this method at startup, take the object
    // it returns (a CorsWebFilter), and register it as a managed component."
    // Once registered, Spring will automatically apply this filter to EVERY incoming
    // HTTP request that hits the gateway.
    // Without @Bean, this method would just be a regular Java method that never gets called.
    @Bean
    public CorsWebFilter corsWebFilter() {
        // --- STEP 1: Create the CORS rulebook ---

        // Allow the browser frontend to call the gateway from any origin during development.
        // Create a new CorsConfiguration object — this is where we define all CORS rules.
        CorsConfiguration config = new CorsConfiguration();

        // addAllowedOriginPattern("*") — Allow requests from ANY origin (any domain/port).
        // The "*" is a wildcard meaning "everything."
        // In production, you would replace "*" with your actual frontend URL
        // (e.g., "https://cropassist.com") for security. But during development,
        // allowing all origins makes things easier since your frontend URL might change.
        config.addAllowedOriginPattern("*");

        // addAllowedHeader("*") — Allow ANY HTTP header in the request.
        // Headers carry extra information with requests (like "Authorization" for tokens,
        // "Content-Type" to specify JSON, etc.). The "*" wildcard allows all of them.
        // Without this, the browser might block requests that include custom headers.
        config.addAllowedHeader("*");

        // addAllowedMethod("*") — Allow ANY HTTP method (GET, POST, PUT, DELETE, PATCH, etc.).
        // The "*" wildcard means every method is permitted.
        // Without this, the browser might only allow simple methods like GET and POST,
        // blocking PUT or DELETE requests that your frontend might need.
        config.addAllowedMethod("*");

        // setMaxAge(3600L) — Tell the browser to cache (remember) these CORS rules for
        // 3600 seconds (= 1 hour). This means the browser won't send a "preflight" check
        // (an extra OPTIONS request) for every single API call during that hour.
        // This improves performance because it reduces the number of network requests.
        // The "L" at the end means this is a "long" number (a Java data type for big numbers).
        config.setMaxAge(3600L);

        // --- STEP 2: Apply the rules to all gateway URLs ---

        // Apply the CORS rules to every path handled by the gateway.
        // Create a UrlBasedCorsConfigurationSource — this maps URL patterns to CORS rules.
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        // registerCorsConfiguration("/**", config) — Apply our CORS rules to ALL URL paths.
        // The "/**" pattern is a wildcard that matches every possible URL path.
        // For example: /api/users, /api/crops, /health, etc. — all of them get CORS headers.
        // If you only wanted CORS on certain paths, you could use "/api/**" instead.
        source.registerCorsConfiguration("/**", config);

        // --- STEP 3: Create and return the filter ---

        // Create a new CorsWebFilter using our configured source (which has our rules).
        // Spring will take this returned filter and automatically apply it to every
        // incoming HTTP request. The filter checks each request against our rules and
        // adds the appropriate CORS headers (like "Access-Control-Allow-Origin") to the
        // response so the browser knows the request is allowed.
        return new CorsWebFilter(source);
    }
}
