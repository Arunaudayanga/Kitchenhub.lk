package com.upskillhub.service;

import com.upskillhub.model.User;
import com.upskillhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User updateUser(String userId, User userDetails) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(userDetails.getName());
        user.setBio(userDetails.getBio());
        user.setProfilePicture(userDetails.getProfilePicture());
        user.setSkills(userDetails.getSkills());

        return userRepository.save(user);
    }

    public User followUser(String userId, String targetUserId) {
        if (userId.equals(targetUserId)) {
            throw new RuntimeException("Users cannot follow themselves");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        user.getFollowing().add(targetUserId);
        targetUser.getFollowers().add(userId);

        userRepository.save(targetUser);
        return userRepository.save(user);
    }

    public User unfollowUser(String userId, String targetUserId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        user.getFollowing().remove(targetUserId);
        targetUser.getFollowers().remove(userId);

        userRepository.save(targetUser);
        return userRepository.save(user);
    }

    public Optional<User> getUserById(String userId) {
        return userRepository.findById(userId);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getUsersByIds(List<String> userIds) {
        return userRepository.findAllById(userIds);
    }

    public List<User> getAllUsers() { // New method to get all users
        return userRepository.findAll();
    }

    public Set<String> getFollowers(String userId) {
        return userRepository.findById(userId)
                .map(User::getFollowers)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Set<String> getFollowing(String userId) {
        return userRepository.findById(userId)
                .map(User::getFollowing)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Set<String> getUserSkills(String userId) {
        return userRepository.findById(userId)
                .map(User::getSkills)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}