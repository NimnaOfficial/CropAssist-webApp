package org.ead2.crop.controller;

import org.ead2.crop.data.Crop;
import org.ead2.crop.service.CropService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CropController is intended to handle HTTP requests for the Crop Service.
 * Currently, it is a placeholder for future endpoint implementations (e.g., adding, updating, or deleting crops).
 */
@CrossOrigin(origins = "*") // Allows the frontend to communicate with this controller from any origin (e.g. localhost:3000)
@RequestMapping(path = "/Api") // Base URL path for all endpoints in this controller
@RestController // Marks this class as a REST API controller that automatically serializes responses to JSON


public class CropController {

    private final CropService cropService;

    public CropController(CropService cropService) {

        this.cropService = cropService;

    }

    @PostMapping(path = "/crops")
    public Crop createCrop(@RequestBody Crop crop) {

        return cropService.createCrop(crop);

    }

    @GetMapping(path = "/crops")
    public List<Crop> getAllCrops(){
        return cropService.getAllCrops();
    }




}
