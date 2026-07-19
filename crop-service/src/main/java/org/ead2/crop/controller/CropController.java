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
    private final CropService cropService;
    public CropController(CropService cropService) {
        this.cropService = cropService;
    }
    @PostMapping(path = "/crops")
    public Crop createCrop(@RequestBody Crop crop) {
        return cropService.createCrop(crop);
    }
    @GetMapping(path = "/crops")
    public List<Crop> getAllCrops(){
        return cropService.getAllCrops();
    }
    @PutMapping(path = "/crops")
    public Crop updateCrop(@RequestBody Crop crop) {
        return cropService.updateCrop(crop);
    }
    @DeleteMapping(path = "/crops/{id}")
    public void deleteCrop(@PathVariable Long id) {
        cropService.deleteCrop(id);
    }
    @PutMapping(path = "/crops/{id}/status")
    public Crop updateCropStatus(@PathVariable Long id, @RequestParam Crop.Status status) {
        return cropService.updateCropStatus(id, status);
    }
}
