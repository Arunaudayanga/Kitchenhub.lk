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
import java.util.Set;

@Data
@Document(collection = "learning_plans")
public class LearningPlan {
    @Id
    private String id;
    private String userId;
    private String title;
    private String description;
    private String contentUrl; // YouTube URL
    private List<String> tags;
    private String skillArea;
    private DifficultyLevel difficultyLevel;
    private List<Topic> topics = new ArrayList<>();
    private Set<String> likes = new HashSet<>();
    private LocalDateTime estimatedCompletionDate;
    private boolean isPublic = true;
    private Set<String> followers = new HashSet<>();
    private int followersCount = 0;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum DifficultyLevel {
        BEGINNER,
        INTERMEDIATE,
        ADVANCED
    }
    
    @Data
    public static class Topic {
        private String title;
        private String description;
        private List<Resource> resources = new ArrayList<>();
        private int estimatedHours;
        private boolean completed;
        private LocalDateTime completedAt;
    }
    
    @Data
    public static class Resource {
        private String name;
        private String url;
        private ResourceType type;
        private String description;
        
        public enum ResourceType {
            VIDEO,
            ARTICLE,
            COURSE,
            BOOK,
            PRACTICE_PROJECT
        }
    }
}