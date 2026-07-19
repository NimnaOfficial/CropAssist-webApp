package org.ead2.comms.service;

import org.ead2.comms.data.Comms;
import org.ead2.comms.data.CommsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Business logic service for handling communication messages.
 */
@Service
public class CommsService {
    
    @Autowired
    private CommsRepository commsRepository;
    
    /**
     * Saves a new message to the database with the current timestamp.
     * 
     * @param message the message to save
     * @return the saved message
     */
    public Comms saveMessage(Comms message) {
        message.setSentAt(LocalDateTime.now());
        return commsRepository.save(message);
    }
    
    /**
     * Retrieves all messages associated with a specific farmer.
     * 
     * @param farmerId the ID of the farmer
     * @return a list of messages sorted by sent time
     */
    public List<Comms> getMessagesByFarmer(Long farmerId) {
        return commsRepository.findByFarmerIdOrderBySentAtAsc(farmerId);
    }
    
    /**
     * Retrieves all messages in the system.
     * 
     * @return a list of all messages
     */
    public List<Comms> getAllMessages() {
        return commsRepository.findAll();
    }
}