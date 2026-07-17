/**
 * =========================================================================================
 * FILE: Crop.java
 * =========================================================================================
 *
 * PURPOSE:
 *   This is the ENTITY class — it represents the "crops" table in your database.
 *   Each instance (object) of this class represents ONE ROW in that database table.
 *   Think of it as a blueprint that tells Java: "A crop has an id, a name, a farmer,
 *   a location, a status, etc."
 *
 * WHY IT EXISTS:
 *   In Spring Boot with JPA (Java Persistence API), you don't write raw SQL queries
 *   to create tables. Instead, you create a Java class like this one, add some special
 *   annotations (labels), and JPA automatically creates the database table for you.
 *   This is called ORM (Object-Relational Mapping) — it maps Java objects to database rows.
 *
 * HOW IT WORKS:
 *   - The @Entity annotation tells JPA: "This class maps to a database table."
 *   - The @Table annotation specifies the exact table name ("crops") in the database.
 *   - Each field (variable) in this class maps to a COLUMN in that table.
 *   - The @Column annotation tells JPA which column name each field maps to.
 *   - Getters and Setters allow other parts of the code to read and modify these fields.
 *   - The @PrePersist method runs automatically right before a new row is saved to the database.
 *
 * DATABASE TABLE STRUCTURE THIS CREATES:
 *   Table: "crops"
 *   Columns: id, farmer_id, name, field_location, status, health_percentage,
 *            area_size, area_unit, planted_date, expected_harvest_date, created_at
 *
 * =========================================================================================
 */

// This file belongs to the "data" sub-package — it holds data-related classes (entities, repositories).
package org.ead2.crop.data;

// --- IMPORTS ---

// jakarta.persistence.* — This imports ALL the JPA (Java Persistence API) annotations.
// JPA is the standard way to connect Java objects to database tables. These annotations include:
//   @Entity         — Marks this class as a database table representation.
//   @Table          — Specifies the table name in the database.
//   @Id             — Marks a field as the primary key (unique identifier for each row).
//   @Column         — Maps a field to a specific column name in the table.
//   @GeneratedValue — Tells the database to auto-generate the value (like auto-increment for IDs).
//   @Enumerated     — Tells JPA how to store an enum (as a string or as a number).
//   @PrePersist     — A lifecycle hook that runs code right before saving a new row to the database.
//   GenerationType  — Defines strategies for how IDs are generated (IDENTITY = auto-increment).
//   EnumType        — Defines how enums are stored (STRING = save the name, ORDINAL = save the number).
import jakarta.persistence.*;

// Timestamp: A Java class that represents a specific point in time, down to nanoseconds.
// We use it here for the "created_at" field to record exactly when a crop entry was created.
import java.sql.Timestamp;

// LocalDate: A Java class that represents a date WITHOUT a time component (just year-month-day).
// We use it for "planted_date" and "expected_harvest_date" because we only care about the date,
// not the exact time of day.
import java.time.LocalDate;

/**
 * Crop Entity class.
 * This class is mapped to the "crops" table in the database using JPA annotations.
 * It stores information about different crops managed by the farmers in the CropAssist system.
 *
 * Each Crop object holds data like:
 *   - Who owns it (farmerId)
 *   - What crop it is (name)
 *   - Where it's planted (fieldLocation)
 *   - What stage it's in (status: SEEDLING, GROWING, MATURE, HARVESTING, APPROVED)
 *   - How healthy it is (healthPercentage: 0–100)
 *   - How big the planted area is (areaSize + areaUnit)
 *   - When it was planted and when harvest is expected
 */

// @Entity — Tells JPA: "This class represents a table in the database."
// Without this, JPA wouldn't know to create a table for this class.
// Every entity class MUST have this annotation.
@Entity

// @Table(name = "crops") — Specifies the EXACT name of the database table.
// Without this, JPA would use the class name ("Crop") as the table name.
// By adding this, we explicitly say: "Use the table called 'crops' (lowercase, plural)."
@Table(name = "crops")
public class Crop {

    /**
     * Enum for tracking the current growth stage/status of the crop.
     *
     * An "enum" (short for "enumeration") is a special type in Java that represents
     * a FIXED SET of possible values. Instead of using random strings like "growing" or "Growing",
     * an enum ensures only these exact values can be used:
     *
     *   SEEDLING   — The crop has just been planted and is a young seedling.
     *   GROWING    — The crop is actively growing in the field.
     *   MATURE     — The crop has fully grown and is ready or near-ready for harvest.
     *   HARVESTING — The crop is currently being harvested.
     *   APPROVED   — The crop (or harvest) has been reviewed and approved.
     *
     * WHY USE AN ENUM:
     *   It prevents typos and invalid values. You can't accidentally set a crop's status
     *   to "Grwoing" or "active" — only the values listed here are allowed.
     */
    public enum Status {
        SEEDLING, GROWING, MATURE, HARVESTING, APPROVED
    }

    // ======================
    // FIELDS (Database Columns)
    // ======================
    // Each field below maps to a column in the "crops" database table.
    // "private" means only this class can directly access these fields.
    // Other classes must use the getter/setter methods to read or change them.

    /**
     * The unique identifier (primary key) for each crop in the database.
     * This value is auto-generated by the database — you don't need to set it manually.
     * Example values: 1, 2, 3, 4, ...
     */
    // @Id — Marks this field as the PRIMARY KEY of the database table.
    // A primary key uniquely identifies each row. No two crops can have the same id.
    @Id

    // @Column(name = "id") — Maps this Java field to the database column named "id".
    @Column(name = "id")

    // @GeneratedValue(strategy = GenerationType.IDENTITY) — Tells the database to auto-generate
    // this value using its auto-increment feature. Each new crop gets the next number automatically.
    // GenerationType.IDENTITY means the DATABASE (not JPA) is responsible for generating the ID.
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The ID of the farmer (user) who owns this crop.
     * This acts as a foreign key — it links this crop to a specific farmer in another table/service.
     * Example: If farmerId = 5, it means the farmer with ID 5 owns this crop.
     */
    // @Column(name = "farmer_id") — Maps this field to the "farmer_id" column in the database.
    @Column(name = "farmer_id")
    private Long farmerId;

    /**
     * The name of the crop (e.g., "Rice", "Wheat", "Tomato", "Corn").
     */
    // @Column(name = "name") — Maps this field to the "name" column in the database.
    @Column(name = "name")
    private String name;

    /**
     * The physical location of the field where this crop is planted.
     * Example: "North Field", "Plot B - Section 3", "GPS: 7.8731° N, 80.7718° E"
     */
    // @Column(name = "field_location") — Maps this field to the "field_location" column.
    @Column(name = "field_location")
    private String fieldLocation;

    /**
     * The current growth stage/status of the crop.
     * Uses the Status enum defined above (SEEDLING, GROWING, MATURE, HARVESTING, APPROVED).
     */
    // @Enumerated(EnumType.STRING) — Tells JPA to store the enum as a STRING in the database.
    // This means the database will store "GROWING", "MATURE", etc. as text.
    // The alternative (EnumType.ORDINAL) would store numbers (0, 1, 2...), which is harder to read
    // and can break if you reorder the enum values later.
    @Enumerated(EnumType.STRING)

    // @Column(name = "status") — Maps this field to the "status" column in the database.
    @Column(name = "status")
    private Status status;

    /**
     * The health percentage of the crop, from 0 to 100.
     * Example: 85 means the crop is 85% healthy.
     * A low percentage might indicate disease, pest damage, or poor conditions.
     */
    // @Column(name = "health_percentage") — Maps to the "health_percentage" column.
    @Column(name = "health_percentage")
    private int healthPercentage;

    /**
     * The size of the area where the crop is planted.
     * Example: 2.5 (meaning 2.5 of whatever unit is specified in areaUnit).
     * Uses Double (capital D) instead of double (lowercase d) to allow null values.
     */
    // @Column(name = "area_size") — Maps to the "area_size" column.
    @Column(name = "area_size")
    private Double areaSize;

    /**
     * The unit of measurement for the area size.
     * Examples: "acres", "hectares", "sq meters", "perches"
     */
    // @Column(name = "area_unit") — Maps to the "area_unit" column.
    @Column(name = "area_unit")
    private String areaUnit;

    /**
     * The date when the crop was planted in the field.
     * Uses LocalDate which stores only the date (year-month-day), not the time.
     * Example: 2026-03-15
     */
    // @Column(name = "planted_date") — Maps to the "planted_date" column.
    @Column(name = "planted_date")
    private LocalDate plantedDate;

    /**
     * The expected date when the crop will be ready for harvest.
     * Uses LocalDate (year-month-day only).
     * Example: 2026-07-20
     */
    // @Column(name = "expected_harvest_date") — Maps to the "expected_harvest_date" column.
    @Column(name = "expected_harvest_date")
    private LocalDate expectedHarvestDate;

    /**
     * The exact date and time when this crop record was created in the database.
     * Uses Timestamp for precise timing (includes hours, minutes, seconds, nanoseconds).
     * This is automatically set by the @PrePersist method (see below) when a new crop is saved.
     */
    // @Column(name = "created_at") — Maps to the "created_at" column.
    @Column(name = "created_at")
    private Timestamp createdAt;

    // ======================n
    // CONSTRUCTORS
    // ======================

    /**
     * Default (no-argument) constructor.
     *
     * WHY IT EXISTS:
     *   JPA REQUIRES every entity class to have a no-argument constructor.
     *   When JPA loads data from the database, it first creates an empty Crop object
     *   using this constructor, and then fills in the fields using the setter methods.
     *   Without this, JPA would crash with an error.
     *
     *   Also, when Spring receives JSON in an HTTP request and converts it into a Crop
     *   object, it uses this constructor first, then calls setters for each JSON field.
     */
    public Crop() {
    }

    /**
     * All-arguments constructor — creates a Crop object with ALL fields set at once.
     *
     * WHY IT EXISTS:
     *   This is a convenience constructor. Instead of creating an empty Crop and calling
     *   10 setter methods, you can create a fully populated Crop in one line.
     *   Useful in tests and when you need to quickly create Crop objects in code.
     *
     * @param id                   — The unique ID of the crop.
     * @param farmerId             — The ID of the farmer who owns this crop.
     * @param name                 — The name of the crop (e.g., "Rice").
     * @param fieldLocation        — Where the crop is planted.
     * @param status               — The current growth status (SEEDLING, GROWING, etc.).
     * @param healthPercentage     — Health of the crop from 0 to 100.
     * @param areaSize             — Size of the planted area.
     * @param areaUnit             — Unit for the area size (e.g., "acres").
     * @param plantedDate          — When the crop was planted.
     * @param expectedHarvestDate  — When the crop is expected to be harvested.
     * @param createdAt            — When this database record was created.
     */
    public Crop(Long id, Long farmerId, String name, String fieldLocation, Status status, int healthPercentage, Double areaSize, String areaUnit, LocalDate plantedDate, LocalDate expectedHarvestDate, Timestamp createdAt) {
        this.id = id;
        this.farmerId = farmerId;
        this.name = name;
        this.fieldLocation = fieldLocation;
        this.status = status;
        this.healthPercentage = healthPercentage;
        this.areaSize = areaSize;
        this.areaUnit = areaUnit;
        this.plantedDate = plantedDate;
        this.expectedHarvestDate = expectedHarvestDate;
        this.createdAt = createdAt;
    }

    // ======================
    // GETTERS AND SETTERS
    // ======================
    // Getters and Setters are standard Java methods that allow other classes to
    // READ (get) and MODIFY (set) the private fields of this class.
    //
    // WHY THEY EXIST:
    //   The fields above are "private" — they can't be accessed directly from outside this class.
    //   This is called "encapsulation" — a core concept in Object-Oriented Programming.
    //   Getters and setters provide controlled access to these fields.
    //   JPA and Jackson (JSON converter) use these methods to read and write field values.

    /**
     * Gets the unique ID of this crop.
     * @return The crop's database ID.
     */
    public Long getId() {
        return id;
    }

    /**
     * Sets the unique ID of this crop.
     * Normally you don't call this manually — the database auto-generates the ID.
     * @param id — The ID value to set.
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Gets the ID of the farmer who owns this crop.
     * @return The farmer's ID.
     */
    public Long getFarmerId() {
        return farmerId;
    }

    /**
     * Sets the farmer ID — links this crop to a specific farmer.
     * @param farmerId — The farmer's ID.
     */
    public void setFarmerId(Long farmerId) {
        this.farmerId = farmerId;
    }

    /**
     * Gets the name of the crop.
     * @return The crop name (e.g., "Rice", "Wheat").
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the name of the crop.
     * @param name — The crop name to set.
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Gets the field location where this crop is planted.
     * @return The field location string.
     */
    public String getFieldLocation() {
        return fieldLocation;
    }

    /**
     * Sets the field location where this crop is planted.
     * @param fieldLocation — The location description.
     */
    public void setFieldLocation(String fieldLocation) {
        this.fieldLocation = fieldLocation;
    }

    /**
     * Gets the current growth status of the crop.
     * @return The status enum value (SEEDLING, GROWING, MATURE, HARVESTING, or APPROVED).
     */
    public Status getStatus() {
        return status;
    }

    /**
     * Sets the growth status of the crop.
     * @param status — The new status to set.
     */
    public void setStatus(Status status) {
        this.status = status;
    }

    /**
     * Gets the health percentage of the crop (0 to 100).
     * @return The health percentage.
     */
    public int getHealthPercentage() {
        return healthPercentage;
    }

    /**
     * Sets the health percentage of the crop.
     * @param healthPercentage — A value from 0 (dead) to 100 (perfectly healthy).
     */
    public void setHealthPercentage(int healthPercentage) {
        this.healthPercentage = healthPercentage;
    }

    /**
     * Gets the size of the planted area.
     * @return The area size (e.g., 2.5).
     */
    public Double getAreaSize() {
        return areaSize;
    }

    /**
     * Sets the size of the planted area.
     * @param areaSize — The area size value.
     */
    public void setAreaSize(Double areaSize) {
        this.areaSize = areaSize;
    }

    /**
     * Gets the unit of measurement for the area.
     * @return The area unit string (e.g., "acres", "hectares").
     */
    public String getAreaUnit() {
        return areaUnit;
    }

    /**
     * Sets the unit of measurement for the area.
     * @param areaUnit — The unit string to set.
     */
    public void setAreaUnit(String areaUnit) {
        this.areaUnit = areaUnit;
    }

    /**
     * Gets the date when the crop was planted.
     * @return The planted date.
     */
    public LocalDate getPlantedDate() {
        return plantedDate;
    }

    /**
     * Sets the date when the crop was planted.
     * @param plantedDate — The date to set.
     */
    public void setPlantedDate(LocalDate plantedDate) {
        this.plantedDate = plantedDate;
    }

    /**
     * Gets the expected harvest date.
     * @return The expected harvest date.
     */
    public LocalDate getExpectedHarvestDate() {
        return expectedHarvestDate;
    }

    /**
     * Sets the expected harvest date.
     * @param expectedHarvestDate — The date to set.
     */
    public void setExpectedHarvestDate(LocalDate expectedHarvestDate) {
        this.expectedHarvestDate = expectedHarvestDate;
    }

    /**
     * Gets the timestamp of when this crop record was created in the database.
     * @return The creation timestamp.
     */
    public Timestamp getCreatedAt() {
        return createdAt;
    }

    /**
     * Sets the creation timestamp.
     * Normally you don't call this — the @PrePersist method sets it automatically.
     * @param createdAt — The timestamp to set.
     */
    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    // ======================
    // JPA LIFECYCLE HOOK
    // ======================

    /**
     * JPA Lifecycle Hook — runs automatically BEFORE a new crop is saved to the database.
     *
     * WHAT IT DOES:
     *   Sets default values for fields that weren't provided by the user:
     *   - If plantedDate is not set → defaults to today's date.
     *   - If expectedHarvestDate is not set → defaults to today's date.
     *   - If createdAt is not set → defaults to the current date and time.
     *
     * WHY IT EXISTS:
     *   This ensures that every crop saved to the database always has these date fields filled in,
     *   even if the user didn't provide them. This prevents null values in important columns
     *   and ensures data consistency.
     *
     * WHEN IT RUNS:
     *   JPA calls this method automatically right BEFORE executing the SQL INSERT statement.
     *   You never need to call this method manually — JPA handles it for you.
     */
    // @PrePersist — This annotation tells JPA: "Run this method just BEFORE inserting a new row
    // into the database." It's like a "before save" hook. It only runs for NEW records (INSERT),
    // not for updates (UPDATE). For updates, you would use @PreUpdate instead.
    @PrePersist
    protected void onCreate() {
        // If the user didn't provide a planted date, set it to today's date.
        if (this.plantedDate == null) {
            this.plantedDate = LocalDate.now();  // LocalDate.now() gets today's date (e.g., 2026-07-17)
        }
        // If the user didn't provide an expected harvest date, set it to today's date.
        if (this.expectedHarvestDate == null) {
            this.expectedHarvestDate = LocalDate.now();
        }
        // If the creation timestamp wasn't set, set it to the current moment.
        if (this.createdAt == null) {
            // System.currentTimeMillis() returns the current time in milliseconds since January 1, 1970.
            // We wrap it in a Timestamp object so it can be stored in the database.
            this.createdAt = new Timestamp(System.currentTimeMillis());
        }
    }
}
