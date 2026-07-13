package org.ead2.comms.controller;

import org.ead2.comms.data.Comms;
import org.ead2.comms.service.CommsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CommsController handles HTTP requests for the Communication Service.
 * Endpoints: send messages, retrieve messages by farmer ID.
 */
@CrossOrigin(origins = "*") // Allows the frontend to communicate with this controller from any origin
@RequestMapping(path = "/api") // Base URL path — combined with context-path becomes /cropmgr_app/api
@RestController
public class CommsController {

    private final CommsService commsService;

    public CommsController(CommsService commsService) {
        this.commsService = commsService;
    }

    @PostMapping(path = "/comms")
    public Comms sendMessage(@RequestBody Comms message) {
        return commsService.saveMessage(message);
    }

    @GetMapping(path = "/comms/{farmerId}")
    public List<Comms> getMessages(@PathVariable Long farmerId) {
        return commsService.getMessagesByFarmer(farmerId);
    }

    @GetMapping(path = "/comms")
    public List<Comms> getAllMessages() {
        return commsService.getAllMessages();
    }
}