package org.ead2.crop.data;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.time.LocalDate;

/**
 * Entity representing a crop in the system.
 */
@Entity
@Table(name = "crops")
public class Crop {
    
    public enum Status {
        SEEDLING, GROWING, MATURE, HARVESTING, APPROVED
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "farmer_id")
    private Long farmerId;

    @Column(name = "name")
    private String name;

    @Column(name = "field_location")
    private String fieldLocation;

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

    public Crop() {
    }

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

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFarmerId() { return farmerId; }
    public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getFieldLocation() { return fieldLocation; }
    public void setFieldLocation(String fieldLocation) { this.fieldLocation = fieldLocation; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public int getHealthPercentage() { return healthPercentage; }
    public void setHealthPercentage(int healthPercentage) { this.healthPercentage = healthPercentage; }

    public Double getAreaSize() { return areaSize; }
    public void setAreaSize(Double areaSize) { this.areaSize = areaSize; }

    public String getAreaUnit() { return areaUnit; }
    public void setAreaUnit(String areaUnit) { this.areaUnit = areaUnit; }

    public LocalDate getPlantedDate() { return plantedDate; }
    public void setPlantedDate(LocalDate plantedDate) { this.plantedDate = plantedDate; }

    public LocalDate getExpectedHarvestDate() { return expectedHarvestDate; }
    public void setExpectedHarvestDate(LocalDate expectedHarvestDate) { this.expectedHarvestDate = expectedHarvestDate; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    /**
     * Initializes default values before persisting the entity.
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
