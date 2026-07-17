/**
 * =========================================================================================
 * FILE: CropService.java
 * =========================================================================================
 *
 * PURPOSE:
 *   This is the SERVICE layer — it contains all the BUSINESS LOGIC for crop operations.
 *   It sits between the Controller (which receives HTTP requests) and the Repository
 *   (which talks to the database). The service is where the "thinking" happens.
 *
 * WHY IT EXISTS:
 *   In a well-structured Spring Boot application, code is organized into layers:
 *     1. Controller → Handles HTTP requests (the "front door").
 *     2. Service    → Contains business logic (the "brain").
 *     3. Repository → Handles database access (the "storage room").
 *
 *   Separating business logic into a service layer has several benefits:
 *     - The controller stays clean and only handles request/response.
 *     - Business rules are in one place, making them easy to find and change.
 *     - The service can be reused by multiple controllers or other services.
 *     - It's easier to write unit tests for business logic when it's isolated.
 *
 * HOW IT WORKS:
 *   - The @Service annotation tells Spring to register this class as a bean (managed component).
 *   - Spring injects the CropRepository into this class via constructor injection.
 *   - Each method performs a specific business operation by calling repository methods.
 *   - The controller calls these service methods, and the service calls the repository.
 *
 * FLOW EXAMPLE (Creating a crop):
 *   User sends POST request → Controller.createCrop() → Service.createCrop() → Repository.save() → Database
 *
 * =========================================================================================
 */

// This file belongs to the "service" sub-package — it holds service classes with business logic.
package org.ead2.crop.service;

// --- IMPORTS ---

// Crop: The entity class that represents a crop record in the database.
// We need it because every method in this service works with Crop objects.
import org.ead2.crop.data.Crop;

// CropRepository: The database access layer that provides methods like save(), findAll(),
// findById(), deleteById(), etc. The service uses this to interact with the database.
import org.ead2.crop.data.CropRepository;

// @Service: A Spring annotation that marks this class as a "service" component.
// It tells Spring: "Create an instance of this class and manage it for me."
// This makes the class available for Dependency Injection — other classes (like CropController)
// can automatically receive an instance of this class without manually creating one.
// Technically, @Service is a specialization of @Component. Both do the same thing,
// but @Service communicates intent — it tells developers "this class has business logic."
import org.springframework.stereotype.Service;

// List: A Java collection interface that represents an ordered group of elements.
// We use List<Crop> to return multiple crops from the getAllCrops() method.
import java.util.List;

/**
 * CropService handles the core business logic for the Crop Service.
 *
 * It acts as the middleman between the CropController (HTTP layer) and the
 * CropRepository (database layer). All business rules and data processing
 * happen here before data is saved to or read from the database.
 */

// @Service — Tells Spring: "This class is a service component. Please create and manage
// an instance of it so it can be automatically injected into other classes that need it."
// Without this annotation, Spring wouldn't know about this class, and the CropController
// wouldn't be able to use it.
@Service

public class CropService {

    // --- FIELDS ---

    // cropRepository: A reference to the CropRepository, which handles all database operations.
    // "private" means only this class can access it directly.
    // "final" means it's set once (in the constructor) and can never be changed — this ensures
    // the service always uses the same repository instance.
    private final CropRepository cropRepository;

    /**
     * CONSTRUCTOR — Called automatically by Spring when creating the CropService.
     *
     * HOW IT WORKS:
     *   Spring uses "Constructor Injection" (a type of Dependency Injection) here.
     *   Instead of us writing: this.cropRepository = new CropRepository();  ← (wrong! can't instantiate an interface)
     *   Spring automatically finds the CropRepository bean it created and passes it in.
     *
     * WHY IT EXISTS:
     *   The service NEEDS the repository to talk to the database. Constructor injection
     *   is the recommended way in Spring Boot to wire dependencies because:
     *     - It makes the dependency explicit and obvious.
     *     - The "final" field guarantees it's always set.
     *     - It's easy to test (you can pass in a mock repository during testing).
     *
     * @param cropRepository — The CropRepository instance, automatically provided by Spring.
     */
    public CropService(CropRepository cropRepository){

        // Save the Spring-provided repository so we can use it in all our methods.
        this.cropRepository = cropRepository;

    }


    /**
     * CREATE A NEW CROP — Saves a new crop record to the database.
     *
     * WHAT IT DOES:
     *   Takes a Crop object and tells the repository to save it into the database.
     *   The repository's save() method will:
     *     1. Execute an SQL INSERT statement to add the new row.
     *     2. The database auto-generates an ID for the new crop.
     *     3. The @PrePersist hook in Crop.java sets default dates if they're null.
     *     4. Return the saved Crop object (now with the generated ID and defaults).
     *
     * @param crop — The Crop object to save (usually built from the JSON request body).
     * @return The saved Crop object with its auto-generated ID and any default values set.
     */
    public Crop createCrop(Crop crop) {
        // repository.save() inserts a new row if the crop has no ID, or updates it if it does.
        // Since this is a new crop (no ID yet), it will INSERT a new row.
        return cropRepository.save(crop);
    }

    /**
     * GET ALL CROPS — Fetches every crop record from the database.
     *
     * WHAT IT DOES:
     *   Calls the repository's findAll() method, which executes:
     *     SELECT * FROM crops;
     *   and returns all the rows as a List of Crop objects.
     *
     * @return A List containing every Crop in the database. Returns an empty list if no crops exist.
     */
    public List<Crop> getAllCrops() {
        // repository.findAll() fetches ALL rows from the "crops" table.
        return cropRepository.findAll();
    }

    /**
     * UPDATE AN EXISTING CROP — Saves changes to an existing crop in the database.
     *
     * WHAT IT DOES:
     *   Takes a Crop object (which must have an existing ID) and tells the repository to save it.
     *   Since the crop already has an ID, the repository's save() method will:
     *     - Execute an SQL UPDATE statement (not INSERT) to update the existing row.
     *
     * NOTE: This uses the same save() method as createCrop(). JPA's save() is smart:
     *   - If the object has NO ID → it does an INSERT (create new).
     *   - If the object HAS an ID → it does an UPDATE (modify existing).
     *
     * @param crop — The Crop object with updated values (must include the crop's ID).
     * @return The updated Crop object after saving to the database.
     */
    public Crop updateCrop(Crop crop) {
        // repository.save() detects that this crop has an ID and performs an UPDATE instead of INSERT.
        return cropRepository.save(crop);
    }

    /**
     * DELETE A CROP — Removes a crop record from the database by its ID.
     *
     * WHAT IT DOES:
     *   Calls the repository's deleteById() method, which executes:
     *     DELETE FROM crops WHERE id = ?;
     *   This permanently removes the crop from the database.
     *
     * NOTE: If no crop with the given ID exists, Spring Data JPA will throw an
     * EmptyResultDataAccessException. In a production app, you might want to handle
     * this gracefully by checking if the crop exists first.
     *
     * @param id — The unique ID of the crop to delete.
     */
    public void deleteCrop(Long id) {
        // repository.deleteById() deletes the row with the matching ID from the database.
        cropRepository.deleteById(id);
    }

    /**
     * UPDATE CROP STATUS — Changes only the status of a specific crop.
     *
     * WHAT IT DOES:
     *   1. Finds the crop in the database by its ID.
     *   2. If the crop doesn't exist, throws a RuntimeException with the message "Crop not found".
     *   3. Updates ONLY the status field (e.g., from SEEDLING to GROWING).
     *   4. Saves the updated crop back to the database.
     *   5. Returns the updated crop.
     *
     * WHY IT EXISTS:
     *   Sometimes you only need to change the status of a crop, not all its fields.
     *   This method provides a targeted way to do that without sending the entire crop object.
     *
     * @param id     — The unique ID of the crop whose status should be updated.
     * @param status — The new status to set (e.g., Crop.Status.GROWING).
     * @return The updated Crop object with the new status.
     * @throws RuntimeException if no crop with the given ID is found in the database.
     */
    public Crop updateCropStatus(Long id, Crop.Status status) {
        // Step 1: Find the crop by its ID in the database.
        // findById() returns an Optional<Crop> — a container that either holds a Crop or is empty.
        // .orElseThrow() says: "If the crop was found, give it to me. If not, throw this error."
        // The lambda "() -> new RuntimeException(...)" creates the error message if the crop is not found.
        Crop crop = cropRepository.findById(id).orElseThrow(() -> new RuntimeException("Crop not found"));

        // Step 2: Update only the status field of the crop.
        crop.setStatus(status);

        // Step 3: Save the modified crop back to the database and return it.
        // Since this crop already has an ID, save() will perform an UPDATE (not INSERT).
        return cropRepository.save(crop);
    }
}
