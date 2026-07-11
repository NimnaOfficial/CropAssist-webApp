package org.ead2.comms.controller;

import org.ead2.comms.data.Comms;
import org.ead2.comms.service.CommsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:3000")
public class CommsController {

    @Autowired
    private CommsService commsService;

    @PostMapping
    public Comms sendMessage(@RequestBody Comms message) {
        return commsService.saveMessage(message);
    }

    @GetMapping("/{farmerId}")
    public List<Comms> getMessages(@PathVariable Long farmerId) {
        return commsService.getMessagesByFarmer(farmerId);
    }
}