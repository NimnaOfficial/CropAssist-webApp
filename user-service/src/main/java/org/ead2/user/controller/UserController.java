package org.ead2.user.controller;
import org.ead2.user.data.User;
import org.ead2.user.dto.ChangeCredentialsRequest;
import org.ead2.user.dto.LoginRequest;
import org.ead2.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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
    @PutMapping(path = "/users/{id}/status")
    public User updateUserStatus(@PathVariable Long id, @RequestParam User.Status status) {
        return userService.updateUserStatus(id, status);
    }

    @PutMapping(path = "/users/changeCredentials")
    public ResponseEntity<?> changeCredentials(@RequestBody ChangeCredentialsRequest request) {
        try {
            User updatedUser = userService.changeCredentials(
                    request.getId(),
                    request.getNewUsername(),
                    request.getNewPassword()
            );
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.login(loginRequest.getEmailOrUsername(), loginRequest.getPassword());
            return ResponseEntity.ok(user); // Return 200 OK with the user data
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
