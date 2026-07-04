package org.ead2.user.dto;

public class LoginRequest {
    private String emailOrNic;
    private String password;

    // Getters and setters
    public String getEmailOrNic() { return emailOrNic; }
    public void setEmailOrNic(String emailOrNic) { this.emailOrNic = emailOrNic; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}