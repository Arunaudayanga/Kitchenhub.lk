package com.upskillhub.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "learning_progress")
public class LearningProgress {
    @Id
    private String id;
    private String userId;
    private String skillName;
    private ProgressLevel currentLevel;
    private List<Milestone> milestones = new ArrayList<>();
    private List<Resource> completedResources = new ArrayList<>();
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum ProgressLevel {
        BEGINNER,
        INTERMEDIATE,
        ADVANCED,
        EXPERT
    }
    
    @Data
    public static class Milestone {
        private String description;
        private boolean completed;
        private LocalDateTime completedAt;
    }
    
    @Data
    public static class Resource {
        private String name;
        private String url;
        private ResourceType type;
        private LocalDateTime completedAt;
        
        public enum ResourceType {
            TUTORIAL,
            COURSE,
            PROJECT,
            OTHER
        }
    }
}