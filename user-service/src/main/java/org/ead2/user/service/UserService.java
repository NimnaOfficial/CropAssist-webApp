package org.ead2.user.service;

import jakarta.transaction.Transactional;
import org.ead2.user.data.User;
import org.ead2.user.data.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class UserService {

    @Autowired
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUserById(Long id) {
        if(userRepository.existsById(id)){
            userRepository.deleteById(id);
        }
    }

    public List<User> gettAllUsers() {
        return userRepository.findAll();
    }

    public User getUserByNIC(String nic) {
        return userRepository.existsByNIC(nic);
    }

    public User getUserByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User getUserByFullName(String fullName) {
        return userRepository.existsByFullName(fullName);
    }
    @Transactional
    public User updateUserStatus(Long id, User.Status status) {
        int updated = userRepository.updateUserStatus(id, status);
        if (updated == 0) {
            throw new RuntimeException("User not found with id: " + id);
        }
        // Optionally fetch and return the updated user
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found after update"));
    }
}

