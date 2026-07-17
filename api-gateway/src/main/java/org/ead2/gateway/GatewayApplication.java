/**
 * ========================================================================================
 * FILE: GatewayApplication.java
 * ========================================================================================
 *
 * WHAT THIS FILE DOES:
 * --------------------
 * This is the main starting point (entry point) of the API Gateway microservice.
 * Think of the API Gateway as a "front door" or "receptionist" for your entire backend.
 * When the frontend (like a React app) wants to talk to any backend service (for example,
 * user-service, crop-service, etc.), it does NOT call those services directly.
 * Instead, it sends ALL its requests to this gateway, and the gateway figures out
 * which backend service should handle each request and forwards it there.
 *
 * WHY THIS FILE EXISTS:
 * ---------------------
 * Every Spring Boot application needs exactly one main class with a "main" method.
 * This file IS that class. When you run the project, Java looks for this "main" method
 * and starts the entire application from here. Without this file, the app simply
 * cannot start.
 *
 * HOW IT FITS IN THE BIG PICTURE:
 * --------------------------------
 * Frontend (React) --> API Gateway (THIS SERVICE) --> user-service / crop-service / etc.
 *
 * The gateway reads routing rules from the application.yml (or application.properties)
 * configuration file to know which URL paths should go to which backend service.
 * ========================================================================================
 */

// This line declares the "package" — it tells Java which folder/group this file belongs to.
// All Java files must declare their package, and it must match the folder structure on disk.
// Here, "org.ead2.gateway" means this file lives in the folder: org/ead2/gateway/
package org.ead2.gateway;

// --- IMPORTS ---
// Imports bring in code from external libraries so we can use them in this file.
// Without imports, Java wouldn't know where to find these classes.

// SpringApplication is the class that actually STARTS the Spring Boot application.
// It sets up the embedded web server (like Netty or Tomcat), loads all configuration,
// and gets everything ready to handle incoming HTTP requests.
import org.springframework.boot.SpringApplication;

// @SpringBootApplication is a special label (called an "annotation") that we put on
// our main class. It is a shortcut that combines THREE separate annotations into one:
//   1. @Configuration    — Tells Spring: "This class can define settings and beans."
//   2. @EnableAutoConfiguration — Tells Spring: "Automatically set up everything you
//                                  can figure out from the libraries on the classpath."
//   3. @ComponentScan    — Tells Spring: "Scan this package and its sub-packages to
//                          find other classes I should manage (like controllers, configs)."
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * The main entry point for the API Gateway microservice.
 * This service sits in front of all other microservices (like user-service) and routes 
 * incoming requests to the appropriate backend service based on the URL path.
 * @SpringBootApplication encapsulates @Configuration, @EnableAutoConfiguration, and @ComponentScan.
 */
// @SpringBootApplication — This annotation marks this class as the ROOT of a Spring Boot app.
// When Spring sees this annotation, it automatically:
//   - Scans for other Spring components (like CorsConfig.java in the config/ folder)
//   - Reads the application.yml file for configuration (like gateway routes)
//   - Sets up the embedded web server so the gateway can receive HTTP requests
// Without this annotation, Spring Boot wouldn't know this is the main application class.
@SpringBootApplication
public class GatewayApplication {
    
    /**
     * The main method which starts the embedded server and initializes the Spring application context.
     */
    // This is the "main" method — the universal starting point for ANY Java application.
    // When you run "java -jar api-gateway.jar" or click "Run" in your IDE,
    // Java calls THIS method first, before anything else happens.
    //
    // "public" means any code can call this method.
    // "static" means you don't need to create an object of GatewayApplication to call it.
    // "void" means this method doesn't return any value.
    // "String[] args" holds any command-line arguments passed when starting the app
    //   (for example: java -jar app.jar --server.port=9090).
    public static void main(String[] args) {
        // SpringApplication.run() does ALL the heavy lifting:
        //   1. Creates the Spring "application context" (a container that holds all your
        //      objects, settings, and configurations).
        //   2. Starts the embedded web server (Netty, since this is a reactive gateway).
        //   3. Reads application.yml to load gateway route definitions.
        //   4. Finds and initializes all Spring components (like CorsConfig).
        //   5. Makes the gateway ready to accept and forward HTTP requests.
        //
        // The first argument (GatewayApplication.class) tells Spring which class to use
        // as the starting configuration. The second argument (args) passes along any
        // command-line arguments.
        SpringApplication.run(GatewayApplication.class, args);
    }
}
