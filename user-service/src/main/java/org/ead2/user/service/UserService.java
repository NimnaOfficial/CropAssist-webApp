package org.ead2.user.service;

import jakarta.transaction.Transactional;
import org.ead2.user.data.User;
import org.ead2.user.data.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * UserService handles the core business logic for user management.
 * It interacts with the UserRepository for database operations and PasswordEncoder for security.
 */
@Service
public class UserService {


    private final UserRepository userRepository;


    private final PasswordEncoder passwordEncoder ;   // <-- add this

    /**
     * Constructor injection for UserRepository and PasswordEncoder.
     */
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder ){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;

    }

    /**
     * Creates a new user in the database.
     * Before saving, the user's raw password is encrypted securely using BCrypt.
     * @param user The user object containing plain-text password.
     * @return The saved User object with encrypted password and generated ID.
     */
    public User createUser(User user) {
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));

        return userRepository.save(user);
    }

    /**
     * Updates an existing user's details.
     * Only encrypts the password if a new raw password is provided (it checks if it is not already a BCrypt hash starting with "$2a$").
     * @param user The updated user details.
     * @return The updated User object.
     */
    public User updateUser(User user) {
        if (user.getPasswordHash() != null && !user.getPasswordHash().startsWith("$2a$") && !user.getPasswordHash().equals("pending_setup")) {
            user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        }
        return userRepository.save(user);
    }

    /**
     * Deletes a user by their ID, checking first if they exist to prevent errors.
     * @param id The ID of the user to delete.
     */
    public void deleteUserById(Long id) {
        if(userRepository.existsById(id)){
            userRepository.deleteById(id);
        }
    }

    /**
     * Retrieves a list of all users from the database.
     * @return A List of User objects.
     */
    public List<User> gettAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Retrieves a user by their National Identity Card (NIC).
     * @param nic The NIC to search for.
     * @return The User object if found, otherwise null.
     */
    public User getUserByNIC(String nic) {
        return userRepository.existsByNIC(nic);
    }

    /**
     * Retrieves a user by their email address.
     * @param email The email to search for.
     * @return The User object if found, otherwise null.
     */
    public User getUserByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Retrieves a user by their full name.
     * @param fullName The full name to search for.
     * @return The User object if found, otherwise null.
     */
    public User getUserByFullName(String fullName) {
        return userRepository.existsByFullName(fullName);
    }

    /**
     * Updates the status of a user (e.g., ACTIVE, SUSPENDED).
     * The @Transactional annotation ensures this database operation is executed safely as a single transaction.
     * @param id The ID of the user.
     * @param status The new Status enum value.
     * @return The updated User object.
     * @throws RuntimeException if the user is not found.
     */
    @Transactional
    public User updateUserStatus(Long id, User.Status status) {
        int updated = userRepository.updateUserStatus(id, status);
        if (updated == 0) {
            throw new RuntimeException("User not found with id: " + id);
        }
        // Optionally fetch and return the updated user
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found after update"));
    }

    /**
     * Authenticates a user login attempt.
     * It searches for the user by either Email OR NIC, then securely compares the provided raw password
     * with the stored BCrypt hash in the database.
     * @param emailOrUsername The user's email or NIC.
     * @param rawPassword The plain text password entered by the user.
     * @return The authenticated User object if successful.
     * @throws RuntimeException if the user is not found, password is incorrect, or account is not active.
     */
    public User login(String emailOrUsername
            , String rawPassword) {
        this.userRepository.findByEmailOrUsername(emailOrUsername);
        if (this.userRepository.findByEmailOrUsername(emailOrUsername) == null) {
            throw new RuntimeException("User not found with identifier: " + emailOrUsername);
        }
        if (!passwordEncoder.matches(rawPassword, this.userRepository.findByEmailOrUsername(emailOrUsername).getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        // Optional: check if status is active
        if (this.userRepository.findByEmailOrUsername(emailOrUsername).getStatus() != User.Status.ACTIVE) {
            throw new RuntimeException("Account is not active");
        }
        return this.userRepository.findByEmailOrUsername(emailOrUsername);   // or return a JWT token if you plan to use it
    }
}
