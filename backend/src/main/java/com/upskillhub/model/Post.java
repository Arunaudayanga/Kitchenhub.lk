package com.upskillhub.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Data
@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String userId;
    private String description;
    private List<String> media = new ArrayList<>();
    private Set<String> likes = new HashSet<>();
    private List<Comment> comments = new ArrayList<>();
    private PostType type;
    private Map<String, String> user; // Added to store user details
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum PostType {
        
        SKILL_SHARING,
        LEARNING_UPDATE
    }
    
    @Data
    public static class Media {
        private String url;
        private MediaType type;
        private long duration; // in seconds, for videos
        
        public enum MediaType {
            PHOTO,
            VIDEO
        }
    }
    
    @Data
    public static class Comment {
        private String id;
        private String userId;
        private String content;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private Map<String, String> user;
    }
}