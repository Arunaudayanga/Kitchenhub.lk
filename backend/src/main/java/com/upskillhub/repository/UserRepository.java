package com.upskillhub.repository;

import com.upskillhub.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByProviderAndProviderId(User.AuthProvider provider, String providerId);
    boolean existsByEmail(String email);
}