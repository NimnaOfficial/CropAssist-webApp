package org.ead2.comms.controller;

/**
 * ===========================================================================================
 * FILE: CommsController.java
 * ===========================================================================================
 *
 * PURPOSE:
 * This is the CONTROLLER — the "front door" of the Communication Service.
 * When someone (a browser, a mobile app, another microservice) sends an HTTP request
 * (like GET or POST) to this service, THIS class is the first to receive it.
 *
 * It acts as a TRAFFIC DIRECTOR:
 *   - It listens for incoming HTTP requests at specific URL paths (endpoints).
 *   - It reads the data from the request (if any).
 *   - It passes the work to the Service layer (CommsService) to handle the business logic.
 *   - It sends back a response (usually JSON data) to the caller.
 *
 * WHY IT EXISTS:
 * In the "Controller → Service → Repository" design pattern, the Controller's job is
 * to handle the WEB layer. It should NOT contain business logic or talk directly to the
 * database. It simply receives requests and delegates work to the Service layer.
 *
 * ENDPOINTS PROVIDED:
 *   POST /api/comms             → Send (create) a new message
 *   GET  /api/comms/{farmerId}  → Get all messages for a specific farmer
 *   GET  /api/comms             → Get ALL messages in the system
 *
 * ===========================================================================================
 */

// --- IMPORTS ---

// Comms: This is our data model class (also called an "entity").
// It represents a single message in the system. We import it here because
// our controller methods receive and return Comms objects.
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

/**
 * CommsController handles HTTP requests for the Communication Service.
 *
 * WHAT IS A CONTROLLER?
 * A controller is the entry point for web requests. It maps URLs to Java methods.
 * When someone visits "/api/comms", Spring looks at this class to find a matching method.
 *
 * Endpoints provided:
 *   - POST   /api/comms             → Send (save) a new message
 *   - GET    /api/comms/{farmerId}  → Retrieve all messages for a specific farmer
 *   - GET    /api/comms             → Retrieve ALL messages in the system
 */

// @RequestMapping(path = "/api"):
// This annotation sets the BASE URL PATH for all endpoints in this controller.
// Every endpoint defined below will start with "/api".
// Combined with the application's context-path (set in application.properties),
// the full URL becomes something like: /cropmgr_app/api/...
@RequestMapping(path = "/api") // Base URL path — combined with context-path becomes /cropmgr_app/api

// @RestController:
// This is a combination of TWO annotations:
//   1. @Controller — Tells Spring: "This class handles web requests."
//   2. @ResponseBody — Tells Spring: "Automatically convert the return values of all
//      methods in this class to JSON format and send them back in the HTTP response body."
// Without @RestController, Spring would try to return a view/template (an HTML page)
// instead of raw data. Since we're building a REST API, we want JSON data.
@RestController
public class CommsController {

    // =====================================================================================
    // FIELD: commsService
    // =====================================================================================
    // This stores a reference to the CommsService object.
    // The controller delegates all the real work (saving messages, fetching messages)
    // to this service. The controller itself does NOT touch the database directly.
    //
    // The "final" keyword means this value is set once (in the constructor) and can
    // NEVER be changed after that. This is a good practice because it ensures the
    // service reference stays consistent throughout the controller's lifetime.
    private final CommsService commsService;

    // =====================================================================================
    // CONSTRUCTOR: CommsController(CommsService commsService)
    // =====================================================================================
    /**
     * Constructor-based Dependency Injection.
     *
     * WHAT IS DEPENDENCY INJECTION?
     * Instead of this class creating its own CommsService object (like: new CommsService()),
     * Spring automatically creates the CommsService and PASSES it into this constructor.
     * This is called "injection" because the dependency (CommsService) is injected FROM OUTSIDE.
     *
     * WHY USE IT?
     * - It makes the code easier to test (you can pass in a mock/fake service during testing).
     * - It follows the principle of "Inversion of Control" — the framework controls
     *   object creation, not your code.
     * - When a class has only ONE constructor, Spring automatically uses it for injection
     *   (no @Autowired annotation needed).
     *
     * @param commsService The service object that Spring creates and injects automatically.
     */
    public CommsController(CommsService commsService) {
        // Store the injected service so we can use it in our endpoint methods below.
        this.commsService = commsService;
    }

    // =====================================================================================
    // ENDPOINT: POST /api/comms — Send (Create) a New Message
    // =====================================================================================
    /**
     * Handles HTTP POST requests to "/api/comms".
     *
     * WHAT IT DOES:
     * Receives a new message (as JSON in the request body), saves it to the database
     * via the service layer, and returns the saved message (with its generated ID) as JSON.
     *
     * EXAMPLE REQUEST:
     * POST /cropmgr_app/api/comms
     * Body: { "farmerId": 1, "senderRole": "ADMIN", "content": "Your crop is ready." }
     *
     * EXAMPLE RESPONSE:
     * { "id": 5, "farmerId": 1, "senderRole": "ADMIN", "content": "Your crop is ready.", "sentAt": "2026-07-17T12:00:00" }
     *
     * @param message The Comms object built from the JSON in the request body.
     * @return The saved Comms object (now including the auto-generated ID and timestamp).
     */
    // @PostMapping(path = "/comms"):
    // Maps HTTP POST requests to this method. The full URL is "/api/comms"
    // (because "/api" is the base path from @RequestMapping above).
    // POST requests are typically used to CREATE new resources (in this case, a new message).
    @PostMapping(path = "/comms")
    // @RequestBody: Tells Spring to take the JSON data from the HTTP request body
    // and automatically convert it into a Comms Java object.
    // For example, JSON {"farmerId": 1, "content": "Hello"} becomes a Comms object
    // with farmerId=1 and content="Hello".
    public Comms sendMessage(@RequestBody Comms message) {
        // Delegate the saving work to the service layer and return the saved message.
        return commsService.saveMessage(message);
    }

    // =====================================================================================
    // ENDPOINT: GET /api/comms/{farmerId} — Get Messages for a Specific Farmer
    // =====================================================================================
    /**
     * Handles HTTP GET requests to "/api/comms/{farmerId}".
     *
     * WHAT IT DOES:
     * Retrieves ALL messages associated with a specific farmer, identified by their
     * farmer ID. Messages are returned sorted by time (oldest first).
     *
     * EXAMPLE REQUEST:
     * GET /cropmgr_app/api/comms/1
     *
     * EXAMPLE RESPONSE:
     * [ { "id": 1, "farmerId": 1, ... }, { "id": 3, "farmerId": 1, ... } ]
     *
     * @param farmerId The ID of the farmer whose messages we want to retrieve.
     *                 This value is extracted from the URL path.
     * @return A list of Comms objects (messages) for the given farmer.
     */
    // @GetMapping(path = "/comms/{farmerId}"):
    // Maps HTTP GET requests to this method. The {farmerId} part is a PATH VARIABLE —
    // it's a placeholder in the URL that gets replaced with an actual value.
    // For example, "/api/comms/42" means farmerId = 42.
    @GetMapping(path = "/comms/{farmerId}")
    // @PathVariable: Tells Spring to extract the value from the {farmerId} part of the URL
    // and assign it to the "farmerId" parameter of this method.
    // So if someone visits /api/comms/7, the farmerId parameter will be 7.
    public List<Comms> getMessages(@PathVariable Long farmerId) {
        // Ask the service to find all messages for this farmer and return them.
        return commsService.getMessagesByFarmer(farmerId);
    }

    // =====================================================================================
    // ENDPOINT: GET /api/comms — Get ALL Messages
    // =====================================================================================
    /**
     * Handles HTTP GET requests to "/api/comms" (with no path variable).
     *
     * WHAT IT DOES:
     * Retrieves EVERY message stored in the database, regardless of which farmer
     * they belong to. Useful for admin dashboards or debugging.
     *
     * EXAMPLE REQUEST:
     * GET /cropmgr_app/api/comms
     *
     * EXAMPLE RESPONSE:
     * [ { "id": 1, ... }, { "id": 2, ... }, { "id": 3, ... } ]
     *
     * @return A list of ALL Comms objects (messages) in the database.
     */
    // @GetMapping(path = "/comms"):
    // Maps HTTP GET requests to "/api/comms" to this method.
    // GET requests are used to RETRIEVE data without modifying anything.
    @GetMapping(path = "/comms")
    public List<Comms> getAllMessages() {
        // Ask the service to fetch every message from the database and return them all.
        return commsService.getAllMessages();
    }
}