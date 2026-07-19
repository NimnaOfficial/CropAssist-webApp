package org.ead2.crop.data;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository interface for Crop entity operations.
 */
public interface CropRepository extends JpaRepository<Crop, Long> {
}
