package org.ead2.user.controller;

import org.ead2.user.data.User;
import org.ead2.user.service.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigInteger;
import java.util.List;

@RequestMapping(path = "/Api")
@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(path = "/users")
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @PutMapping(path = "/users")
    public User updateUser(@RequestBody User user) {
        return userService.updateUser(user);
    }

    @DeleteMapping(path = "/users/{id}")
    public void deleteUser(@PathVariable BigInteger id) {
        userService.deleteUserById(id);
    }

    @GetMapping(path = "/users")
    public List<User> getAllUsers() {
        return userService.gettAllUsers();
    }
}

