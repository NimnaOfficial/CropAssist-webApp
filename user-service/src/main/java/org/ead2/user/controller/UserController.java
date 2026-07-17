package org.ead2.user.controller;

/**
 * ========================================================================================
 * FILE: UserController.java
 * ========================================================================================
 *
 * WHAT THIS FILE DOES:
 *   This is the REST API Controller — the "front door" of the backend. It receives all
 *   incoming HTTP requests from the frontend (React/Next.js), figures out what the
 *   frontend wants (create a user? delete a user? login?), and calls the appropriate
 *   method in UserService to do the actual work.
 *
 * WHY IT EXISTS:
 *   In the MVC (Model-View-Controller) pattern:
 *     - Model = the data (User.java, UserRepository.java)
 *     - View  = the frontend (React/Next.js) — what the user sees
 *     - Controller = THIS FILE — it connects the frontend to the backend logic
 *
 *   The controller does NOT contain business logic itself. It simply:
 *     1. Receives the HTTP request
 *     2. Extracts the data from the request (JSON body, URL parameters, etc.)
 *     3. Calls the appropriate service method
 *     4. Returns the result as JSON to the frontend
 *
 * HOW IT FITS IN THE PROJECT:
 *   Frontend → HTTP Request → UserController → UserService → UserRepository → Database
 *   Database → UserRepository → UserService → UserController → HTTP Response → Frontend
 *
 * WHAT IS A REST API?
 *   REST = Representational State Transfer. It's a way of building web services where:
 *     - Each URL represents a "resource" (e.g., /Api/users represents all users)
 *     - HTTP methods (GET, POST, PUT, DELETE) define what action to perform
 *     - Data is sent and received as JSON (JavaScript Object Notation)
 *
 * ========================================================================================
 */

// --- IMPORTS ---

// User: Our custom data model class that represents a user in the system.
//   We need this because our methods receive and return User objects.
import org.ead2.user.data.User;

// LoginRequest: A DTO (Data Transfer Object) that holds login credentials (email/username + password).
//   Used by the login endpoint to receive the login data from the frontend.
import org.ead2.user.dto.LoginRequest;

// UserService: The service layer class that contains all the business logic.
//   The controller delegates all actual work to this service.
import org.ead2.user.service.UserService;

// HttpStatus: An enum (a list of constants) containing all standard HTTP status codes.
//   For example: HttpStatus.OK (200), HttpStatus.UNAUTHORIZED (401), HttpStatus.NOT_FOUND (404).
//   We use it to send the correct status code back to the frontend in the login response.
import org.springframework.http.HttpStatus;

// ResponseEntity: A wrapper class that lets us customize the HTTP response we send back.
//   With ResponseEntity, we can set the response body (data), HTTP status code (200, 401, etc.),
//   and headers. We use it in the login endpoint to return different status codes
//   depending on whether login succeeds or fails.
import org.springframework.http.ResponseEntity;

// This is a "wildcard import" that brings in several Spring Web annotations at once:
//   - @RestController: Marks this class as a REST API controller
//   - @RequestMapping: Sets the base URL path for all endpoints in this class
//   - @GetMapping: Maps a method to HTTP GET requests (used for reading/fetching data)
//   - @PostMapping: Maps a method to HTTP POST requests (used for creating new data)
//   - @PutMapping: Maps a method to HTTP PUT requests (used for updating existing data)
//   - @DeleteMapping: Maps a method to HTTP DELETE requests (used for deleting data)
//   - @RequestBody: Tells Spring to read the JSON from the request body and convert it to a Java object
//   - @PathVariable: Tells Spring to extract a value from the URL path (e.g., /users/{id})
//   - @RequestParam: Tells Spring to extract a value from the URL query string (e.g., ?status=ACTIVE)
import org.springframework.web.bind.annotation.*;


// List: A Java collection type that holds an ordered list of items.
//   We use List<User> to return multiple users from the getAllUsers() endpoint.
import java.util.List;

/**
 * @RequestMapping(path = "/Api") — Sets the BASE URL path for ALL endpoints in this controller.
 *   Every endpoint URL in this class will start with "/Api".
 *   For example: /Api/users, /Api/login, /Api/users/email/{email}
 *   This helps organize the API and avoids URL conflicts with other controllers.
 */
@RequestMapping(path = "/Api") // Base URL path for all endpoints in this controller
/**
 * @RestController — This annotation does TWO things:
 *   1. Marks this class as a Spring controller that can handle HTTP requests.
 *   2. Automatically converts all return values (Java objects) to JSON format.
 *      For example, when a method returns a User object, Spring automatically
 *      converts it to JSON like: {"id": 1, "fullName": "John", "email": "john@example.com"}
 *   It's a combination of @Controller and @ResponseBody.
 */
@RestController // Marks this class as a REST API controller that automatically serializes responses to JSON
public class UserController {

    /**
     * userService — A reference to the UserService class that contains all the business logic.
     *   The controller doesn't do any real work itself — it delegates everything to this service.
     *   The "final" keyword means this field can only be set once (in the constructor) and never changed.
     */
    private final UserService userService;

    /**
     * Constructor — Creates a new UserController with the given UserService.
     *
     * WHAT IT DOES:
     *   Stores the provided UserService instance so we can use it in all our endpoint methods.
     *
     * HOW "DEPENDENCY INJECTION" WORKS:
     *   We DON'T create the UserService ourselves (no "new UserService(...)").
     *   Instead, Spring automatically creates the UserService and passes it to this constructor.
     *   This is called "Constructor Injection" — Spring "injects" (provides) the dependency.
     *   This makes the code easier to test and more flexible.
     *
     * @param userService — The UserService instance automatically provided by Spring.
     */
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * createUser() — Handles user registration (Sign Up).
     *
     * HTTP METHOD: POST
     * URL: /Api/users
     * EXAMPLE REQUEST BODY (JSON):
     *   {
     *     "fullName": "John Doe",
     *     "email": "john@example.com",
     *     "passwordHash": "myPassword123",
     *     ...
     *   }
     *
     * WHAT IT DOES:
     *   Receives a new user's details from the frontend, passes them to UserService
     *   which hashes the password and saves the user to the database, then returns
     *   the saved user (with its newly generated ID) back to the frontend.
     *
     * @PostMapping(path = "/users") — Maps this method to POST requests at /Api/users.
     *   POST is used when CREATING something new.
     *
     * @RequestBody — Tells Spring: "Take the JSON data sent in the request body and
     *   convert it into a User Java object." Spring automatically maps JSON fields
     *   to Java fields by matching their names.
     *
     * @param user — The User object created from the JSON request body.
     * @return The saved User object (now has a database-generated ID).
     */
    @PostMapping(path = "/users")
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    /**
     * updateUser() — Handles updating an existing user's profile.
     *
     * HTTP METHOD: PUT
     * URL: /Api/users
     * EXAMPLE REQUEST BODY (JSON):
     *   {
     *     "id": 5,
     *     "fullName": "John Updated",
     *     "email": "john.new@example.com",
     *     ...
     *   }
     *
     * WHAT IT DOES:
     *   Receives the updated user details (must include the user's ID so the database
     *   knows which record to update), passes them to UserService for processing,
     *   and returns the updated user back to the frontend.
     *
     * @PutMapping(path = "/users") — Maps this method to PUT requests at /Api/users.
     *   PUT is used when UPDATING something that already exists.
     *
     * @param user — The updated User object from the JSON request body (must contain the ID).
     * @return The updated User object after saving to the database.
     */
    @PutMapping(path = "/users")
    public User updateUser(@RequestBody User user) {
        return userService.updateUser(user);
    }

    /**
     * deleteUser() — Handles deleting a user from the system.
     *
     * HTTP METHOD: DELETE
     * URL: /Api/users/{id}  (e.g., /Api/users/5 to delete user with ID 5)
     *
     * WHAT IT DOES:
     *   Receives the user's ID from the URL, passes it to UserService which checks
     *   if the user exists and deletes them from the database.
     *
     * @DeleteMapping(path = "/users/{id}") — Maps this method to DELETE requests.
     *   The {id} is a placeholder — the actual ID value comes from the URL.
     *   For example, DELETE /Api/users/5 means id = 5.
     *
     * @PathVariable — Tells Spring: "Extract the value from the {id} part of the URL
     *   and put it into the 'id' parameter." So if the URL is /Api/users/5, id = 5.
     *
     * @param id — The ID of the user to delete, extracted from the URL path.
     */
    @DeleteMapping(path = "/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
    }

    /**
     * getAllUsers() — Retrieves ALL users from the database.
     *
     * HTTP METHOD: GET
     * URL: /Api/users
     *
     * WHAT IT DOES:
     *   Returns a list of every user in the database. This is typically used for
     *   an admin dashboard where the admin can see all registered users.
     *
     * @GetMapping(path = "/users") — Maps this method to GET requests at /Api/users.
     *   GET is used when READING/FETCHING data (no changes to the database).
     *
     * @return A List of all User objects in the database, automatically converted to a JSON array.
     */
    @GetMapping(path = "/users")
    public List<User> getAllUsers() {
        return userService.gettAllUsers();
    }

    /**
     * getUserByNic() — Finds a user by their National Identity Card (NIC) number.
     *
     * HTTP METHOD: GET
     * URL: /Api/users/nic/{nic}  (e.g., /Api/users/nic/200012345678)
     *
     * WHAT IT DOES:
     *   Extracts the NIC from the URL, searches the database for a user with that NIC,
     *   and returns the matching user.
     *
     * @GetMapping(path = "/users/nic/{nic}") — Maps to GET requests with the NIC in the URL.
     * @PathVariable — Extracts the {nic} value from the URL path.
     *
     * @param nic — The NIC number to search for, extracted from the URL.
     * @return The User object with the matching NIC, or null if not found.
     */
    @GetMapping(path = "/users/nic/{nic}")
    public User getUserByNic(@PathVariable String nic) {
        return userService.getUserByNIC(nic);
    }

    /**
     * getUserByEmail() — Finds a user by their email address.
     *
     * HTTP METHOD: GET
     * URL: /Api/users/email/{email}  (e.g., /Api/users/email/john@example.com)
     *
     * WHAT IT DOES:
     *   Extracts the email from the URL and searches the database for a matching user.
     *
     * @GetMapping(path = "/users/email/{email}") — Maps to GET requests with the email in the URL.
     * @PathVariable — Extracts the {email} value from the URL path.
     *
     * @param email — The email address to search for, extracted from the URL.
     * @return The User object with the matching email, or null if not found.
     */
    @GetMapping(path = "/users/email/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    /**
     * getUserByFullName() — Finds a user by their full name.
     *
     * HTTP METHOD: GET
     * URL: /Api/users/name/{fullName}  (e.g., /Api/users/name/John%20Doe)
     *
     * WHAT IT DOES:
     *   Extracts the full name from the URL and searches the database for a matching user.
     *
     * @GetMapping(path = "/users/name/{fullName}") — Maps to GET requests with the name in the URL.
     * @PathVariable — Extracts the {fullName} value from the URL path.
     *
     * @param fullName — The full name to search for, extracted from the URL.
     * @return The User object with the matching full name, or null if not found.
     */
    @GetMapping(path = "/users/name/{fullName}")
    public User getUserByFullName(@PathVariable String fullName) {
        return userService.getUserByFullName(fullName);
    }

    /**
     * updateUserStatus() — Changes a user's account status (e.g., ACTIVE, SUSPENDED, PENDING).
     *
     * HTTP METHOD: PUT
     * URL: /Api/users/{id}/status?status=ACTIVE
     *      (e.g., /Api/users/5/status?status=SUSPENDED to suspend user with ID 5)
     *
     * WHAT IT DOES:
     *   Extracts the user ID from the URL path and the new status from the query parameter,
     *   then updates that user's status in the database.
     *
     * @PutMapping(path = "/users/{id}/status") — Maps to PUT requests for status updates.
     * @PathVariable — Extracts the {id} from the URL path.
     * @RequestParam — Extracts the "status" value from the query string (the part after the ?).
     *   For example, in "?status=ACTIVE", the status parameter would be User.Status.ACTIVE.
     *   Spring automatically converts the string "ACTIVE" to the enum value User.Status.ACTIVE.
     *
     * @param id — The ID of the user whose status is being changed.
     * @param status — The new status value (PENDING, ACTIVE, INACTIVE, or SUSPENDED).
     * @return The updated User object after the status change.
     */
    @PutMapping(path = "/users/{id}/status")
    public User updateUserStatus(@PathVariable Long id, @RequestParam User.Status status) {
        return userService.updateUserStatus(id, status);
    }

    /**
     * login() — Handles user login (authentication).
     *
     * HTTP METHOD: POST
     * URL: /Api/login
     * EXAMPLE REQUEST BODY (JSON):
     *   {
     *     "emailOrUsername": "john@example.com",
     *     "password": "mySecret123"
     *   }
     *
     * WHAT IT DOES:
     *   1. Receives the login credentials from the frontend (email/username + password)
     *   2. Passes them to UserService.login() which verifies the credentials
     *   3. If login succeeds → returns HTTP 200 (OK) with the user data
     *   4. If login fails → returns HTTP 401 (Unauthorized) with an error message
     *
     * WHY WE USE ResponseEntity<?> INSTEAD OF JUST User:
     *   Because the login can either succeed (return a User) or fail (return an error message).
     *   ResponseEntity<?> lets us return DIFFERENT types of data depending on the outcome,
     *   AND lets us set the HTTP status code (200 for success, 401 for failure).
     *   The <?> means "any type" — it could be a User object or a String error message.
     *
     * @PostMapping("/login") — Maps this method to POST requests at /Api/login.
     * @RequestBody — Converts the JSON body into a LoginRequest object.
     *
     * @param loginRequest — The LoginRequest DTO containing the user's email/username and password.
     * @return ResponseEntity with either the User (200 OK) or an error message (401 Unauthorized).
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Try to authenticate the user using the provided credentials.
            // UserService.login() will throw a RuntimeException if the credentials are wrong,
            // the user doesn't exist, or the account is not active.
            User user = userService.login(loginRequest.getEmailOrUsername(), loginRequest.getPassword());

            // If we reach this line, login was successful!
            // Return HTTP 200 (OK) with the full User object as JSON in the response body.
            return ResponseEntity.ok(user); // Return 200 OK with the user data
        } catch (RuntimeException e) {
            // If UserService.login() threw an exception, it means login failed.
            // Return HTTP 401 (Unauthorized) with the error message (e.g., "Invalid credentials").
            // This tells the frontend that the login attempt was rejected.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
