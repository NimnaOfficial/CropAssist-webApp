package org.ead2.mail.dto;

/**
 * Data Transfer Object representing an email request for temporary credentials.
 */
public class MailRequest {
    private String toEmail;
    private String fullName;
    private String tempUsername;
    private String tempPassword;

    public MailRequest() {}

    public MailRequest(String toEmail, String fullName, String tempUsername, String tempPassword) {
        this.toEmail = toEmail;
        this.fullName = fullName;
        this.tempUsername = tempUsername;
        this.tempPassword = tempPassword;
    }

    public String getToEmail() { return toEmail; }
    public void setToEmail(String toEmail) { this.toEmail = toEmail; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getTempUsername() { return tempUsername; }
    public void setTempUsername(String tempUsername) { this.tempUsername = tempUsername; }
    public String getTempPassword() { return tempPassword; }
    public void setTempPassword(String tempPassword) { this.tempPassword = tempPassword; }
}
