package org.ead2.user.controller;

import org.ead2.user.data.User;
import org.ead2.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RequestMapping(path="/Api")
@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping(path= "/user")
    public User createUser(@RequestBody User user){
        return userService.createUser(user);
    }
//this is just
}
