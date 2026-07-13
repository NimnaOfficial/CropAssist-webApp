package org.ead2.user.controller;

import org.ead2.user.data.User;
import org.ead2.user.dto.LoginRequest;
import org.ead2.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

/**
 * UserController handles all incoming HTTP requests related to User operations.
 * It acts as the bridge between the frontend (React/Next.js) and the backend business logic (UserService).
 */

@RequestMapping(path = "/Api") // Base URL path for all endpoints in this controller
@RestController // Marks this class as a REST API controller that automatically serializes responses to JSON
public class UserController {

    private final UserService userService;

    /**
     * Constructor injection for UserService.
     * Spring automatically provides the UserService instance when creating this controller.
     */
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Endpoint to create a new user account (Sign Up).
     * @param user The user details sent in the request body as JSON.
     * @return The saved User object with its generated ID.
     */
    @PostMapping(path = "/users")
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    /**
     * Endpoint to update an existing user's profile details.
     * @param user The updated user details.
     * @return The updated User object.
     */
    @PutMapping(path = "/users")
    public User updateUser(@RequestBody User user) {
        return userService.updateUser(user);
    }

    /**
     * Endpoint to delete a user by their ID.
     * @param id The ID of the user to delete (passed in the URL).
     */
    @DeleteMapping(path = "/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
    }

    /**
     * Endpoint to fetch all users in the system (e.g., for an admin dashboard).
     * @return A list of all User objects.
     */
    @GetMapping(path = "/users")
    public List<User> getAllUsers() {
        return userService.gettAllUsers();
    }

    /**
     * Endpoint to find a user by their National Identity Card (NIC) number.
     * @param nic The NIC passed in the URL.
     * @return The matching User object.
     */
    @GetMapping(path = "/users/nic/{nic}")
    public User getUserByNic(@PathVariable String nic) {
        return userService.getUserByNIC(nic);
    }

    /**
     * Endpoint to find a user by their email address.
     * @param email The email passed in the URL.
     * @return The matching User object.
     */
    @GetMapping(path = "/users/email/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    /**
     * Endpoint to find a user by their full name.
     * @param fullName The full name passed in the URL.
     * @return The matching User object.
     */
    @GetMapping(path = "/users/name/{fullName}")
    public User getUserByFullName(@PathVariable String fullName) {
        return userService.getUserByFullName(fullName);
    }

    /**
     * Endpoint to update a user's account status (e.g., ACTIVE, PENDING, SUSPENDED).
     * @param id The user ID.
     * @param status The new status value passed as a query parameter.
     * @return The updated User object.
     */
    @PutMapping(path = "/users/{id}/status")
    public User updateUserStatus(@PathVariable Long id, @RequestParam User.Status status) {
        return userService.updateUserStatus(id, status);
    }

    /**
     * Endpoint to handle user login.
     * @param loginRequest A DTO containing the user's email/NIC and password.
     * @return A 200 OK with the User object if successful, or a 401 UNAUTHORIZED if credentials fail.
     */
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Attempt to log the user in via the service layer
            User user = userService.login(loginRequest.getEmailOrUsername(), loginRequest.getPassword());
            return ResponseEntity.ok(user); // Return 200 OK with the user data
        } catch (RuntimeException e) {
            // If login fails, return a 401 Unauthorized status with the error message
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
