package org.ead2.user.service;

/**
 * ========================================================================================
 * FILE: UserService.java
 * ========================================================================================
 *
 * WHAT THIS FILE DOES:
 *   This is the Service layer — the "brain" of the application that contains all the
 *   business logic. Business logic means the RULES and DECISIONS of how the app works.
 *   For example: "hash the password before saving", "check if the user exists before deleting",
 *   "verify the password during login".
 *
 * WHY IT EXISTS:
 *   The three-layer architecture pattern separates concerns:
 *     - Controller layer (UserController) → Handles HTTP requests/responses
 *     - Service layer (THIS FILE)        → Contains business logic and rules
 *     - Repository layer (UserRepository) → Handles database operations
 *
 *   Why not put everything in the Controller?
 *     Because separating logic makes the code:
 *     1. Easier to read and understand
 *     2. Easier to test (you can test business logic without needing HTTP)
 *     3. Reusable (multiple controllers can use the same service)
 *     4. Easier to maintain (changes to business rules only affect this file)
 *
 * HOW IT FITS IN THE PROJECT:
 *   UserController → UserService (this file) → UserRepository → Database
 *   The controller calls the service, the service applies business rules,
 *   then calls the repository to interact with the database.
 *
 * ========================================================================================
 */

// --- IMPORTS ---

// @Transactional: An annotation that wraps a method in a database transaction.
//   A transaction means: "Either ALL the database operations in this method succeed together,
//   or NONE of them happen." This prevents partial updates that could leave the database
//   in a broken state. If anything goes wrong, all changes are rolled back (undone).
import jakarta.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// User: Our custom data model class representing a user. Needed because this service
//   creates, reads, updates, and returns User objects.
import org.ead2.user.data.User;

// UserRepository: The database access layer. This service uses it to save, find,
//   update, and delete users in the database.
import org.ead2.user.data.UserRepository;

// PasswordEncoder: An interface (contract) for password hashing tools.
//   We use it to:
//     1. encode() — Hash (scramble) a plain-text password before storing it
//     2. matches() — Check if a plain-text password matches a stored hash during login
//   The actual implementation is BCryptPasswordEncoder (created in AppConfig.java).
import org.springframework.security.crypto.password.PasswordEncoder;

// @Service: An annotation that marks this class as a Spring "service" component.
//   It tells Spring: "Create an instance of this class and keep it ready for injection."
import org.springframework.stereotype.Service;

// List: A Java collection that holds an ordered list of items.
//   Used here to return a list of all users from gettAllUsers().
import java.util.List;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.HashMap;
import java.util.Map;
/**
 *  @Service — Tells Spring: "This class is a SERVICE — it contains business logic."
 *   When Spring starts up, it automatically creates ONE instance of this class and
 *   stores it in its container. Whenever another class (like UserController) needs
 *   a UserService, Spring provides this instance automatically (dependency injection).
 *
 *   @Service is a specialized version of @Component. It works the same way but makes
 *   the code more readable — anyone reading the code immediately knows this class
 *   contains business logic (not database logic or HTTP handling).
 */
@Service
public class UserService {


    /**
     * userRepository — A reference to the database helper (UserRepository).
     *   This is used to save, find, update, and delete users in the database.
     *   "final" means this value is set once in the constructor and never changes.
     */
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RestTemplate restTemplate;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    // The URL of the mail-service endpoint for sending credentials emails
    // mail-service runs on port 8084 with context path /cropmgr_app
    private static final String MAIL_SERVICE_URL = "http://localhost:8084/cropmgr_app/api/mail/send-credentials";

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, RestTemplate restTemplate) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.restTemplate = restTemplate;
    }

    /**
     * Creates a new user in the database.
     * If the password is "pending_setup" (meaning a manager created this user),
     * we auto-generate temporary credentials and send them via email.
     * If the user signed up themselves, we just hash their chosen password normally.
     */
    public User createUser(User user) {
        // Check if this user was created by a manager (password will be "pending_setup")
        if ("pending_setup".equals(user.getPasswordHash())) {
            // Generate a temporary username from the user's name and NIC
            String tempUsername = generateTempUsername(user.getFullName(), user.getNic());
            // Generate a temporary password from the user's name and NIC
            String tempPassword = generateTempPassword(user.getFullName(), user.getNic());

            // Set the generated username
            user.setUsername(tempUsername);
            // Hash the temporary password before saving to the database
            user.setPasswordHash(passwordEncoder.encode(tempPassword));
            // Mark that this user MUST change their credentials on first login
            user.setMustChangePassword(true);

            // Save the user to the database first
            User savedUser = userRepository.save(user);

            // Try to send the temporary credentials via the mail-service microservice
            try {
                // Build the request body that the mail-service expects
                Map<String, String> mailRequest = new HashMap<>();
                mailRequest.put("toEmail", user.getEmail());
                mailRequest.put("fullName", user.getFullName());
                mailRequest.put("tempUsername", tempUsername);
                mailRequest.put("tempPassword", tempPassword);

                // Set the Content-Type header to JSON
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                // Create the HTTP request with body and headers
                HttpEntity<Map<String, String>> request = new HttpEntity<>(mailRequest, headers);

                // Send a POST request to the mail-service
                restTemplate.postForObject(MAIL_SERVICE_URL, request, String.class);

                logger.info("Temporary credentials email request sent to mail-service for: {}", user.getEmail());
            } catch (Exception e) {
                // If mail-service is down or fails, log it but don't crash - the user is already created
                logger.error("Failed to send credentials email via mail-service for {}: {}", user.getEmail(), e.getMessage());
            }

            return savedUser;
        } else {
            // Normal signup flow - user provided their own password
            user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
            user.setMustChangePassword(false);
            return userRepository.save(user);
        }
    }

    /**
     * updateUser() — Updates an existing user's profile details.
     *
     * WHAT IT DOES:
     *   1. Checks if a new raw password was provided (needs hashing)
     *   2. If yes, hashes the new password before saving
     *   3. If no (password is already hashed or is a special placeholder), keeps it as-is
     *   4. Saves the updated user to the database
     *
     * THE PASSWORD CHECK LOGIC:
     *   When the frontend sends an update, the passwordHash field could contain:
     *     a) A new raw password (e.g., "newPassword456") → Needs to be hashed before saving
     *     b) An existing BCrypt hash (e.g., "$2a$10$...") → Already hashed, don't hash again!
     *     c) The string "pending_setup" → Special placeholder, don't hash it
     *     d) null → No password change, skip hashing
     *
     * @param user — The updated User object from the frontend.
     * @return The updated User object after saving to the database.
     */
    public User updateUser(User user) {
        // Check if we need to hash the password:
        //   - user.getPasswordHash() != null → A password value was provided (not empty)
        //   - !user.getPasswordHash().startsWith("$2a$") → It does NOT start with "$2a$"
        //     (BCrypt hashes always start with "$2a$", so if it starts with that, it's already hashed)
        //   - !user.getPasswordHash().equals("pending_setup") → It's not the special placeholder string
        // If ALL three conditions are true, it means we have a new raw password that needs hashing.
        if (user.getPasswordHash() != null && !user.getPasswordHash().startsWith("$2a$") && !user.getPasswordHash().equals("pending_setup")) {
            // Hash the new raw password with BCrypt before saving
            user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        }
        // Save the user to the database (this is an UPDATE because the user already has an ID)
        return userRepository.save(user);
    }

    /**
     * deleteUserById() — Deletes a user from the database by their ID.
     *
     * WHAT IT DOES:
     *   1. First checks if a user with the given ID exists in the database
     *   2. If they exist, deletes them
     *   3. If they don't exist, does nothing (silently ignores the request)
     *
     * WHY WE CHECK FIRST:
     *   Calling deleteById() on an ID that doesn't exist could throw an error in some
     *   configurations. Checking first prevents unnecessary errors.
     *
     * @param id — The ID of the user to delete.
     */
    public void deleteUserById(Long id) {
        // existsById() returns true if a user with this ID exists, false otherwise
        if(userRepository.existsById(id)){
            // Only delete if the user actually exists in the database
            userRepository.deleteById(id);
        }
    }

    /**
     * gettAllUsers() — Retrieves ALL users from the database.
     *
     * WHAT IT DOES:
     *   Calls the repository's findAll() method (inherited from JpaRepository)
     *   to fetch every user record from the "users" table.
     *
     * WHY IT EXISTS:
     *   Used for admin dashboards where an admin needs to see all registered users.
     *
     * NOTE: The method name has a typo ("gett" instead of "get"), but it works fine.
     *   Renaming it would break the controller that calls it.
     *
     * @return A List of all User objects from the database.
     */
    public List<User> gettAllUsers() {
        return userRepository.findAll();
    }

    /**
     * getUserByNIC() — Finds a user by their National Identity Card (NIC) number.
     *
     * WHAT IT DOES:
     *   Calls the custom repository query to search for a user with the given NIC.
     *
     * @param nic — The NIC number to search for.
     * @return The User object if found, or null if no user has that NIC.
     */
    public User getUserByNIC(String nic) {
        return userRepository.existsByNIC(nic);
    }

    /**
     * getUserByEmail() — Finds a user by their email address.
     *
     * WHAT IT DOES:
     *   Calls the custom repository query to search for a user with the given email.
     *
     * @param email — The email address to search for.
     * @return The User object if found, or null if no user has that email.
     */
    public User getUserByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * getUserByFullName() — Finds a user by their full name.
     *
     * WHAT IT DOES:
     *   Calls the custom repository query to search for a user with the given full name.
     *
     * @param fullName — The full name to search for (must match exactly).
     * @return The User object if found, or null if no user has that name.
     */
    public User getUserByFullName(String fullName) {
        return userRepository.existsByFullName(fullName);
    }

    /**
     * updateUserStatus() — Changes a user's account status (e.g., ACTIVE → SUSPENDED).
     *
     * WHAT IT DOES:
     *   1. Runs the custom UPDATE query to change the user's status in the database
     *   2. Checks if the update actually affected a row (i.e., the user exists)
     *   3. If no rows were updated (user not found), throws an error
     *   4. If successful, fetches and returns the updated user
     *
     * @Transactional — REQUIRED for this method because it runs a custom @Modifying query.
     *   A transaction ensures that:
     *     1. The UPDATE query and the subsequent findById() are treated as one unit
     *     2. If anything goes wrong, all changes are rolled back (undone)
     *     3. Spring Data JPA requires @Transactional for any @Modifying query
     *   Without @Transactional, the @Modifying query would throw an error.
     *
     * @param id     — The ID of the user whose status is being changed.
     * @param status — The new status value (PENDING, ACTIVE, INACTIVE, or SUSPENDED).
     * @return The updated User object after the status change.
     * @throws RuntimeException if no user is found with the given ID.
     */
    @Transactional
    public User updateUserStatus(Long id, User.Status status) {
        // Run the custom UPDATE query. Returns the number of rows affected.
        // If the user exists, this returns 1. If not found, returns 0.
        int updated = userRepository.updateUserStatus(id, status);
        if (updated == 0) {
            // No rows were updated, meaning no user with this ID exists
            throw new RuntimeException("User not found with id: " + id);
        }
        // The status was updated successfully. Now fetch the complete updated user
        // from the database to return it. findById() returns an Optional (a wrapper
        // that might or might not contain a value), so we use orElseThrow() to
        // either get the user or throw an error if somehow they disappeared.
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found after update"));
    }

    /**
     * login() — Authenticates a user (checks if their login credentials are correct).
     *
     * WHAT IT DOES (step by step):
     *   1. Searches for a user by their email OR username
     *   2. If no user is found → throws "User not found" error
     *   3. Compares the typed password with the stored BCrypt hash
     *   4. If the password doesn't match → throws "Invalid credentials" error
     *   5. Checks if the user's account status is ACTIVE
     *   6. If the account is not active → throws "Account is not active" error
     *   7. If everything passes → returns the User object (login successful!)
     *
     * HOW PASSWORD COMPARISON WORKS:
     *   We use passwordEncoder.matches(rawPassword, storedHash) which:
     *     1. Takes the raw password the user typed (e.g., "myPassword123")
     *     2. Takes the BCrypt hash stored in the database (e.g., "$2a$10$N9qo8uL...")
     *     3. Hashes the raw password using the same salt from the stored hash
     *     4. Compares the two hashes — if they match, the password is correct
     *   We NEVER decrypt the stored hash. We only compare hashes.
     *
     * @param emailOrUsername — The identifier the user typed (could be email or username).
     * @param rawPassword    — The plain-text password the user typed.
     * @return The authenticated User object if all checks pass.
     * @throws RuntimeException if the user is not found, password is wrong, or account is not active.
     */
    public User login(String emailOrUsername
            , String rawPassword) {

        // STEP 1: Try to find a user with the given email or username
        if (this.userRepository.findByEmailOrUsername(emailOrUsername) == null) {
            // No user found with this email/username — login fails
            throw new RuntimeException("User not found with identifier: " + emailOrUsername);
        }
        // STEP 2: Compare the typed password with the stored BCrypt hash
        // passwordEncoder.matches() returns true if the raw password matches the hash, false otherwise
        if (!passwordEncoder.matches(rawPassword, this.userRepository.findByEmailOrUsername(emailOrUsername).getPasswordHash())) {
            // The password the user typed doesn't match what's stored — login fails
            throw new RuntimeException("Invalid credentials");
        }
        // STEP 3: Check if the user's account is ACTIVE (not PENDING, INACTIVE, or SUSPENDED)
        if (this.userRepository.findByEmailOrUsername(emailOrUsername).getStatus() != User.Status.ACTIVE) {
            // The account exists and password is correct, but the account is not active
            throw new RuntimeException("Account is not active");
        }
        // All checks passed! Return the user object (login successful)
        return this.userRepository.findByEmailOrUsername(emailOrUsername);   // or return a JWT token if you plan to use it
    }

    /**
     * Changes a user's username and password.
     * This is called when a farmer logs in for the first time with temporary credentials
     * and is forced to set their own username and password.
     */
    @Transactional
    public User changeCredentials(Long id, String newUsername, String newPassword) {
        // Find the user by their ID
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Update the username to the farmer's chosen one
        user.setUsername(newUsername);
        // Hash the new password with BCrypt before saving
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        // Remove the forced password change flag so they can use the app normally
        user.setMustChangePassword(false);
        // Activate the account since they've now set up their credentials
        user.setStatus(User.Status.ACTIVE);

        return userRepository.save(user);
    }

    /**
     * Generates a temporary username from the user's name and NIC.
     * Example: fullName="Nimna Sandanayake", NIC="200012345678" → "nimna5678"
     */
    private String generateTempUsername(String fullName, String nic) {
        // Take the first name and make it lowercase
        String firstName = "user";
        if (fullName != null && !fullName.isEmpty()) {
            firstName = fullName.split(" ")[0].toLowerCase();
        }

        // Take the last 4 characters of the NIC
        String nicSuffix = "0000";
        if (nic != null && nic.length() >= 4) {
            nicSuffix = nic.substring(nic.length() - 4);
        }

        return firstName + nicSuffix;
    }

    /**
     * Generates a temporary password from the user's name and NIC.
     * Example: fullName="Nimna Sandanayake", NIC="200012345678" → "NIM@5678!"
     */
    private String generateTempPassword(String fullName, String nic) {
        // Take the first 3 characters of the name in UPPERCASE
        String namePrefix = "USR";
        if (fullName != null && fullName.length() >= 3) {
            namePrefix = fullName.substring(0, 3).toUpperCase();
        }

        // Take the last 4 characters of the NIC
        String nicSuffix = "0000";
        if (nic != null && nic.length() >= 4) {
            nicSuffix = nic.substring(nic.length() - 4);
        }

        return namePrefix + "@" + nicSuffix + "!";
    }

}
