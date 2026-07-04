package org.ead2.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * The main entry point for the API Gateway microservice.
 * This service sits in front of all other microservices (like user-service) and routes 
 * incoming requests to the appropriate backend service based on the URL path.
 * @SpringBootApplication encapsulates @Configuration, @EnableAutoConfiguration, and @ComponentScan.
 */
@SpringBootApplication
public class GatewayApplication {
    
    /**
     * The main method which starts the embedded server and initializes the Spring application context.
     */
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
