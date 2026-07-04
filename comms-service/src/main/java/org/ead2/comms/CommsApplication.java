package org.ead2.comms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * The main entry point for the Communication Service microservice.
 * @SpringBootApplication encapsulates @Configuration, @EnableAutoConfiguration, and @ComponentScan.
 */
@SpringBootApplication
public class CommsApplication {
    
    /**
     * The main method which starts the embedded Tomcat server and initializes the Spring application context.
     */
    public static void main(String[] args) {
        SpringApplication.run(CommsApplication.class, args);
    }
}
