package org.ead2.crop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * The main entry point for the Crop Service microservice.
 * @SpringBootApplication encapsulates @Configuration, @EnableAutoConfiguration, and @ComponentScan.
 */
@SpringBootApplication
public class CropApplication {

    /**
     * The main method which starts the embedded Tomcat server and initializes the Spring application context.
     */
    public static void main(String[] args) {
        SpringApplication.run(CropApplication.class, args);
    }
}
