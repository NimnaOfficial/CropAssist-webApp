package org.ead2.crop;
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
@SpringBootApplication
public class CropApplication {
    public static void main(String[] args) {
        SpringApplication.run(CropApplication.class, args);
    }
}
