/**
 * =========================================================================================
 * FILE: CropApplication.java
 * =========================================================================================
 *
 * PURPOSE:
 *   This is the STARTING POINT (entry point) of the entire Crop Service application.
 *   Think of it like the "power button" — when you run this file, the whole application
 *   starts up. It boots the Spring Boot framework, which then automatically finds and
 *   sets up all your controllers, services, and database connections.
 *
 * WHY IT EXISTS:
 *   Every Spring Boot application needs exactly ONE class with a "main" method and the
 *   @SpringBootApplication annotation. Without this file, the application simply cannot
 *   start. This file tells Java: "Start here, and let Spring Boot handle everything else."
 *
 * HOW IT WORKS (in simple terms):
 *   1. Java looks for the "main" method and runs it.
 *   2. The main method calls SpringApplication.run(), which does ALL the heavy lifting:
 *      - It creates an embedded web server (Tomcat) so you don't need to install one separately.
 *      - It scans this package (org.ead2.crop) and all sub-packages to find classes
 *        marked with annotations like @Controller, @Service, @Repository, etc.
 *      - It automatically wires (connects) everything together so they can talk to each other.
 *      - It reads your configuration from application.properties or application.yml.
 *   3. Once everything is set up, the application is running and ready to receive HTTP requests.
 *
 * =========================================================================================
 */

// "package" tells Java which folder/group this file belongs to.
// All files in the same package can easily access each other.
package org.ead2.crop;

// --- IMPORTS ---
// Imports are like "include" statements — they bring in code written by others so we can use it here.

// SpringApplication: This is the class that actually STARTS the Spring Boot application.
// It sets up the embedded web server, loads configuration, and initializes all components.
import org.springframework.boot.SpringApplication;

// SpringBootApplication: This is a SPECIAL annotation (a label you put on a class) that is
// actually a shortcut for THREE annotations combined into one:
//   1. @Configuration       — Tells Spring "this class can define settings and beans (objects)."
//   2. @EnableAutoConfiguration — Tells Spring "automatically figure out what I need and set it up."
//                                 For example, if you have a database driver, Spring will auto-configure
//                                 a database connection for you.
//   3. @ComponentScan       — Tells Spring "scan this package and all sub-packages to find classes
//                             marked with @Controller, @Service, @Repository, etc., and register them."
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * The main entry point for the Crop Service microservice.
 *
 * @SpringBootApplication is a convenience annotation that combines three things:
 *   - @Configuration:          Marks this class as a source of bean definitions (object configurations).
 *   - @EnableAutoConfiguration: Tells Spring Boot to automatically configure your application based
 *                                on the dependencies you have (e.g., if you added a database library,
 *                                Spring Boot will auto-configure a database connection).
 *   - @ComponentScan:          Tells Spring to look through this package and all its sub-packages
 *                               to find and register components (controllers, services, repositories).
 */
// @SpringBootApplication — This single annotation replaces the need for writing three separate
// annotations. It tells Spring Boot: "This is my main application class. Please auto-configure
// everything, scan for components, and treat this as a configuration source."
@SpringBootApplication
public class CropApplication {

    /**
     * The main method — this is where Java starts executing the program.
     *
     * WHAT IT DOES:
     *   Calls SpringApplication.run() which:
     *     1. Creates an embedded Tomcat web server (so you don't need to install one separately).
     *     2. Reads your application.properties / application.yml settings.
     *     3. Scans for and initializes all your @Controller, @Service, @Repository classes.
     *     4. Wires (connects) dependencies together using Dependency Injection.
     *     5. Starts listening for incoming HTTP requests on the configured port (default: 8080).
     *
     * WHY IT EXISTS:
     *   Without this method, Java has no idea where to start running the application.
     *   This is the universal starting point for every Java application.
     *
     * @param args — Command-line arguments passed when starting the app (e.g., --server.port=9090).
     *               These can override settings in your configuration files.
     */
    public static void main(String[] args) {
        // SpringApplication.run() does ALL the magic:
        // - First argument (CropApplication.class): Tells Spring which class is the main configuration.
        // - Second argument (args): Passes any command-line arguments to Spring Boot.
        // After this line runs, your application is LIVE and accepting HTTP requests!
        SpringApplication.run(CropApplication.class, args);
    }
}
