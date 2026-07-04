package org.ead2.user.controller;

import org.ead2.user.data.User;
import org.ead2.user.service.UserService;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@CrossOrigin(origins = "*")
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
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
    }

    @GetMapping(path = "/users")
    public List<User> getAllUsers() {
        return userService.gettAllUsers();
    }

    @GetMapping(path = "/users/nic/{nic}")
    public User getUserByNic(@PathVariable String nic) {
        return userService.getUserByNIC(nic);
    }

    @GetMapping(path = "/users/email/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    @GetMapping(path = "/users/name/{fullName}")
    public User getUserByFullName(@PathVariable String fullName) {
        return userService.getUserByFullName(fullName);
    }
    @PutMapping("/users/{id}/status")
    public User updateUserStatus(@PathVariable Long id, @RequestParam User.Status status) {
        return userService.updateUserStatus(id, status);
    }
}

