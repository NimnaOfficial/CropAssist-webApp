package org.ead2.comms.service;

/**
 * ===========================================================================================
 * FILE: CommsService.java
 * ===========================================================================================
 *
 * PURPOSE:
 * This is the SERVICE LAYER — the "brain" of the Communication Service.
 * It contains the BUSINESS LOGIC — the rules and operations that define how
 * messages are processed, saved, and retrieved.
 *
 * WHAT IS A SERVICE?
 * A service sits BETWEEN the controller and the repository:
 *   Controller  →  Service  →  Repository  →  Database
 *
 * The controller receives the HTTP request, the service processes it (applies any
 * business rules), and the repository handles the actual database operation.
 *
 * WHY IT EXISTS:
 * You might wonder: "Why not just call the repository directly from the controller?"
 * The service layer exists for several important reasons:
 *   1. SEPARATION OF CONCERNS — Each layer has ONE job. The controller handles HTTP,
 *      the service handles logic, the repository handles the database.
 *   2. BUSINESS LOGIC — If you need to add validation, calculations, or extra processing
 *      (like setting timestamps), the service is where that code goes.
 *   3. REUSABILITY — Multiple controllers (or other services) can share the same service.
 *   4. TESTABILITY — You can test the business logic independently from the web layer.
 *
 * WHAT THIS SERVICE DOES:
 *   - saveMessage()          → Sets the current timestamp and saves a message to the database.
 *   - getMessagesByFarmer()  → Retrieves all messages for a specific farmer.
 *   - getAllMessages()        → Retrieves every message in the system.
 *
 * ===========================================================================================
 */

// --- IMPORTS ---

// Comms: The data model (entity) class that represents a single message.
// We import it because our service methods work with Comms objects — saving them,
// retrieving them, and returning them.
import org.ead2.comms.data.Comms;

// CommsRepository: The repository interface that provides database access.
// We import it because the service uses the repository to actually read from and
// write to the database. The service never talks to the database directly — it
// always goes through the repository.
import org.ead2.comms.data.CommsRepository;

// @Autowired: An annotation that tells Spring to automatically inject (provide)
// a dependency. When Spring sees @Autowired on a field, it looks in its container
// for a matching bean (managed object) and assigns it to that field.
// In simpler terms: "Spring, please create this object for me and plug it in here."
import org.springframework.beans.factory.annotation.Autowired;

// @Service: An annotation that tells Spring: "This class is a SERVICE — a component
// that holds business logic." It does two things:
//   1. Registers this class as a Spring bean (managed object) so other classes can use it.
//   2. Makes it clear to developers that this class belongs to the SERVICE layer.
// Technically, @Service is a specialized version of @Component — they do the same thing,
// but @Service makes the code more readable by expressing intent.
import org.springframework.stereotype.Service;

// LocalDateTime: A Java class for representing a date and time (e.g., 2026-07-17T10:30:00).
// We import it here because the saveMessage() method uses it to set the current timestamp
// on each message before saving it.
import java.time.LocalDateTime;

// List: A Java collection that holds an ordered group of objects.
// We use it here because some methods return multiple Comms (messages) at once —
// for example, all messages for a farmer, or all messages in the system.
import java.util.List;

// =====================================================================================
// @Service:
// This annotation marks this class as a Spring SERVICE component.
//
// WHAT IT DOES:
// 1. Tells Spring to automatically create an instance of this class and manage it.
//    This means you never have to write "new CommsService()" yourself.
// 2. Makes this class available for dependency injection — other classes (like the
//    controller) can ask Spring to give them a CommsService object.
// 3. Signals to developers: "This class contains business logic."
//
// WITHOUT THIS ANNOTATION:
// Spring wouldn't know this class exists, wouldn't create an instance of it,
// and the controller wouldn't be able to use it.
// =====================================================================================
@Service
public class CommsService {

    // =====================================================================================
    // FIELD: commsRepository — The Database Access Object
    // =====================================================================================
    //
    // @Autowired:
    // This annotation tells Spring: "Please find the CommsRepository bean that you
    // created and assign it to this field automatically."
    //
    // HOW IT WORKS:
    // When the application starts, Spring creates an implementation of CommsRepository
    // (remember, it's an interface — Spring generates the implementation at runtime).
    // Then, when Spring creates this CommsService object, it sees @Autowired and
    // automatically plugs in the repository instance. This is called FIELD INJECTION.
    //
    // NOTE: Constructor injection (like in CommsController) is generally preferred over
    // field injection because it makes dependencies explicit and the class easier to test.
    // Both approaches work, though.
    // =====================================================================================
    @Autowired
    private CommsRepository commsRepository;

    // =====================================================================================
    // METHOD: saveMessage — Save a New Message to the Database
    // =====================================================================================
    /**
     * Saves a new message to the database after setting the current timestamp.
     *
     * WHAT IT DOES:
     * 1. Takes the incoming message object.
     * 2. Sets the "sentAt" field to the current date and time (so we know exactly
     *    when the message was sent/saved).
     * 3. Saves the message to the database via the repository.
     * 4. Returns the saved message (which now includes the auto-generated ID
     *    assigned by the database).
     *
     * WHY SET THE TIMESTAMP HERE?
     * We don't trust the client (whoever is calling the API) to provide an accurate
     * timestamp. By setting it on the server side, we ensure the timestamp is always
     * correct and consistent, based on the server's clock.
     *
     * @param message The Comms object containing the message data (farmerId,
     *                senderRole, content). The sentAt will be overwritten.
     * @return The saved Comms object, now with a database-generated ID and
     *         the server-side timestamp.
     */
    public Comms saveMessage(Comms message) {
        // Set the "sentAt" timestamp to right now — the exact moment this message is being saved.
        // LocalDateTime.now() captures the current date and time from the server's system clock.
        message.setSentAt(LocalDateTime.now());

        // Call the repository's save() method to INSERT this message into the database.
        // The save() method is provided for free by JpaRepository — we didn't have to write it.
        // It returns the saved entity, which now includes the auto-generated ID.
        return commsRepository.save(message);
    }

    // =====================================================================================
    // METHOD: getMessagesByFarmer — Get All Messages for a Specific Farmer
    // =====================================================================================
    /**
     * Retrieves all messages associated with a specific farmer, sorted by time
     * (oldest first → newest last).
     *
     * WHAT IT DOES:
     * Calls the custom repository method that queries the database for all messages
     * where the farmer_id matches the given ID, ordered by the sent_at column ascending.
     *
     * WHY SORT BY TIME?
     * Messages are sorted chronologically so they can be displayed in a conversation
     * view (like a chat), where the oldest message appears at the top and the newest
     * at the bottom.
     *
     * @param farmerId The ID of the farmer whose messages we want to retrieve.
     * @return A list of Comms (messages) for the given farmer, in chronological order.
     *         Returns an empty list if the farmer has no messages.
     */
    public List<Comms> getMessagesByFarmer(Long farmerId) {
        // Call the custom query method we defined in CommsRepository.
        // Spring Data JPA automatically generates the SQL query from the method name:
        //   SELECT * FROM messages WHERE farmer_id = ? ORDER BY sent_at ASC
        return commsRepository.findByFarmerIdOrderBySentAtAsc(farmerId);
    }

    // =====================================================================================
    // METHOD: getAllMessages — Get Every Message in the System
    // =====================================================================================
    /**
     * Retrieves ALL messages stored in the database, regardless of which farmer
     * they belong to.
     *
     * WHAT IT DOES:
     * Calls the repository's built-in findAll() method, which executes a query like:
     *   SELECT * FROM messages
     * and returns every single row as a list of Comms objects.
     *
     * WHY IT EXISTS:
     * This is useful for:
     *   - Admin dashboards that need to see all communications
     *   - Debugging and monitoring the system
     *   - Generating reports on message activity
     *
     * @return A list of ALL Comms (messages) in the database.
     *         Returns an empty list if there are no messages at all.
     */
    public List<Comms> getAllMessages() {
        // findAll() is a built-in method from JpaRepository — we get it for free.
        // It retrieves every record from the "messages" table.
        return commsRepository.findAll();
    }
}