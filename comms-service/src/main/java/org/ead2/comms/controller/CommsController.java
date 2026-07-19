package org.ead2.comms.controller;
import org.ead2.comms.data.Comms;

// CommsService: This is the SERVICE layer class that contains the business logic.
// The controller doesn't do the actual work (saving to database, fetching data) —
// it delegates to CommsService. We import it here so we can call its methods.
import org.ead2.comms.service.CommsService;

// These are Spring Web annotations used to map HTTP requests to Java methods.
// The wildcard import (*) brings in all annotations from this package, including:
//   - @RestController: Marks this class as a REST API controller
//   - @RequestMapping: Sets the base URL path for all endpoints in this class
//   - @PostMapping: Maps HTTP POST requests to a method
//   - @GetMapping: Maps HTTP GET requests to a method
//   - @RequestBody: Tells Spring to convert the JSON body of a request into a Java object
//   - @PathVariable: Extracts a value from the URL path (like {farmerId})
import org.springframework.web.bind.annotation.*;

// List: A Java collection that holds an ordered group of objects.
// We use it here because some of our methods return multiple Comms (messages) at once.
// For example, getting all messages for a farmer returns a List of Comms objects.
import java.util.List;
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