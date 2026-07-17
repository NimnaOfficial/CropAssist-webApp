/**
 * =========================================================================================
 * FILE: CropRepository.java
 * =========================================================================================
 *
 * PURPOSE:
 *   This is the REPOSITORY — it is the "database access layer" for the Crop entity.
 *   It provides all the methods needed to interact with the "crops" table in the database
 *   (save, find, update, delete) WITHOUT you having to write a single line of SQL.
 *
 * WHY IT EXISTS:
 *   Instead of writing raw SQL queries like "SELECT * FROM crops WHERE id = 5",
 *   Spring Data JPA lets you create an interface that EXTENDS JpaRepository.
 *   By doing this, Spring automatically generates the implementation code for you.
 *   You get all common database operations for FREE — no code to write!
 *
 * HOW IT WORKS:
 *   - This is an INTERFACE, not a class. An interface is like a contract — it defines
 *     WHAT methods should exist, but doesn't provide the actual code.
 *   - By extending JpaRepository<Crop, Long>, Spring Data JPA automatically creates a
 *     concrete class (at runtime) that implements all these methods for you.
 *   - Spring also automatically registers this as a Spring "bean" (component), so it can
 *     be injected into other classes (like CropService) using Dependency Injection.
 *
 * METHODS YOU GET FOR FREE (inherited from JpaRepository):
 *   - save(Crop crop)             → Saves a new crop or updates an existing one.
 *   - findById(Long id)           → Finds a crop by its ID (returns Optional<Crop>).
 *   - findAll()                   → Returns a list of ALL crops in the database.
 *   - deleteById(Long id)         → Deletes a crop by its ID.
 *   - count()                     → Returns the total number of crops in the database.
 *   - existsById(Long id)         → Checks if a crop with the given ID exists.
 *   ... and many more!
 *
 * ADDING CUSTOM QUERIES:
 *   If you need custom queries in the future, you can add method signatures here and
 *   Spring will auto-generate the SQL. For example:
 *     List<Crop> findByFarmerId(Long farmerId);  → Spring auto-generates: SELECT * FROM crops WHERE farmer_id = ?
 *     List<Crop> findByStatus(Crop.Status status); → SELECT * FROM crops WHERE status = ?
 *
 * =========================================================================================
 */

// This file belongs to the "data" sub-package — it holds data-related classes (entities, repositories).
package org.ead2.crop.data;

// --- IMPORTS ---

// JpaRepository: This is a Spring Data JPA interface that provides a COMPLETE set of
// database operations (CRUD: Create, Read, Update, Delete) out of the box.
// By extending this interface, you inherit dozens of ready-to-use database methods
// without writing any implementation code. Spring generates all the SQL for you.
//
// It takes TWO type parameters:
//   1. Crop — The entity class (which database table this repository works with).
//   2. Long — The type of the primary key (the "id" field in the Crop class is a Long).
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * CropRepository is the database access layer for the Crop entity.
 *
 * By extending JpaRepository<Crop, Long>, this interface automatically inherits
 * all standard database operations (save, findById, findAll, delete, etc.)
 * without needing to write any implementation code.
 *
 * Spring Data JPA generates the actual implementation at runtime — you just define
 * the interface, and Spring does all the heavy lifting behind the scenes.
 *
 * NOTE: You don't need @Repository annotation here because JpaRepository interfaces
 * are automatically detected and registered by Spring Data JPA.
 *
 * GENERIC TYPES EXPLAINED:
 *   - Crop: The entity type this repository manages (maps to the "crops" table).
 *   - Long: The data type of the primary key (the "id" field in Crop is of type Long).
 */
public interface CropRepository extends JpaRepository<Crop,Long> {

    // This interface is intentionally empty!
    // All the basic CRUD methods are inherited from JpaRepository.
    //
    // You can add custom query methods here in the future. For example:
    //
    //   List<Crop> findByFarmerId(Long farmerId);
    //   → Spring will auto-generate: SELECT * FROM crops WHERE farmer_id = ?
    //
    //   List<Crop> findByStatus(Crop.Status status);
    //   → Spring will auto-generate: SELECT * FROM crops WHERE status = ?
    //
    //   List<Crop> findByNameContaining(String keyword);
    //   → Spring will auto-generate: SELECT * FROM crops WHERE name LIKE '%keyword%'

}
