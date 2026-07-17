package org.ead2.user.data;

/**
 * ========================================================================================
 * FILE: User.java
 * ========================================================================================
 *
 * WHAT THIS FILE DOES:
 *   This is the Entity class (also called a Model) that represents the "users" table in
 *   the database. Each instance of this class represents ONE ROW in the "users" table.
 *   Each field in this class represents ONE COLUMN in that table.
 *
 * WHY IT EXISTS:
 *   In Java, we work with objects (like User). In the database, data is stored in tables
 *   with rows and columns. We need a way to bridge these two worlds. That's what JPA
 *   (Java Persistence API) does — it automatically maps Java objects to database tables.
 *
 *   For example:
 *     - The User Java class ↔ the "users" database table
 *     - The "fullName" Java field ↔ the "full_name" database column
 *     - A User object with id=1 ↔ the row in the "users" table where id=1
 *
 * WHAT IS JPA / HIBERNATE?
 *   JPA = Java Persistence API — a set of rules (specification) for how Java should
 *         interact with databases.
 *   Hibernate = the most popular tool that IMPLEMENTS those JPA rules.
 *   Together, they let us save, read, update, and delete data from the database
 *   using Java objects instead of writing raw SQL queries.
 *
 * HOW IT FITS IN THE PROJECT:
 *   UserController → UserService → UserRepository → User (this class) ↔ Database Table
 *
 * ========================================================================================
 */

// --- IMPORTS ---

// jakarta.persistence.* — This is a "wildcard import" that brings in ALL JPA annotations.
//   These annotations tell JPA how to map this Java class to a database table.
//   The key annotations from this package used in this file are:
//     - @Entity: Marks this class as a database table
//     - @Table: Specifies the exact table name in the database
//     - @Id: Marks a field as the primary key (unique identifier for each row)
//     - @Column: Maps a Java field to a specific column name in the table
//     - @GeneratedValue: Tells the database to auto-generate this field's value (like auto-increment)
//     - @Enumerated: Tells JPA how to store enum values (as text or numbers)
//     - @PrePersist: A lifecycle hook — runs a method BEFORE inserting a new row
//     - @PreUpdate: A lifecycle hook — runs a method BEFORE updating an existing row
import jakarta.persistence.*;

// LocalDateTime: A Java class that represents a date AND time (e.g., "2025-07-17T14:30:00").
//   Used for the createdAt and updatedAt fields to record when a user was created or last modified.
//   Unlike the old Date class, LocalDateTime is modern, thread-safe, and easier to use.
import java.time.LocalDateTime;

/**
 * @Entity — Tells JPA/Hibernate: "This Java class represents a table in the database."
 *   Every instance (object) of this class corresponds to one row in the database table.
 *   Without this annotation, JPA would treat this as a regular Java class and ignore it.
 */
@Entity
/**
 * @Table(name = "users") — Specifies which database table this class maps to.
 *   Here, it maps to a table called "users" in the database.
 *   If we didn't use @Table, JPA would use the class name ("User") as the table name,
 *   but "user" is a reserved word in some databases (like PostgreSQL), so we use "users" instead.
 */
@Table(name = "users")
public class User {

    /**
     * Status — An enum (a fixed set of possible values) for tracking the user's account status.
     *
     * WHAT EACH STATUS MEANS:
     *   - PENDING:   The user has registered but hasn't been approved yet (e.g., waiting for admin approval).
     *   - ACTIVE:    The user's account is active and they can log in and use the system.
     *   - INACTIVE:  The user's account has been deactivated (maybe they haven't logged in for a long time).
     *   - SUSPENDED: The user's account has been suspended by an admin (e.g., for violating rules).
     *
     * WHY USE AN ENUM?
     *   Enums prevent invalid values. Instead of storing any random string like "actve" (typo),
     *   we can ONLY use the 4 values defined here. This makes the code safer and more reliable.
     */
    public enum Status {
        PENDING, ACTIVE, INACTIVE, SUSPENDED
    }

    /**
     * id — The primary key (unique identifier) for each user in the database.
     *   Every row in the "users" table has a unique id (e.g., 1, 2, 3, ...).
     *   Maps to the "id" column in the database.
     *
     * @Id — Marks this field as the PRIMARY KEY of the table.
     *   A primary key is a unique identifier for each row — no two users can have the same id.
     *
     * @Column(name = "id") — Maps this Java field to the "id" column in the database table.
     *
     * @GeneratedValue(strategy = GenerationType.IDENTITY) — Tells the database to
     *   AUTO-GENERATE the id value. Each new user gets the next available number.
     *   For example: first user gets id=1, second gets id=2, third gets id=3, etc.
     *   GenerationType.IDENTITY means the database itself handles the numbering (auto-increment).
     */
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * fullName — The user's full name (e.g., "John Doe").
     * Maps to the "full_name" column in the database.
     *
     * @Column(name = "full_name") — Maps this Java field (fullName) to a database column
     *   with a DIFFERENT name (full_name). Java uses camelCase, databases typically use snake_case.
     */
    @Column(name = "full_name")
    private String fullName;

    /**
     * username — The user's chosen username for logging in (e.g., "john_farmer").
     * Maps to the "username" column in the database.
     */
    @Column(name = "username")
    private String username;

    /**
     * email — The user's email address (e.g., "john@example.com").
     * Maps to the "email" column in the database.
     * Used for login (users can log in with either email or username).
     */
    @Column(name = "email")
    private String email;

    /**
     * nic — The user's National Identity Card number.
     * Maps to the "nic" column in the database.
     * This is a unique identifier specific to Sri Lankan citizens.
     */
    @Column(name = "nic")
    private String nic;

    /**
     * passwordHash — The user's password AFTER it has been hashed (scrambled) by BCrypt.
     * Maps to the "password_hash" column in the database.
     *
     * IMPORTANT: This field NEVER stores the actual plain-text password.
     *   During registration, the raw password is hashed by BCrypt (in UserService)
     *   and the hash is stored here. For example:
     *     Raw password: "myPassword123"
     *     Stored hash:  "$2a$10$N9qo8uLOickgx2ZMRZoMye..."
     *   The hash CANNOT be converted back to the original password.
     */
    @Column(name = "password_hash")
    private String passwordHash;

    /**
     * phone — The user's phone number (e.g., "+94771234567").
     * Maps to the "phone" column in the database.
     */
    @Column(name = "phone")
    private String phone;

    /**
     * address — The user's physical/mailing address.
     * Maps to the "address" column in the database.
     */
    @Column(name = "address")
    private String address;

    /**
     * age — The user's age (as a whole number).
     * Maps to the "age" column in the database.
     * We use Integer (object) instead of int (primitive) so it can be null
     * (in case the user hasn't provided their age).
     */
    @Column(name = "age")
    private Integer age;

    /**
     * farmingType — The type of farming the user practices (e.g., "Rice", "Vegetables", "Mixed").
     * Maps to the "farming_type" column in the database.
     * This is specific to the CropAssist application which is designed for farmers.
     */
    @Column(name = "farming_type")
    private String farmingType;

    /**
     * teamSize — The number of people on the user's farming team.
     * Maps to the "team_size" column in the database.
     * Can be null if the user works alone or hasn't specified.
     */
    @Column(name = "team_size")
    private Integer teamSize;

    /**
     * role — The user's role in the system (e.g., "farmer", "admin", "expert").
     * Maps to the "role" column in the database.
     * Used to control what parts of the app the user can access.
     */
    @Column(name = "role")
    private String role;

    /**
     * status — The current account status of the user (PENDING, ACTIVE, INACTIVE, or SUSPENDED).
     * Maps to the "status" column in the database.
     *
     * @Enumerated(EnumType.STRING) — Tells JPA to store the enum as a TEXT STRING in the database.
     *   Without this, JPA would store it as a number (0, 1, 2, 3), which is hard to read.
     *   With EnumType.STRING, the database column stores readable values like "ACTIVE", "PENDING", etc.
     *   For example: instead of storing 1, it stores "ACTIVE".
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    /**
     * createdAt — The date and time when this user account was first created.
     * Maps to the "created_at" column in the database.
     * Automatically set by the onCreate() lifecycle hook (see below) when a new user is saved.
     */
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /**
     * updatedAt — The date and time when this user account was last modified.
     * Maps to the "updated_at" column in the database.
     * Automatically updated by the onUpdate() lifecycle hook (see below) whenever the user is edited.
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Default (no-argument) constructor.
     *
     * WHY IT EXISTS:
     *   JPA/Hibernate REQUIRES a no-argument constructor to create User objects internally.
     *   When JPA reads data from the database, it first creates an empty User object using
     *   this constructor, then fills in the fields one by one. Without this constructor,
     *   JPA would throw an error and the application would crash.
     */
    public User() {
    }

    /**
     * All-arguments constructor — Creates a User with ALL fields pre-filled.
     *
     * WHY IT EXISTS:
     *   Provides a convenient way to create a fully-populated User object in one line,
     *   without having to call each setter method individually. This is useful in tests
     *   and when you need to create a complete User object programmatically.
     *
     * @param id           — The unique identifier (usually auto-generated by the database).
     * @param fullName     — The user's full name.
     * @param username     — The user's chosen username.
     * @param email        — The user's email address.
     * @param nic          — The user's National Identity Card number.
     * @param passwordHash — The BCrypt-hashed password.
     * @param phone        — The user's phone number.
     * @param address      — The user's address.
     * @param age          — The user's age.
     * @param farmingType  — The type of farming they do.
     * @param teamSize     — The size of their farming team.
     * @param role         — Their role in the system (e.g., "farmer", "admin").
     * @param status       — Their account status (PENDING, ACTIVE, INACTIVE, SUSPENDED).
     * @param createdAt    — When the account was created.
     * @param updatedAt    — When the account was last updated.
     */
    public User(Long id, String fullName, String username, String email, String nic, String passwordHash, String phone, String address, Integer age, String farmingType, Integer teamSize, String role, Status status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.fullName = fullName;
        this.username = username;
        this.email = email;
        this.nic = nic;
        this.passwordHash = passwordHash;
        this.phone = phone;
        this.address = address;
        this.age = age;
        this.farmingType = farmingType;
        this.teamSize = teamSize;
        this.role = role;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // =====================================================================================
    // GETTERS AND SETTERS
    // =====================================================================================
    //
    // Getters and setters are simple methods that let other classes read (get) or
    // change (set) the private fields above. They follow a naming convention:
    //   - getFieldName() — returns the value of the field
    //   - setFieldName(value) — changes the value of the field
    //
    // WHY DO WE NEED THEM?
    //   All fields are "private" (only this class can access them directly).
    //   Getters and setters provide controlled access from outside the class.
    //   JPA and Spring also use these methods to read/write field values when
    //   converting between Java objects and database rows, or between Java objects and JSON.
    //
    // Each getter/setter pair below corresponds to one of the fields defined above.
    // =====================================================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNic() {
        return nic;
    }

    public void setNic(String nic) {
        this.nic = nic;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getFarmingType() {
        return farmingType;
    }

    public void setFarmingType(String farmingType) {
        this.farmingType = farmingType;
    }

    public Integer getTeamSize() {
        return teamSize;
    }

    public void setTeamSize(Integer teamSize) {
        this.teamSize = teamSize;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    /**
     * onCreate() — A JPA lifecycle hook that runs automatically BEFORE a new user is
     *   saved to the database for the FIRST time.
     *
     * WHAT IT DOES:
     *   Sets both the "createdAt" and "updatedAt" timestamps to the current date and time.
     *   This way, we don't need to manually set these timestamps — JPA does it for us.
     *
     * WHEN IT RUNS:
     *   Only when a NEW row is being INSERTED into the database (not on updates).
     *
     * @PrePersist — This annotation tells JPA: "Call this method automatically right BEFORE
     *   you insert a new row into the database." Think of it as an automatic setup step.
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * onUpdate() — A JPA lifecycle hook that runs automatically BEFORE an existing user
     *   record is updated in the database.
     *
     * WHAT IT DOES:
     *   Updates the "updatedAt" timestamp to the current date and time.
     *   This lets us track when a user's data was last changed.
     *
     * WHEN IT RUNS:
     *   Only when an EXISTING row is being UPDATED in the database (not on new inserts).
     *
     * @PreUpdate — This annotation tells JPA: "Call this method automatically right BEFORE
     *   you update an existing row in the database." The createdAt stays the same
     *   (it records when the user first registered), but updatedAt changes to "now".
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
