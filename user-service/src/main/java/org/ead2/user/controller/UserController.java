package org.ead2.user.controller;

import org.ead2.user.data.User;
import org.ead2.user.service.UserService;
import org.springframework.web.bind.annotation.*;

@RequestMapping(path = "/Api")
@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(path = "/user")
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @PutMapping(path = "/user")
    public User updateUser(@RequestBody User user) {
        return userService.updateUser(user);
    }
}

