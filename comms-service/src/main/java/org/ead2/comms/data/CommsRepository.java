package org.ead2.comms.data;

/**
 * ===========================================================================================
 * FILE: CommsRepository.java
 * ===========================================================================================
 *
 * PURPOSE:
 * This is the REPOSITORY — the "database assistant" for the Communication Service.
 * It handles ALL the direct communication with the database (reading, writing,
 * updating, deleting data). Other parts of the app (like CommsService) ask the
 * repository to do database work, and the repository handles it.
 *
 * WHAT IS A REPOSITORY?
 * A repository is like a librarian for your database. Instead of writing raw SQL
 * queries yourself (like "SELECT * FROM messages WHERE farmer_id = 1"), you just
 * call simple Java methods, and Spring Data JPA automatically generates the SQL for you.
 *
 * WHY IT EXISTS:
 * In the "Controller → Service → Repository" pattern, the Repository is the ONLY
 * layer that talks to the database. This separation keeps the code organized:
 *   - Controller handles HTTP requests
 *   - Service handles business logic
 *   - Repository handles database operations
 *
 * THE MAGIC OF SPRING DATA JPA:
 * Notice how SHORT this file is? That's because Spring Data JPA gives you a TON of
 * database operations FOR FREE just by extending JpaRepository. You don't have to
 * write ANY code for basic operations like save(), findAll(), findById(), delete(), etc.
 * Spring generates the implementations automatically at runtime.
 *
 * ===========================================================================================
 */

// --- IMPORTS ---

// JpaRepository: This is the CORE interface from Spring Data JPA that provides
// ready-made database operations. By extending it, your repository automatically gets
// methods like:
//   - save(entity)        → INSERT or UPDATE a record in the database
//   - findAll()           → SELECT * (get all records)
//   - findById(id)        → SELECT by primary key
//   - deleteById(id)      → DELETE a record by its ID
//   - count()             → COUNT the total number of records
//   - existsById(id)      → Check if a record exists
// You get ALL of these for free without writing a single line of code!
import org.springframework.data.jpa.repository.JpaRepository;

// List: A Java collection that holds an ordered group of objects.
// We use it here because our custom query method returns multiple Comms objects.
import java.util.List;

/**
 * CommsRepository — The database access layer for the "messages" table.
 *
 * WHAT IS AN INTERFACE?
 * An interface in Java is like a "contract" — it defines WHAT methods should exist,
 * but doesn't provide the actual code for them. Normally, you'd need to write a class
 * that implements the interface. BUT with Spring Data JPA, Spring automatically creates
 * the implementation for you at runtime. You never write the implementation yourself!
 *
 * WHAT DOES "extends JpaRepository<Comms, Long>" MEAN?
 *   - JpaRepository: The parent interface that provides all the built-in database methods.
 *   - Comms: The entity (data model) this repository manages. This tells JPA which
 *            database table to work with (the "messages" table, as defined in Comms.java).
 *   - Long: The data type of the primary key (the "id" field in Comms is a Long).
 *
 * WHY NO @Repository ANNOTATION?
 * You might expect to see @Repository here, but it's NOT needed! When you extend
 * JpaRepository, Spring automatically detects this interface and registers it as a
 * Spring bean (managed object). The @Repository annotation is optional and only adds
 * extra exception translation features.
 */
public interface CommsRepository extends JpaRepository<Comms, Long> {

    // =====================================================================================
    // CUSTOM QUERY METHOD: Find Messages by Farmer ID, Sorted by Time
    // =====================================================================================
    /**
     * Finds all messages that belong to a specific farmer, sorted by the time they were
     * sent (oldest first → newest last).
     *
     * HOW DOES THIS WORK WITHOUT ANY CODE?
     * This is the magic of "Query Derivation" in Spring Data JPA. Spring reads the
     * METHOD NAME and automatically generates the SQL query from it. Here's how it
     * breaks down the name:
     *
     *   findBy          → Tells Spring: "This is a SELECT query"
     *   FarmerId        → Tells Spring: "Filter WHERE farmer_id = ?" (matches the farmerId field)
     *   OrderBy         → Tells Spring: "Add an ORDER BY clause"
     *   SentAt          → Tells Spring: "Sort by the sent_at column"
     *   Asc             → Tells Spring: "Sort in ascending order" (oldest first)
     *
     * THE GENERATED SQL LOOKS SOMETHING LIKE:
     *   SELECT * FROM messages WHERE farmer_id = ? ORDER BY sent_at ASC
     *
     * You don't write this SQL anywhere — Spring generates it automatically just from
     * the method name! All you have to do is follow the naming convention.
     *
     * @param farmerId The ID of the farmer whose messages you want to retrieve.
     * @return A list of Comms (messages) for the given farmer, sorted from oldest to newest.
     */
    List<Comms> findByFarmerIdOrderBySentAtAsc(Long farmerId);

}