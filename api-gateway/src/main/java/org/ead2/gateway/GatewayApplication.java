package org.ead2.gateway;
import org.springframework.boot.SpringApplication;

// @SpringBootApplication is a special label (called an "annotation") that we put on
// our main class. It is a shortcut that combines THREE separate annotations into one:
//   1. @Configuration    — Tells Spring: "This class can define settings and beans."
//   2. @EnableAutoConfiguration — Tells Spring: "Automatically set up everything you
//                                  can figure out from the libraries on the classpath."
//   3. @ComponentScan    — Tells Spring: "Scan this package and its sub-packages to
//                          find other classes I should manage (like controllers, configs)."
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
