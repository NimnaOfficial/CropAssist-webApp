package org.ead2.user.dto;
public class ChangeCredentialsRequest {

    /** The ID of the user who is changing their credentials */
    private Long id;

    /** The new username the farmer chose */
    private String newUsername;

    /** The new password the farmer chose (plain text - will be hashed by the backend) */
    private String newPassword;

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNewUsername() {
        return newUsername;
    }

    public void setNewUsername(String newUsername) {
        this.newUsername = newUsername;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
