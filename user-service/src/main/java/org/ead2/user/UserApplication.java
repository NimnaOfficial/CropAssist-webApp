package org.ead2.user;

/**
 * ========================================================================================
 * FILE: UserApplication.java
 * ========================================================================================
 *
 * WHAT THIS FILE DOES:
 *   This is the "starting point" (entry point) of the entire User Service application.
 *   Think of it like the ignition key of a car — when you run this file, the whole
 *   backend server starts up and begins listening for requests from the frontend.
 *
 * WHY IT EXISTS:
 *   Every Spring Boot application needs exactly ONE main class with a main() method.
 *   This is that class. Without it, the application cannot start.
 *
 * HOW IT WORKS:
 *   When you run this file, Spring Boot does the following automatically:
 *     1. Starts an embedded web server (Tomcat) so you don't need to install one separately.
 *     2. Scans all packages and sub-packages for classes with special annotations
 *        (like @Controller, @Service, @Repository, @Configuration) and registers them.
 *     3. Sets up the database connection, security, and everything else based on your
 *        configuration files (application.properties or application.yml).
 *
 * ========================================================================================
 */

// --- IMPORTS ---

// SpringApplication: This is the class that actually boots up (starts) the Spring application.
//   It sets up the default configuration, starts the embedded web server, and creates the
//   "application context" (a container that holds all your beans/objects).
import org.springframework.boot.SpringApplication;

// @SpringBootApplication: This is a shortcut annotation (see below for details).
//   Importing it lets us use the @SpringBootApplication label on our class.
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @SpringBootApplication — This single annotation is actually a shortcut that combines THREE annotations:
 *
 *   1. @Configuration    — Tells Spring: "This class can define beans (reusable objects) for the app."
 *   2. @EnableAutoConfiguration — Tells Spring: "Automatically set up everything you can based on
 *                                  the libraries I have (e.g., if I have a database driver, set up
 *                                  the database connection automatically)."
 *   3. @ComponentScan    — Tells Spring: "Scan this package and all sub-packages to find classes
 *                          marked with @Controller, @Service, @Repository, etc., and register them."
 *
 *   Without this annotation, Spring Boot wouldn't know where to find your code or how to set things up.
 */
@SpringBootApplication
public class UserApplication {
    
    /**
     * main() — The starting method of the application.
     *
     * WHAT IT DOES:
     *   Calls SpringApplication.run() which does ALL of the following:
     *     - Creates the Spring application context (the "container" for all your objects)
     *     - Starts the embedded Tomcat web server (default port: 8080)
     *     - Scans for and registers all your controllers, services, repositories, and configs
     *     - Connects to the database using your settings in application.properties
     *     - Makes the application ready to receive HTTP requests from the frontend
     *
     * WHY IT EXISTS:
     *   Java requires a main() method as the entry point of any application.
     *   This is where everything begins.
     *
     * @param args — Command-line arguments passed when starting the app (usually empty).
     *               You can use these to override settings, e.g., --server.port=9090
     */
    public static void main(String[] args) {
        SpringApplication.run(UserApplication.class, args);
    }
}
