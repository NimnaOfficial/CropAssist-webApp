package org.ead2.mail.controller;

import org.ead2.mail.dto.MailRequest;
import org.ead2.mail.service.MailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing email operations.
 */
@RestController
@RequestMapping("/api/mail")
public class MailController {

    private static final Logger logger = LoggerFactory.getLogger(MailController.class);
    private final MailService mailService;

    public MailController(MailService mailService) {

        this.mailService = mailService;
    }

    /**
     * Sends an email with temporary login credentials to a user.
     *
     * @param request the details for the email including recipient and credentials
     * @return a response indicating success or failure
     */
    @PostMapping("/sendCredentials")
    public ResponseEntity<String> sendCredentials(@RequestBody MailRequest request) {
        try {
            mailService.sendTemporaryCredentials(request);
            return ResponseEntity.ok("Email sent successfully to " + request.getToEmail());
        } catch (Exception e) {
            logger.error("Failed to send email to {}: {}", request.getToEmail(), e.getMessage());
            return ResponseEntity.internalServerError().body("Failed to send email: " + e.getMessage());
        }
    }
}
