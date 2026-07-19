package org.ead2.comms.data;
import org.springframework.data.jpa.repository.JpaRepository;

// List: A Java collection that holds an ordered group of objects.
// We use it here because our custom query method returns multiple Comms objects.
import java.util.List;
public interface CommsRepository extends JpaRepository<Comms, Long> {
    List<Comms> findByFarmerIdOrderBySentAtAsc(Long farmerId);

}