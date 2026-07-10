package org.ead2.crop.data;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.time.LocalDate;

/**
 * Crop Entity class.
 * This class is intended to map to a "crops" table in the database using JPA annotations (@Entity).
 * It will store information about different crops managed by the farmers.
 */

@Entity
@Table(name = "crops")
public class Crop {

    /**
     * Enum for tracking the current growth stage/status of the crop.
     */
    public enum Status {
        SEEDLING, GROWING, MATURE, HARVESTING, APPROVED
    }

    /** Primary Key, auto-incremented by the database */
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Foreign key reference to the user (farmer) who owns this crop */
    @Column(name = "farmer_id")
    private Long farmerId;

    @Column(name = "name")
    private String name;

    @Column(name = "field_location")
    private String fieldLocation;

    /** 
     * Enum mapped as a string in the database. 
     * e.g. "GROWING" instead of an integer.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "health_percentage")
    private int healthPercentage;

    @Column(name = "area_size")
    private Double areaSize;

    @Column(name = "area_unit")
    private String areaUnit;

    @Column(name = "planted_date")
    private LocalDate plantedDate;

    @Column(name = "expected_harvest_date")
    private LocalDate expectedHarvestDate;

    @Column(name = "created_at")
    private Timestamp createdAt;

    /** Default constructor required by JPA */
    public Crop() {
    }

    /** All-args constructor */
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

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(Long farmerId) {
        this.farmerId = farmerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFieldLocation() {
        return fieldLocation;
    }

    public void setFieldLocation(String fieldLocation) {
        this.fieldLocation = fieldLocation;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public int getHealthPercentage() {
        return healthPercentage;
    }

    public void setHealthPercentage(int healthPercentage) {
        this.healthPercentage = healthPercentage;
    }

    public Double getAreaSize() {
        return areaSize;
    }

    public void setAreaSize(Double areaSize) {
        this.areaSize = areaSize;
    }

    public String getAreaUnit() {
        return areaUnit;
    }

    public void setAreaUnit(String areaUnit) {
        this.areaUnit = areaUnit;
    }

    public LocalDate getPlantedDate() {
        return plantedDate;
    }

    public void setPlantedDate(LocalDate plantedDate) {
        this.plantedDate = plantedDate;
    }

    public LocalDate getExpectedHarvestDate() {
        return expectedHarvestDate;
    }

    public void setExpectedHarvestDate(LocalDate expectedHarvestDate) {
        this.expectedHarvestDate = expectedHarvestDate;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * JPA Lifecycle Hook.
     * Automatically sets createdAt and default dates right before inserting a new row into the DB.
     */
    @PrePersist
    protected void onCreate() {
        if (this.plantedDate == null) {
            this.plantedDate = LocalDate.now();
        }
        if (this.expectedHarvestDate == null) {
            this.expectedHarvestDate = LocalDate.now();
        }
        if (this.createdAt == null) {
            this.createdAt = new Timestamp(System.currentTimeMillis());
        }
    }
}
