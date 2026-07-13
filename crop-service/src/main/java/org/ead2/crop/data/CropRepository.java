package org.ead2.crop.data;


import org.springframework.data.jpa.repository.JpaRepository;

/**
 * CropRepository is intended to handle database access for the Crop entity.
 * In the future, this should extend JpaRepository<Crop, Long> to automatically
 * inherit standard CRUD database operations (save, findById, findAll, etc.).
 */
public interface CropRepository extends JpaRepository<Crop,Long> {



}
