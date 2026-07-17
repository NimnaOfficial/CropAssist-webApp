package org.ead2.comms;

/**
 * ===========================================================================================
 * FILE: CommsApplication.java
 * ===========================================================================================
 *
 * PURPOSE:
 * This is the STARTING POINT (entry point) of the entire Communication Service microservice.
 * Think of it like the "power button" of the application — when you run this file,
 * the whole Spring Boot application boots up, connects to the database, starts a web
 * server, and gets ready to handle incoming HTTP requests.
 *
 * WHY IT EXISTS:
 * Every Spring Boot application needs exactly ONE main class with a main() method.
 * This class serves that role for the Communication Service. Without it, the app
 * simply won't start. It tells Spring Boot: "Start here, scan for all the other
 * classes (controllers, services, repositories), and wire everything together."
 *
 * HOW IT FITS IN THE PROJECT:
 * This microservice is part of the CropAssist web application. The Communication Service
 * is responsible for handling messages between farmers and the system (or administrators).
 *
 * ===========================================================================================
 */

// --- IMPORTS ---

// SpringApplication: This is the class that actually LAUNCHES the Spring Boot application.
// It sets up the default configuration, starts the embedded web server (Tomcat by default),
// creates the Spring "application context" (a container that holds all your beans/objects),
// and performs classpath scanning to find your controllers, services, and repositories.
import org.springframework.boot.SpringApplication;

// @SpringBootApplication: This is a SHORTCUT annotation (a label you put on a class).
// It combines THREE separate annotations into one for convenience:
//   1. @Configuration     — Tells Spring: "This class can define beans (objects managed by Spring)."
//   2. @EnableAutoConfiguration — Tells Spring: "Automatically configure things based on what
//                                  libraries are on the classpath." For example, if you have a
//                                  database driver, Spring will auto-configure a database connection.
//   3. @ComponentScan     — Tells Spring: "Scan this package and all sub-packages for classes
//                           marked with @Controller, @Service, @Repository, etc., and register
//                           them as beans (managed objects)."
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * The main entry point for the Communication Service microservice.
 *
 * @SpringBootApplication is placed on this class to tell Spring Boot:
 * "This is where the application starts. Please auto-configure everything,
 * scan for components (controllers, services, repositories), and treat this
 * class as a configuration source."
 *
 * In simpler terms, this single annotation replaces the need to write three
 * separate annotations: @Configuration, @EnableAutoConfiguration, and @ComponentScan.
 */
@SpringBootApplication
public class CommsApplication {

    /**
     * The main() method — this is where Java starts executing the program.
     *
     * WHAT IT DOES:
     * - Calls SpringApplication.run() which does ALL of the heavy lifting:
     *   1. Creates the Spring application context (the "container" for all objects).
     *   2. Scans the project for annotated classes (@Controller, @Service, @Repository, etc.).
     *   3. Reads configuration from application.properties (or application.yml).
     *   4. Starts the embedded Tomcat web server so the app can receive HTTP requests.
     *   5. Connects to the database if one is configured.
     *   6. Makes the application ready to handle API calls.
     *
     * WHY IT EXISTS:
     * Without this method, Java wouldn't know where to start running the application.
     * This is the universal entry point for any Java program.
     *
     * @param args Command-line arguments passed when starting the application.
     *             For example, you could pass "--server.port=9090" to change the port.
     *             In most cases, this is empty.
     */
    public static void main(String[] args) {
        // SpringApplication.run() launches the entire Spring Boot application.
        // The first argument (CommsApplication.class) tells Spring which class is the
        // "primary source" — i.e., the class annotated with @SpringBootApplication.
        // The second argument (args) passes along any command-line arguments.
        SpringApplication.run(CommsApplication.class, args);
    }
}
