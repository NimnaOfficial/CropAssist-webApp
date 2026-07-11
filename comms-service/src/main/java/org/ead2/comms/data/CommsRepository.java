package org.ead2.comms.data;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommsRepository extends JpaRepository<Comms, Long> {

    List<Comms> findByFarmerIdOrderBySentAtAsc(Long farmerId);

}