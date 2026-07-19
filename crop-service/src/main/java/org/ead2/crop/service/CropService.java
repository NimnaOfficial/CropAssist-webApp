package org.ead2.crop.service;

import org.ead2.crop.data.Crop;
import org.ead2.crop.data.CropRepository;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Service class for managing crops.
 */
@Service
public class CropService {

    private final CropRepository cropRepository;

    public CropService(CropRepository cropRepository) {

        this.cropRepository = cropRepository;
    }

    /**
     * Creates a new crop.
     * 
     * @param crop the crop data to save
     * @return the saved crop
     */
    public Crop createCrop(Crop crop) {

        return cropRepository.save(crop);
    }

    /**
     * Retrieves all crops.
     * 
     * @return a list of all crops
     */
    public List<Crop> getAllCrops() {

        return cropRepository.findAll();
    }

    /**
     * Updates an existing crop.
     * 
     * @param crop the crop data to update
     * @return the updated crop
     */
    public Crop updateCrop(Crop crop) {

        return cropRepository.save(crop);
    }

    /**
     * Deletes a crop by its ID.
     * 
     * @param id the ID of the crop to delete
     */
    public void deleteCrop(Long id) {

        cropRepository.deleteById(id);
    }

    /**
     * Updates the status of a specific crop.
     * 
     * @param id the ID of the crop
     * @param status the new status
     * @return the updated crop
     * @throws RuntimeException if the crop is not found
     */
    public Crop updateCropStatus(Long id, Crop.Status status) {
        Crop crop = cropRepository.findById(id).orElseThrow(() -> new RuntimeException("Crop not found"));
        crop.setStatus(status);
        return cropRepository.save(crop);
    }
}
