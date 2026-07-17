package org.ead2.user.dto;

/**
 * ========================================================================================
 * FILE: LoginRequest.java
 * ========================================================================================
 *
 * WHAT THIS FILE DOES:
 *   This is a DTO (Data Transfer Object) — a simple container class that carries login
 *   data from the frontend to the backend. When a user clicks "Login" on the website,
 *   the frontend sends a JSON object like this:
 *
 *     {
 *       "emailOrUsername": "john@example.com",
 *       "password": "mySecret123"
 *     }
 *
 *   Spring automatically converts that JSON into a LoginRequest object, so the backend
 *   can easily access the email/username and password using getter methods.
 *
 * WHY IT EXISTS (Why not use the User class directly?):
 *   The User class has 15+ fields (id, fullName, address, age, etc.), but for login we
 *   only need 2 fields: the identifier (email or username) and the password.
 *   Using a DTO keeps things clean and simple — we only send and receive the exact data
 *   we need, nothing more. This is also more secure because we don't accidentally expose
 *   fields like passwordHash or internal IDs.
 *
 * WHAT IS A DTO?
 *   A DTO is just a plain Java class with private fields and public getters/setters.
 *   It has NO business logic — its only job is to carry data from one place to another.
 *   Think of it as an envelope: it holds a letter (data) but doesn't read or process it.
 *
 * HOW IT FITS IN THE PROJECT:
 *   Frontend → sends JSON → Spring converts it to LoginRequest → UserController receives it
 *   → passes the values to UserService.login()
 *
 * ========================================================================================
 */
public class LoginRequest {
    
    /**
     * emailOrUsername — Stores the identifier the user typed to log in.
     *   This can be EITHER their email address (e.g., "john@example.com")
     *   OR their username (e.g., "john_farmer").
     *   We accept both to give users flexibility in how they log in.
     */
    private String emailOrUsername;
    
    /**
     * password — Stores the raw (plain-text) password the user typed.
     *   This is the password exactly as the user entered it, BEFORE any hashing.
     *   It will be compared against the hashed version stored in the database
     *   using the PasswordEncoder in UserService.
     *   IMPORTANT: This value is NEVER stored in the database — it's only used
     *   temporarily during the login check.
     */
    private String password;

    // =====================================================================================
    // GETTERS AND SETTERS
    // =====================================================================================
    //
    // Getters and setters are simple methods that let other classes read (get) or
    // change (set) the private fields above. They follow a naming convention:
    //   - getFieldName() — returns the value of the field
    //   - setFieldName(value) — changes the value of the field
    //
    // WHY DO WE NEED THEM?
    //   The fields above are "private" (only this class can access them directly).
    //   Getters and setters provide controlled access from outside the class.
    //   Spring also uses these methods to convert JSON to/from this object.
    //   Without them, Spring can't read or write the fields from JSON data.
    // =====================================================================================
    
    /** Returns the email or username the user entered for login. */
    public String getEmailOrUsername() { return emailOrUsername; }

    /** Sets the email or username (called by Spring when converting JSON to this object). */
    public void setEmailOrUsername(String emailOrUsername) { this.emailOrUsername = emailOrUsername; }
    
    /** Returns the raw password the user entered for login. */
    public String getPassword() { return password; }

    /** Sets the raw password (called by Spring when converting JSON to this object). */
    public void setPassword(String password) { this.password = password; }
}