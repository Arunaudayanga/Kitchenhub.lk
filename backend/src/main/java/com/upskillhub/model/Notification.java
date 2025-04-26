package com.upskillhub.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    private String userId;
    private String actorId;
    private String targetId;
    private NotificationType type;
    private boolean read = false;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    public enum NotificationType {
        LIKE_POST,
        COMMENT_POST,
        FOLLOW_USER,
        LIKE_LEARNING_PLAN,
        LEARNING_MILESTONE_COMPLETED
    }
}