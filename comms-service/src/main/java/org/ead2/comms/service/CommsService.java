package org.ead2.comms.service;
import org.ead2.comms.data.Comms;

// CommsRepository: The repository interface that provides database access.
// We import it because the service uses the repository to actually read from and
// write to the database. The service never talks to the database directly — it
// always goes through the repository.
import org.ead2.comms.data.CommsRepository;

// @Autowired: An annotation that tells Spring to automatically inject (provide)
// a dependency. When Spring sees @Autowired on a field, it looks in its container
// for a matching bean (managed object) and assigns it to that field.
// In simpler terms: "Spring, please create this object for me and plug it in here."
import org.springframework.beans.factory.annotation.Autowired;

// @Service: An annotation that tells Spring: "This class is a SERVICE — a component
// that holds business logic." It does two things:
//   1. Registers this class as a Spring bean (managed object) so other classes can use it.
//   2. Makes it clear to developers that this class belongs to the SERVICE layer.
// Technically, @Service is a specialized version of @Component — they do the same thing,
// but @Service makes the code more readable by expressing intent.
import org.springframework.stereotype.Service;

// LocalDateTime: A Java class for representing a date and time (e.g., 2026-07-17T10:30:00).
// We import it here because the saveMessage() method uses it to set the current timestamp
// on each message before saving it.
import java.time.LocalDateTime;

// List: A Java collection that holds an ordered group of objects.
// We use it here because some methods return multiple Comms (messages) at once —
// for example, all messages for a farmer, or all messages in the system.
import java.util.List;
@Service
public class CommsService {
    @Autowired
    private CommsRepository commsRepository;
    public Comms saveMessage(Comms message) {
        message.setSentAt(LocalDateTime.now());
        return commsRepository.save(message);
    }
    public List<Comms> getMessagesByFarmer(Long farmerId) {
        return commsRepository.findByFarmerIdOrderBySentAtAsc(farmerId);
    }
    public List<Comms> getAllMessages() {
        return commsRepository.findAll();
    }
}