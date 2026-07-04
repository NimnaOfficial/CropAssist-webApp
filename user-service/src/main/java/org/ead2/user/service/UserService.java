package org.ead2.user.service;

import jakarta.transaction.Transactional;
import org.ead2.user.config.AppConfig;
import org.ead2.user.data.User;
import org.ead2.user.data.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class UserService {


    private final UserRepository userRepository;


    private final PasswordEncoder passwordEncoder ;   // <-- add this

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder ){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;

    }

    public User createUser(User user) {
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));

        return userRepository.save(user);
    }

    public User updateUser(User user) {
        if (user.getPasswordHash() != null && !user.getPasswordHash().startsWith("$2a$") && !user.getPasswordHash().equals("pending_setup")) {
            user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        }
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

    public User login(String emailOrNic, String rawPassword) {
        User user = userRepository.findByEmailOrNic(emailOrNic);
        if (user == null) {
            throw new RuntimeException("User not found with identifier: " + emailOrNic);
        }
        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        // Optional: check if status is active
        if (user.getStatus() != User.Status.ACTIVE) {
            throw new RuntimeException("Account is not active");
        }
        return user;   // or return a JWT token if you plan to use it
    }
}

