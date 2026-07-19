package org.ead2.gateway.config;

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
@Configuration
public class CorsConfig {
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOriginPattern("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsWebFilter(source);
    }
}
