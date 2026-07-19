package org.ead2.comms.data;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * Repository for managing {@link Comms} entities.
 */
public interface CommsRepository extends JpaRepository<Comms, Long> {
    List<Comms> findByFarmerIdOrderBySentAtAsc(Long farmerId);
}