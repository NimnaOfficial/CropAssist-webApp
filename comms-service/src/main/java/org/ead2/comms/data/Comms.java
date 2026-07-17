package org.ead2.comms.data;

/**
 * ===========================================================================================
 * FILE: Comms.java
 * ===========================================================================================
 *
 * PURPOSE:
 * This is the DATA MODEL (also called an "Entity") for the Communication Service.
 * It represents a single MESSAGE in the system — the kind of message that gets exchanged
 * between a farmer and the system/admin.
 *
 * WHAT IS AN ENTITY?
 * An entity is a Java class that maps directly to a DATABASE TABLE. Each FIELD in this
 * class corresponds to a COLUMN in the table, and each INSTANCE (object) of this class
 * corresponds to a single ROW in the table.
 *
 * Think of it like a template:
 *   - The CLASS is the structure of the table (column names and types).
 *   - Each OBJECT created from this class is one row of data in that table.
 *
 * DATABASE TABLE: "messages"
 *   | id | farmer_id | sender_role | content              | sent_at             |
 *   |----|-----------|-------------|----------------------|---------------------|
 *   | 1  | 101       | FARMER      | My crops are wilting | 2026-07-17 10:00:00 |
 *   | 2  | 101       | ADMIN       | Try more watering    | 2026-07-17 10:05:00 |
 *
 * WHY IT EXISTS:
 * Without this class, Spring Boot and JPA (Java Persistence API) wouldn't know HOW
 * to read from or write to the database. This class is the bridge between your Java
 * code and the database table.
 *
 * ===========================================================================================
 */

// --- IMPORTS ---

// jakarta.persistence.*: This imports ALL the JPA (Java Persistence API) annotations.
// JPA is a standard that tells Java how to map objects to database tables. These annotations
// include things like:
//   - @Entity: Marks a class as a database table
//   - @Table: Specifies the table name in the database
//   - @Id: Marks a field as the primary key
//   - @GeneratedValue: Tells the database to auto-generate the ID
//   - @Column: Maps a field to a specific column in the table
//   - @PrePersist: Runs a method automatically before saving to the database
// "jakarta" is the modern namespace (it used to be "javax" in older versions).
import jakarta.persistence.*;

// LocalDateTime: A Java class that represents a date AND time (e.g., 2026-07-17T10:30:00).
// We use it for the "sentAt" field to record WHEN each message was sent.
// It does NOT include timezone information — it's a "local" date-time.
import java.time.LocalDateTime;

// =====================================================================================
// @Entity:
// This annotation tells JPA: "This class represents a table in the database."
// Without this, JPA won't recognize this class and won't create or map any table for it.
// Every class that should be stored in a database MUST have @Entity.
// =====================================================================================
@Entity

// =====================================================================================
// @Table(name = "messages"):
// This specifies the EXACT NAME of the database table that this class maps to.
// Without this, JPA would use the class name ("Comms") as the table name.
// Since our database table is called "messages" (not "Comms"), we explicitly set it here.
// =====================================================================================
@Table(name = "messages")
public class Comms {

    // =====================================================================================
    // FIELD: id — The Unique Identifier (Primary Key)
    // =====================================================================================
    // Every row in a database table needs a unique identifier so the database can
    // tell rows apart. This field serves as that unique ID for each message.

    // @Id: Marks this field as the PRIMARY KEY of the table.
    // A primary key is a unique identifier for each row — no two rows can have the same ID.
    @Id

    // @GeneratedValue(strategy = GenerationType.IDENTITY):
    // Tells the database to AUTOMATICALLY generate a unique ID for each new message.
    // GenerationType.IDENTITY means the database itself handles the auto-increment
    // (e.g., 1, 2, 3, 4, ...). You don't need to set this value manually.
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    // The unique ID of this message. Set automatically by the database when saved.
    private Long id;

    // =====================================================================================
    // FIELD: farmerId — Which Farmer This Message Belongs To
    // =====================================================================================
    // @Column(name = "farmer_id", nullable = false):
    //   - name = "farmer_id": The column in the database table is called "farmer_id"
    //     (with an underscore), even though the Java field is called "farmerId" (camelCase).
    //     This annotation maps the Java name to the database column name.
    //   - nullable = false: This column CANNOT be empty (null). Every message MUST be
    //     linked to a farmer. If you try to save a message without a farmerId, the
    //     database will reject it with an error.
    @Column(name = "farmer_id", nullable = false)

    // Stores the ID of the farmer who is involved in this message/conversation.
    // This links the message to a specific farmer in the system.
    private Long farmerId;

    // =====================================================================================
    // FIELD: senderRole — Who Sent This Message
    // =====================================================================================
    // @Column(name = "sender_role", nullable = false):
    //   - name = "sender_role": Maps to the "sender_role" column in the database.
    //   - nullable = false: Every message MUST have a sender role. Can't be empty.
    @Column(name = "sender_role", nullable = false)

    // Stores WHO sent this message — for example, "FARMER" or "ADMIN".
    // This helps the frontend know whether to show the message on the left or right
    // side of a chat window, and helps the system know who authored the message.
    private String senderRole;

    // =====================================================================================
    // FIELD: content — The Actual Message Text
    // =====================================================================================
    // @Column(name = "content", nullable = false, length = 2000):
    //   - name = "content": Maps to the "content" column in the database.
    //   - nullable = false: A message MUST have some text content. Empty messages are not allowed.
    //   - length = 2000: The maximum number of characters allowed. By default, String columns
    //     are 255 characters. We set it to 2000 so users can write longer messages.
    @Column(name = "content", nullable = false, length = 2000)

    // Stores the actual text content of the message (e.g., "My crops are wilting").
    private String content;

    // =====================================================================================
    // FIELD: sentAt — When the Message Was Sent
    // =====================================================================================
    // @Column(name = "sent_at", nullable = false):
    //   - name = "sent_at": Maps to the "sent_at" column in the database.
    //   - nullable = false: Every message MUST have a timestamp. This is set automatically
    //     by the @PrePersist method below if not provided.
    @Column(name = "sent_at", nullable = false)

    // Stores the date and time when this message was sent.
    // Example value: 2026-07-17T10:30:00
    private LocalDateTime sentAt;

    // =====================================================================================
    // CONSTRUCTOR: No-Argument (Default) Constructor
    // =====================================================================================
    /**
     * Default (no-argument) constructor.
     *
     * WHY IT EXISTS:
     * JPA REQUIRES a no-argument constructor to create instances of this class.
     * When JPA reads data from the database, it first creates an empty object using
     * this constructor, and then fills in the fields using the setter methods.
     * Without this constructor, JPA would throw an error and fail to work.
     *
     * You probably won't call this constructor directly in your own code, but
     * JPA needs it behind the scenes.
     */
    public Comms() {
    }

    // =====================================================================================
    // CONSTRUCTOR: Parameterized Constructor
    // =====================================================================================
    /**
     * Constructor that lets you create a Comms object with all the important fields set at once.
     *
     * WHY IT EXISTS:
     * This is a convenience constructor for YOUR code (not for JPA).
     * Instead of creating an empty object and calling setters one by one, you can
     * create a fully populated Comms object in a single line.
     *
     * NOTE: The "id" field is NOT included here because the database generates it automatically.
     *
     * @param farmerId   The ID of the farmer this message belongs to.
     * @param senderRole Who sent the message (e.g., "FARMER" or "ADMIN").
     * @param content    The actual text of the message.
     * @param sentAt     The date and time the message was sent.
     */
    public Comms(Long farmerId, String senderRole, String content, LocalDateTime sentAt) {
        this.farmerId = farmerId;
        this.senderRole = senderRole;
        this.content = content;
        this.sentAt = sentAt;
    }

    // =====================================================================================
    // LIFECYCLE CALLBACK: setDefaultSentAt — Automatically Set Timestamp Before Saving
    // =====================================================================================
    /**
     * This method runs AUTOMATICALLY right before a new Comms object is saved to the database
     * for the FIRST time.
     *
     * WHAT IT DOES:
     * If the "sentAt" timestamp hasn't been set (is null), it automatically sets it to
     * the current date and time. This acts as a safety net — even if the caller forgets
     * to set a timestamp, the message will still have one.
     *
     * WHY IT EXISTS:
     * It ensures that every message always has a valid timestamp, even if the code
     * that creates the message doesn't explicitly set one. This prevents null values
     * in the "sent_at" column (which would violate the nullable=false constraint).
     */
    // @PrePersist: This is a JPA lifecycle annotation. It tells JPA:
    // "Run this method BEFORE you INSERT this object into the database for the first time."
    // It's like an automatic hook — you don't call it yourself; JPA calls it for you.
    @PrePersist
    public void setDefaultSentAt() {
        // Only set the timestamp if it hasn't already been set.
        // This check prevents overwriting a timestamp that was intentionally set.
        if (sentAt == null) {
            // LocalDateTime.now() gets the current date and time from the system clock.
            sentAt = LocalDateTime.now();
        }
    }

    // =====================================================================================
    // GETTERS AND SETTERS
    // =====================================================================================
    //
    // WHAT ARE GETTERS AND SETTERS?
    // They are methods that allow other classes to READ (get) and WRITE (set) the
    // private fields of this class.
    //
    // WHY ARE THEY NEEDED?
    // The fields above are marked as "private", which means no other class can access
    // them directly. This is called ENCAPSULATION — a fundamental principle of
    // object-oriented programming. Getters and setters provide controlled access.
    //
    // Additionally, JPA and Spring use these methods behind the scenes:
    //   - When converting a Java object to JSON (for API responses), Spring calls getters.
    //   - When converting JSON to a Java object (from API requests), Spring calls setters.
    //   - When reading from the database, JPA calls setters to fill in the fields.
    //   - When writing to the database, JPA calls getters to read the fields.
    //

    /**
     * Gets the unique ID of this message.
     * @return The auto-generated database ID.
     */
    public Long getId() {
        return id;
    }

    /**
     * Sets the unique ID of this message.
     * NOTE: You usually don't call this manually — the database sets it automatically.
     * @param id The ID to assign.
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Gets the farmer ID this message is associated with.
     * @return The farmer's ID number.
     */
    public Long getFarmerId() {
        return farmerId;
    }

    /**
     * Sets the farmer ID this message belongs to.
     * @param farmerId The farmer's ID number.
     */
    public void setFarmerId(Long farmerId) {
        this.farmerId = farmerId;
    }

    /**
     * Gets the role of who sent this message (e.g., "FARMER" or "ADMIN").
     * @return The sender's role as a string.
     */
    public String getSenderRole() {
        return senderRole;
    }

    /**
     * Sets the role of who sent this message.
     * @param senderRole The sender's role (e.g., "FARMER" or "ADMIN").
     */
    public void setSenderRole(String senderRole) {
        this.senderRole = senderRole;
    }

    /**
     * Gets the actual text content of this message.
     * @return The message text.
     */
    public String getContent() {
        return content;
    }

    /**
     * Sets the text content of this message.
     * @param content The message text (max 2000 characters).
     */
    public void setContent(String content) {
        this.content = content;
    }

    /**
     * Gets the date and time when this message was sent.
     * @return The timestamp of when the message was sent.
     */
    public LocalDateTime getSentAt() {
        return sentAt;
    }

    /**
     * Sets the date and time when this message was sent.
     * @param sentAt The timestamp to assign (e.g., LocalDateTime.now()).
     */
    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
}
