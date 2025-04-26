package com.upskillhub.dto;

import lombok.Data;
import java.util.Set;

@Data
public class UserDTO {
    private String id;
    private String email;
    private String name;
    private String profilePicture;
    private String bio;
    private Set<String> followers;
    private Set<String> following;
    private Set<String> skills;
    
    // Exclude sensitive information like password
    public UserDTO() {}
    
    public UserDTO(String id, String email, String name, String profilePicture, 
                   String bio, Set<String> followers, Set<String> following, 
                   Set<String> skills) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.profilePicture = profilePicture;
        this.bio = bio;
        this.followers = followers;
        this.following = following;
        this.skills = skills;
    }
}