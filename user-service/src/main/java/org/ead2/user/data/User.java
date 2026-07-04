package org.ead2.user.data;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * User Entity class representing the "users" table in the database.
 * This class maps Java fields to SQL columns using JPA (Hibernate) annotations.
 */
@Entity
@Table(name = "users")
public class User {

    /**
     * Enum for tracking the current account status.
     */
    public enum Status {
        PENDING, ACTIVE, INACTIVE, SUSPENDED
    }

    /** Primary Key, auto-incremented by the database */
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "username")
    private String username;

    @Column(name = "email")
    private String email;

    @Column(name = "nic")
    private String nic;

    /** Securely hashed password, mapped to the password_hash column */
    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "phone")
    private String phone;

    @Column(name = "address")
    private String address;

    @Column(name = "age")
    private Integer age;

    @Column(name = "farming_type")
    private String farmingType;

    @Column(name = "team_size")
    private Integer teamSize;

    @Column(name = "role")
    private String role;

    /** 
     * Enum mapped as a string in the database. 
     * e.g. "ACTIVE" instead of 1.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /** Default constructor required by JPA */
    public User() {
    }

    /** All-args constructor */
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

    // --- Getters and Setters ---

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
     * JPA Lifecycle Hook.
     * Automatically sets createdAt and updatedAt timestamps right before inserting a new row into the DB.
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * JPA Lifecycle Hook.
     * Automatically updates the updatedAt timestamp right before updating an existing row in the DB.
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
