/**
 * =========================================================================================
 * FILE: CropController.java
 * =========================================================================================
 *
 * PURPOSE:
 *   This is the CONTROLLER — it is the "front door" of the Crop Service.
 *   When someone (a browser, a mobile app, or another service) sends an HTTP request
 *   (like GET, POST, PUT, DELETE) to this application, THIS class is the first one
 *   to receive and handle that request.
 *
 * WHY IT EXISTS:
 *   In the MVC (Model-View-Controller) design pattern, the Controller's job is to:
 *     1. RECEIVE incoming HTTP requests from the outside world.
 *     2. DELEGATE the actual work to the Service layer (CropService).
 *     3. RETURN the result back to the caller as a JSON response.
 *   The controller should NOT contain business logic — it just directs traffic.
 *   Think of it like a receptionist: they take your request and pass it to the right person.
 *
 * HOW IT WORKS:
 *   - Each method in this class is mapped to a specific URL path and HTTP method.
 *   - For example, a POST request to "/api/crops" will trigger the createCrop() method.
 *   - The controller calls the CropService to do the actual work, then returns the result.
 *
 * ENDPOINTS DEFINED HERE:
 *   POST   /api/crops           → Create a new crop
 *   GET    /api/crops           → Get a list of all crops
 *   PUT    /api/crops           → Update an existing crop
 *   DELETE /api/crops/{id}      → Delete a crop by its ID
 *   PUT    /api/crops/{id}/status → Update only the status of a specific crop
 *
 * =========================================================================================
 */

// This file belongs to the "controller" sub-package inside the crop package.
package org.ead2.crop.controller;

// --- IMPORTS ---

// Crop: This is our data model class (the "shape" of a crop object).
// We need it here because the controller receives and returns Crop objects.
import org.ead2.crop.data.Crop;

// CropService: This is the service class that contains all the business logic.
// The controller delegates all the real work (saving, fetching, deleting) to this class.
import org.ead2.crop.service.CropService;

// These are Spring Web annotations used to map HTTP requests to Java methods:
// - @RestController: Marks this class as a REST API controller.
// - @RequestMapping: Sets a base URL path for all endpoints in this class.
// - @GetMapping: Maps HTTP GET requests to a method (used for reading/fetching data).
// - @PostMapping: Maps HTTP POST requests to a method (used for creating new data).
// - @PutMapping: Maps HTTP PUT requests to a method (used for updating existing data).
// - @DeleteMapping: Maps HTTP DELETE requests to a method (used for deleting data).
// - @RequestBody: Tells Spring to take the JSON body of the request and convert it into a Java object.
// - @PathVariable: Tells Spring to extract a value from the URL path (e.g., {id} in "/crops/5").
// - @RequestParam: Tells Spring to extract a value from the URL query string (e.g., ?status=GROWING).
import org.springframework.web.bind.annotation.*;

// List: A Java collection that holds multiple items in order.
// We use it here to return a list of all crops.
import java.util.List;

/**
 * CropController handles all incoming HTTP requests related to crop operations.
 * It acts as the entry point for the REST API — receiving requests, passing them
 * to the CropService for processing, and returning the results as JSON responses.
 */

// @RequestMapping(path = "/api") — This sets the BASE URL path for ALL endpoints in this controller.
// Every endpoint URL defined in this class will start with "/api".
// For example, if a method is mapped to "/crops", the full URL becomes "/api/crops".
// WHY: This is a common practice to group all API endpoints under a common prefix,
// making it easy to distinguish API routes from other routes (like web pages).
@RequestMapping(path = "/api")

// @RestController — This annotation does TWO things:
//   1. @Controller: Tells Spring "this class handles HTTP requests."
//   2. @ResponseBody: Tells Spring "automatically convert the return value of every method
//      into JSON and send it back in the HTTP response body."
// Without this, Spring wouldn't know this class is meant to handle web requests.
// WHY: In a REST API, we always want to send and receive JSON data, and this annotation
// makes that happen automatically without writing conversion code.
@RestController


public class CropController {

    // --- FIELDS (Class-level variables) ---

    // cropService: This holds a reference to the CropService object.
    // The controller uses this to call business logic methods (like saving or fetching crops).
    // "private" means only this class can access it.
    // "final" means once it's set (in the constructor), it can NEVER be changed — this ensures safety.
    // WHY: The controller should never do database work directly. It delegates to the service layer.
    private final CropService cropService;

    /**
     * CONSTRUCTOR — This is called automatically by Spring when creating the CropController.
     *
     * HOW IT WORKS:
     *   Spring uses "Constructor Injection" (a form of Dependency Injection) here.
     *   Instead of us manually creating a CropService object (like: new CropService(...)),
     *   Spring automatically finds the CropService bean it already created and passes it in.
     *
     * WHY IT EXISTS:
     *   This is how Spring "wires" components together. The controller NEEDS the service
     *   to do its job, so Spring provides it automatically. This makes the code easier to
     *   test and more flexible (you can swap out implementations without changing this class).
     *
     * @param cropService — The CropService instance, automatically provided by Spring.
     */
    public CropController(CropService cropService) {

        // "this.cropService" refers to the class field above.
        // "cropService" (without "this") refers to the parameter passed into this constructor.
        // This line saves the Spring-provided service so we can use it in all our methods.
        this.cropService = cropService;
    }

    /**
     * CREATE A NEW CROP
     *
     * HTTP Method: POST
     * URL: /api/crops
     * Request Body: A JSON object representing the new crop to create.
     *
     * WHAT IT DOES:
     *   Takes the crop data sent by the client (in JSON format), passes it to the
     *   CropService to save it in the database, and returns the saved crop (now with
     *   a generated ID and any default values set).
     *
     * EXAMPLE REQUEST:
     *   POST /api/crops
     *   Body: { "name": "Rice", "farmerId": 1, "fieldLocation": "Field A", "status": "SEEDLING" }
     *
     * EXAMPLE RESPONSE:
     *   { "id": 1, "name": "Rice", "farmerId": 1, ... }
     *
     * @param crop — The Crop object built from the JSON request body.
     * @return The saved Crop object (with auto-generated ID and defaults filled in).
     */
    // @PostMapping(path = "/crops") — Maps HTTP POST requests to the URL "/api/crops" to this method.
    // POST is the standard HTTP method used for CREATING new resources.
    @PostMapping(path = "/crops")
    // @RequestBody — Tells Spring: "Take the JSON data from the request body and convert it
    // into a Crop Java object automatically." Spring uses Jackson (a JSON library) to do this.
    public Crop createCrop(@RequestBody Crop crop) {

        // Delegate the creation work to the service layer and return the saved crop.
        return cropService.createCrop(crop);
    }

    /**
     * GET ALL CROPS
     *
     * HTTP Method: GET
     * URL: /api/crops
     *
     * WHAT IT DOES:
     *   Fetches every crop record from the database and returns them as a JSON array.
     *   No request body is needed — just call this URL.
     *
     * EXAMPLE REQUEST:
     *   GET /api/crops
     *
     * EXAMPLE RESPONSE:
     *   [ { "id": 1, "name": "Rice", ... }, { "id": 2, "name": "Wheat", ... } ]
     *
     * @return A list of all Crop objects in the database.
     */
    // @GetMapping(path = "/crops") — Maps HTTP GET requests to "/api/crops" to this method.
    // GET is the standard HTTP method used for READING/FETCHING data without modifying it.
    @GetMapping(path = "/crops")
    public List<Crop> getAllCrops(){
        // Delegate to the service layer to fetch all crops from the database.
        return cropService.getAllCrops();
    }

    /**
     * UPDATE AN EXISTING CROP
     *
     * HTTP Method: PUT
     * URL: /api/crops
     * Request Body: A JSON object with the updated crop data (must include the crop's ID).
     *
     * WHAT IT DOES:
     *   Takes the updated crop data, passes it to the service layer, which saves the
     *   changes to the database. The crop is identified by its "id" field in the JSON body.
     *
     * EXAMPLE REQUEST:
     *   PUT /api/crops
     *   Body: { "id": 1, "name": "Brown Rice", "farmerId": 1, ... }
     *
     * @param crop — The Crop object with updated values, built from the JSON request body.
     * @return The updated Crop object after saving.
     */
    // @PutMapping(path = "/crops") — Maps HTTP PUT requests to "/api/crops" to this method.
    // PUT is the standard HTTP method used for UPDATING an existing resource.
    @PutMapping(path = "/crops")
    // @RequestBody — Converts the incoming JSON body into a Crop Java object.
    public Crop updateCrop(@RequestBody Crop crop) {
        // Delegate the update work to the service layer.
        return cropService.updateCrop(crop);
    }

    /**
     * DELETE A CROP BY ID
     *
     * HTTP Method: DELETE
     * URL: /api/crops/{id}  — where {id} is the actual numeric ID of the crop to delete.
     *
     * WHAT IT DOES:
     *   Deletes the crop with the specified ID from the database.
     *   Returns nothing (void) because the resource no longer exists after deletion.
     *
     * EXAMPLE REQUEST:
     *   DELETE /api/crops/5  → Deletes the crop with ID 5.
     *
     * @param id — The unique ID of the crop to delete, extracted from the URL path.
     */
    // @DeleteMapping(path = "/crops/{id}") — Maps HTTP DELETE requests to "/api/crops/{id}".
    // The {id} is a PLACEHOLDER — it will be replaced with the actual crop ID in the URL.
    // DELETE is the standard HTTP method used for REMOVING a resource.
    @DeleteMapping(path = "/crops/{id}")
    // @PathVariable — Tells Spring: "Extract the value of {id} from the URL and put it
    // into this 'id' parameter." For example, if the URL is /api/crops/5, then id = 5.
    public void deleteCrop(@PathVariable Long id) {
        // Delegate the deletion to the service layer.
        cropService.deleteCrop(id);
    }

    /**
     * UPDATE ONLY THE STATUS OF A SPECIFIC CROP
     *
     * HTTP Method: PUT
     * URL: /api/crops/{id}/status?status=GROWING
     *   — {id} is the crop's ID in the URL path.
     *   — status is passed as a query parameter (after the "?").
     *
     * WHAT IT DOES:
     *   Finds the crop with the given ID, changes ONLY its status field (e.g., from
     *   SEEDLING to GROWING), saves it, and returns the updated crop.
     *   This is useful when you want to update just the status without sending the entire crop object.
     *
     * EXAMPLE REQUEST:
     *   PUT /api/crops/3/status?status=MATURE
     *   → Changes crop #3's status to MATURE.
     *
     * @param id     — The unique ID of the crop, extracted from the URL path.
     * @param status — The new status value, extracted from the query parameter "?status=...".
     * @return The updated Crop object with the new status.
     */
    // @PutMapping(path = "/crops/{id}/status") — Maps PUT requests to this specific URL pattern.
    // This is a more targeted endpoint — it only updates the status, not the whole crop.
    @PutMapping(path = "/crops/{id}/status")
    // @PathVariable — Extracts {id} from the URL (e.g., /crops/3/status → id = 3).
    // @RequestParam — Extracts the "status" value from the query string (e.g., ?status=GROWING).
    // Spring automatically converts the string "GROWING" into the Crop.Status enum value.
    public Crop updateCropStatus(@PathVariable Long id, @RequestParam Crop.Status status) {
        // Delegate to the service layer to find the crop, update its status, and save it.
        return cropService.updateCropStatus(id, status);
    }
}
