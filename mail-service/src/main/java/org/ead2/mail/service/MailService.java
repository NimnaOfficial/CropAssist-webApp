package org.ead2.mail.service;

import org.ead2.mail.dto.MailRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service for handling email dispatch logic.
 */
@Service
public class MailService {

    private static final Logger logger = LoggerFactory.getLogger(MailService.class);
    private final JavaMailSender mailSender;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Sends an email containing temporary credentials to the specified user.
     *
     * @param request the request containing recipient details and temporary credentials
     */
    public void sendTemporaryCredentials(MailRequest request) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(request.getToEmail());
        message.setSubject("Welcome to CropAssist - Your Temporary Login Credentials");

        String body = "Dear " + request.getFullName() + ",\n\n"
                + "Welcome to CropAssist! Your manager has created an account for you.\n\n"
                + "Here are your temporary login credentials:\n\n"
                + "    Username: " + request.getTempUsername() + "\n"
                + "    Password: " + request.getTempPassword() + "\n\n"
                + "IMPORTANT: You MUST change your username and password when you first log in.\n"
                + "You will not be able to use the system until you set your own credentials.\n\n"
                + "Login at: http://localhost:3000/login\n\n"
                + "Best regards,\n"
                + "CropAssist Management Team";

        message.setText(body);
        mailSender.send(message);

        logger.info("Temporary credentials email sent successfully to: {}", request.getToEmail());
    }
}
