package org.ead2.comms;
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
@SpringBootApplication
public class CommsApplication {
    public static void main(String[] args) {
        SpringApplication.run(CommsApplication.class, args);
    }
}
