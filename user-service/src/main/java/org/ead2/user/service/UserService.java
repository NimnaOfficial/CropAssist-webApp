package org.ead2.user.service;

import org.ead2.user.data.User;
import org.ead2.user.data.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.List;

@Service
public class UserService {

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

    public void deleteUserById(BigInteger id) {
        if(userRepository.existsById(String.valueOf(id))){
            userRepository.deleteById(String.valueOf(id));
        }
    }

    public List<User> gettAllUsers() {
        return userRepository.findAll();
    }
}
