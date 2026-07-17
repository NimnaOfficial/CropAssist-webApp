package org.ead2.user.data;

/**
 * ========================================================================================
 * FILE: UserRepository.java
 * ========================================================================================
 *
 * WHAT THIS FILE DOES:
 *   This is the Repository interface — the "database helper" that provides all methods
 *   for reading, writing, updating, and deleting User data in the database.
 *   It acts as a bridge between our Java code and the database.
 *
 * WHY IT EXISTS:
 *   Without this, we'd have to write raw SQL queries manually (like
 *   "SELECT * FROM users WHERE nic = '12345'"). With a repository, we can use simple
 *   Java method calls instead, and Spring Data JPA writes the SQL for us behind the scenes.
 *
 * WHY IS IT AN INTERFACE (NOT A CLASS)?
 *   An interface is like a contract — it defines WHAT methods should exist, but not HOW
 *   they work. Spring Data JPA automatically creates a real class (at runtime) that
 *   implements this interface and fills in all the database logic.
 *   We just define the method names and Spring does the rest — it's like magic!
 *
 * WHAT DOES JpaRepository<User, Long> GIVE US FOR FREE?
 *   By extending JpaRepository, we automatically get these methods WITHOUT writing them:
 *     - save(user)         → INSERT or UPDATE a user in the database
 *     - findById(id)       → Find a user by their ID
 *     - findAll()          → Get ALL users from the database
 *     - deleteById(id)     → Delete a user by their ID
 *     - existsById(id)     → Check if a user with the given ID exists
 *     - count()            → Count how many users are in the database
 *     ... and many more!
 *   <User, Long> means: "This repository works with User objects, and the primary key type is Long."
 *
 * WHAT IS JPQL?
 *   JPQL = Java Persistence Query Language. It's like SQL, but instead of querying
 *   database TABLES and COLUMNS, you query Java CLASSES and FIELDS.
 *   For example:
 *     SQL:  "SELECT * FROM users WHERE email = 'john@example.com'"
 *     JPQL: "SELECT u FROM User u WHERE u.email = 'john@example.com'"
 *   JPQL uses the Java class name (User) and field names (email), not table/column names.
 *
 * HOW IT FITS IN THE PROJECT:
 *   UserController → UserService → UserRepository (this file) → Database
 *
 * ========================================================================================
 */

// --- IMPORTS ---

// JpaRepository: The core Spring Data JPA interface that gives us free CRUD operations.
//   CRUD = Create, Read, Update, Delete — the four basic database operations.
//   By extending this, our UserRepository inherits dozens of ready-made database methods
//   like save(), findById(), findAll(), deleteById(), count(), and more.
import org.springframework.data.jpa.repository.JpaRepository;

// @Modifying: An annotation that must be placed on JPQL queries that CHANGE data
//   (UPDATE or DELETE). Without it, Spring assumes the query is read-only (SELECT)
//   and would throw an error if the query tries to modify the database.
import org.springframework.data.jpa.repository.Modifying;

// @Query: An annotation that lets us write custom JPQL queries.
//   When the auto-generated methods from JpaRepository aren't enough,
//   we can write our own queries using this annotation.
//   The query goes inside the parentheses as a string.
import org.springframework.data.jpa.repository.Query;

// @Param: An annotation used to give NAMES to parameters in JPQL queries.
//   It connects a method parameter to a :namedParameter in the JPQL query string.
//   For example: @Param("id") Long id connects to ":id" in the query.
import org.springframework.data.repository.query.Param;

/**
 * UserRepository — The database access layer for User objects.
 *
 * "extends JpaRepository<User, Long>" means:
 *   - This repository manages "User" entities (objects)
 *   - The primary key (ID) of a User is of type "Long" (a large number)
 *   - We automatically inherit all standard CRUD methods (save, find, delete, etc.)
 *
 * We only need to define CUSTOM queries here — the standard ones are already provided.
 */
public interface UserRepository extends JpaRepository<User,Long> {

    /**
     * existsByNIC() — Finds a user in the database by their National Identity Card (NIC) number.
     *
     * WHAT THE JPQL QUERY MEANS IN PLAIN ENGLISH:
     *   "Select a User (u) from the User table where the nic field equals the value passed in."
     *   The "?1" means "the first parameter" — in this case, the 'nic' parameter.
     *
     * WHY IT EXISTS:
     *   We need to look up users by their NIC number for profile viewing or verification.
     *
     * NOTE: Despite the name "existsByNIC", this method actually RETURNS the User object
     *   (not just true/false). The name is a bit misleading but the functionality is correct.
     *
     * @Query — Tells Spring: "Don't auto-generate the query. Use this custom JPQL query instead."
     *
     * @param nic — The NIC number to search for.
     * @return The User object if found, or null if no user has that NIC.
     */
    @Query("select u from User u where u.nic=?1")
    User existsByNIC(String nic);

    /**
     * existsByEmail() — Finds a user in the database by their email address.
     *
     * WHAT THE JPQL QUERY MEANS IN PLAIN ENGLISH:
     *   "Select a User (u) from the User table where the email field equals the value passed in."
     *
     * WHY IT EXISTS:
     *   We need to look up users by email for profile viewing, validation (prevent duplicates),
     *   and login purposes.
     *
     * @param email — The email address to search for.
     * @return The User object if found, or null if no user has that email.
     */
    @Query("select u from User u where u.email=?1")
    User existsByEmail(String email);

    /**
     * existsByFullName() — Finds a user in the database by their full name.
     *
     * WHAT THE JPQL QUERY MEANS IN PLAIN ENGLISH:
     *   "Select a User (u) from the User table where the fullName field equals the value passed in."
     *
     * WHY IT EXISTS:
     *   Allows searching for users by their name, useful for admin dashboards or user lookups.
     *
     * @param fullName — The full name to search for (must match exactly).
     * @return The User object if found, or null if no user has that name.
     */
    @Query("select u from User u where u.fullName=?1")
    User existsByFullName(String fullName);

    /**
     * updateUserStatus() — Updates a user's account status directly in the database.
     *
     * WHAT THE JPQL QUERY MEANS IN PLAIN ENGLISH:
     *   "Update the User table: set the status column to the new status value
     *    WHERE the id column matches the given id."
     *
     * WHY IT EXISTS:
     *   Instead of loading the entire User object from the database, changing the status,
     *   and saving it back (3 steps), this query updates the status directly with one
     *   database operation. This is faster and more efficient.
     *
     * @Modifying — REQUIRED annotation that tells Spring: "This query CHANGES data in the
     *   database (it's an UPDATE, not a SELECT)." Without this, Spring would assume it's
     *   a read-only query and throw an error.
     *
     * @Query — The custom JPQL UPDATE query. Uses ":status" and ":id" as named parameters
     *   (connected to the method parameters via @Param annotations).
     *
     * @Param("id") — Connects the method parameter "id" to the ":id" placeholder in the JPQL query.
     * @Param("status") — Connects the method parameter "status" to the ":status" placeholder.
     *
     * @param id — The ID of the user whose status we want to change.
     * @param status — The new status value (PENDING, ACTIVE, INACTIVE, or SUSPENDED).
     * @return The number of rows updated: 1 if the user was found and updated, 0 if not found.
     */
    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.id = :id")
    int updateUserStatus(@Param("id") Long id, @Param("status") User.Status status);


    /**
     * findByEmailOrUsername() — Finds a user by either their email address OR their username.
     *
     * WHAT THE JPQL QUERY MEANS IN PLAIN ENGLISH:
     *   "Select a User from the User table WHERE the email field matches the given identifier
     *    OR the username field matches the given identifier."
     *   The same "identifier" value is checked against BOTH the email and username columns.
     *
     * WHY IT EXISTS:
     *   This is primarily used during LOGIN. When a user types their login identifier,
     *   they might type their email ("john@example.com") or their username ("john_farmer").
     *   This query checks both columns with a single database call, so it works either way.
     *
     * @Param("identifier") — Connects the method parameter to the ":identifier" placeholder
     *   in the JPQL query. The same value is used for both the email and username comparison.
     *
     * @param identifier — The string to search for (could be either an email or a username).
     * @return The User object if a match is found in either the email or username column,
     *         or null if no match is found.
     */
    @Query("SELECT u FROM User u WHERE u.email = :identifier OR u.username = :identifier")
    User findByEmailOrUsername(@Param("identifier") String identifier);
}
