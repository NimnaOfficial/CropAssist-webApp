package org.ead2.crop.service;

import org.ead2.crop.data.Crop;
import org.ead2.crop.data.CropRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * CropService is intended to handle the core business logic for the Crop Service.
 * In the future, this should be annotated with @Service and contain methods to interact with the CropRepository.
 */


@Service

public class CropService {

    private final CropRepository cropRepository;
    public CropService(CropRepository cropRepository){

        this.cropRepository = cropRepository;

    }


    public Crop createCrop(Crop crop) {
        return cropRepository.save(crop);
    }

    public List<Crop> getAllCrops() {
        return cropRepository.findAll();
    }

    public Crop updateCrop(Crop crop) {
        return cropRepository.save(crop);
    }

    public void deleteCrop(Long id) {
        cropRepository.deleteById(id);
    }
}
