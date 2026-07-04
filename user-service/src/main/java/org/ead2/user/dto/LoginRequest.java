package org.ead2.user.dto;

/**
 * Data Transfer Object (DTO) used to receive login credentials from the frontend.
 * It encapsulates the identifier (which can be either an email or a NIC) and the password.
 */
public class LoginRequest {
    
    /** The identifier entered by the user (Email or NIC) */
    private String emailOrNic;
    
    /** The raw, unencrypted password entered by the user */
    private String password;

    // --- Getters and setters ---
    
    public String getEmailOrNic() { return emailOrNic; }
    public void setEmailOrNic(String emailOrNic) { this.emailOrNic = emailOrNic; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}