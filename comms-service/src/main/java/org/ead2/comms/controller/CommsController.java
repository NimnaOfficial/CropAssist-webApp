package org.ead2.comms.controller;

import org.ead2.comms.data.Comms;
import org.ead2.comms.service.CommsService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST controller for managing communication messages.
 */
@RequestMapping(path = "/api")
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