package org.ead2.user.dto;

/**
 * Data Transfer Object (DTO) used to receive login credentials from the frontend.
 * It encapsulates the identifier (which can be either an email or a NIC) and the password.
 */
public class LoginRequest {
    
    /** The identifier entered by the user (Email or NIC) */
    private String emailOrUsername;
    
    /** The raw, unencrypted password entered by the user */
    private String password;

    // --- Getters and setters ---
    
    public String getEmailOrUsername() { return emailOrUsername; }
    public void setEmailOrUsername(String emailOrUsername) { this.emailOrUsername = emailOrUsername; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}