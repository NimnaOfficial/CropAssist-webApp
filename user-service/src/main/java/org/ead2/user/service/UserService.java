package org.ead2.user.service;

import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.ead2.user.data.User;
import org.ead2.user.data.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.HashMap;
import java.util.Map;

/**
 * Service layer containing business logic for user management and authentication.
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RestTemplate restTemplate;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private static final String MAIL_SERVICE_URL = "http://localhost:8084/cropmgr_app/api/mail/sendCredentials";

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, RestTemplate restTemplate) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.restTemplate = restTemplate;
    }

    /**
     * Creates a new user in the database.
     * Generates and emails temporary credentials if the user was created by a manager.
     */
    public User createUser(User user) {
        if ("pending_setup".equals(user.getPasswordHash())) {
            String tempUsername = generateTempUsername(user.getFullName(), user.getNic());
            String tempPassword = generateTempPassword(user.getFullName(), user.getNic());

            user.setUsername(tempUsername);
            user.setPasswordHash(passwordEncoder.encode(tempPassword));
            user.setMustChangePassword(true);

            User savedUser = userRepository.save(user);

            try {
                java.util.concurrent.CompletableFuture.runAsync(() -> {
                    try {
                        Map<String, String> mailRequest = new HashMap<>();
                        mailRequest.put("toEmail", user.getEmail());
                        mailRequest.put("fullName", user.getFullName());
                        mailRequest.put("tempUsername", tempUsername);
                        mailRequest.put("tempPassword", tempPassword);

                        HttpHeaders headers = new HttpHeaders();
                        headers.setContentType(MediaType.APPLICATION_JSON);
                        HttpEntity<Map<String, String>> request = new HttpEntity<>(mailRequest, headers);

                        restTemplate.postForObject(MAIL_SERVICE_URL, request, String.class);
                        logger.info("Temporary credentials email request sent to mail-service for: {}", user.getEmail());
                    } catch (Exception ex) {
                        logger.error("Failed to send credentials email via mail-service for {}: {}", user.getEmail(), ex.getMessage());
                    }
                });
            } catch (Exception e) {
                logger.error("Failed to initiate async email task for {}: {}", user.getEmail(), e.getMessage());
            }

            return savedUser;
        } else {
            user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
            user.setMustChangePassword(false);
            return userRepository.save(user);
        }
    }

    /**
     * Updates an existing user's profile details.
     * Hashes the password if a new raw password is provided.
     */
    public User updateUser(User user) {
        if (user.getPasswordHash() != null && !user.getPasswordHash().startsWith("$2a$") && !user.getPasswordHash().equals("pending_setup")) {
            user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        }
        return userRepository.save(user);
    }

    /**
     * Deletes a user from the database by their ID.
     */
    public void deleteUserById(Long id) {
        if(userRepository.existsById(id)){
            userRepository.deleteById(id);
        }
    }

    /**
     * Retrieves all users from the database.
     */
    public List<User> gettAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Finds a user by their National Identity Card (NIC) number.
     */
    public User getUserByNIC(String nic) {
        return userRepository.existsByNIC(nic);
    }

    /**
     * Finds a user by their email address.
     */
    public User getUserByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Finds a user by their full name.
     */
    public User getUserByFullName(String fullName) {
        return userRepository.existsByFullName(fullName);
    }

    /**
     * Changes a user's account status.
     */
    @Transactional
    public User updateUserStatus(Long id, User.Status status) {
        int updated = userRepository.updateUserStatus(id, status);
        if (updated == 0) {
            throw new RuntimeException("User not found with id: " + id);
        }
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found after update"));
    }

    /**
     * Authenticates a user with email/username and password.
     */
    public User login(String emailOrUsername, String rawPassword) {
        User user = this.userRepository.findByEmailOrUsername(emailOrUsername);
        if (user == null) {
            throw new RuntimeException("User not found with identifier: " + emailOrUsername);
        }
        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        if (user.getStatus() != User.Status.ACTIVE) {
            throw new RuntimeException("Account is not active");
        }
        return user;
    }

    /**
     * Changes a user's username and password.
     */
    @Transactional
    public User changeCredentials(Long id, String newUsername, String newPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        user.setUsername(newUsername);
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setMustChangePassword(false);
        user.setStatus(User.Status.ACTIVE);

        return userRepository.save(user);
    }

    private String generateTempUsername(String fullName, String nic) {
        String firstName = "user";
        if (fullName != null && !fullName.isEmpty()) {
            firstName = fullName.split(" ")[0].toLowerCase();
        }

        String nicSuffix = "0000";
        if (nic != null && nic.length() >= 4) {
            nicSuffix = nic.substring(nic.length() - 4);
        }

        return firstName + nicSuffix;
    }

    private String generateTempPassword(String fullName, String nic) {
        String namePrefix = "USR";
        if (fullName != null && fullName.length() >= 3) {
            namePrefix = fullName.substring(0, 3).toUpperCase();
        }

        String nicSuffix = "0000";
        if (nic != null && nic.length() >= 4) {
            nicSuffix = nic.substring(nic.length() - 4);
        }

        return namePrefix + "@" + nicSuffix + "!";
    }
}
