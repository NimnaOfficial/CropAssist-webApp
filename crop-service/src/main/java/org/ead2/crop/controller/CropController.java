package org.ead2.crop.controller;

import org.ead2.crop.data.Crop;
import org.ead2.crop.service.CropService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST Controller for managing crops.
 */
@RestController
@RequestMapping(path = "/api")
public class CropController {
    
    private final CropService cropService;

    public CropController(CropService cropService) {

        this.cropService = cropService;
    }

    /**
     * Creates a new crop.
     * 
     * @param crop the crop data to create
     * @return the created crop
     */
    @PostMapping(path = "/crops")
    public Crop createCrop(@RequestBody Crop crop) {

        return cropService.createCrop(crop);
    }

    /**
     * Retrieves all crops.
     * 
     * @return a list of all crops
     */
    @GetMapping(path = "/crops")
    public List<Crop> getAllCrops(){

        return cropService.getAllCrops();
    }

    /**
     * Updates an existing crop.
     * 
     * @param crop the crop data to update
     * @return the updated crop
     */
    @PutMapping(path = "/crops")
    public Crop updateCrop(@RequestBody Crop crop) {

        return cropService.updateCrop(crop);
    }

    /**
     * Deletes a crop by its ID.
     * 
     * @param id the ID of the crop to delete
     */
    @DeleteMapping(path = "/crops/{id}")
    public void deleteCrop(@PathVariable Long id) {

        cropService.deleteCrop(id);
    }

    /**
     * Updates the status of a specific crop.
     * 
     * @param id the ID of the crop
     * @param status the new status
     * @return the updated crop
     */
    @PutMapping(path = "/crops/{id}/status")
    public Crop updateCropStatus(@PathVariable Long id, @RequestParam Crop.Status status) {
        return cropService.updateCropStatus(id, status);
    }
}
