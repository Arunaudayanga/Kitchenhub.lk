package com.upskillhub.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.HashSet;
import java.util.Set;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String email;
    private String name;
    private String password;
    private String profilePicture;
    private String bio;
    private Set<String> followers = new HashSet<>();
    private Set<String> following = new HashSet<>();
    private Set<String> skills = new HashSet<>();
    private AuthProvider provider;
    private String providerId;
    private boolean enabled = true;
    
    public enum AuthProvider {
        LOCAL,
        GOOGLE,
        FACEBOOK
    }
}