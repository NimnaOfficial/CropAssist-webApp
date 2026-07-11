package org.ead2.comms.service;

import org.ead2.comms.data.Comms;
import org.ead2.comms.data.CommsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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