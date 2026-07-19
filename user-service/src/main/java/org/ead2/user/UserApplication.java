package org.ead2.user;
import org.springframework.boot.SpringApplication;

// @SpringBootApplication: This is a shortcut annotation (see below for details).
//   Importing it lets us use the @SpringBootApplication label on our class.
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication
public class UserApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserApplication.class, args);
    }
}
