package org.ead2.crop.service;
import org.ead2.crop.data.Crop;

// CropRepository: The database access layer that provides methods like save(), findAll(),
// findById(), deleteById(), etc. The service uses this to interact with the database.
import org.ead2.crop.data.CropRepository;

// @Service: A Spring annotation that marks this class as a "service" component.
// It tells Spring: "Create an instance of this class and manage it for me."
// This makes the class available for Dependency Injection — other classes (like CropController)
// can automatically receive an instance of this class without manually creating one.
// Technically, @Service is a specialization of @Component. Both do the same thing,
// but @Service communicates intent — it tells developers "this class has business logic."
import org.springframework.stereotype.Service;

// List: A Java collection interface that represents an ordered group of elements.
// We use List<Crop> to return multiple crops from the getAllCrops() method.
import java.util.List;
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
    public Crop updateCropStatus(Long id, Crop.Status status) {
        Crop crop = cropRepository.findById(id).orElseThrow(() -> new RuntimeException("Crop not found"));
        crop.setStatus(status);
        return cropRepository.save(crop);
    }
}
