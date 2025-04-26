package com.upskillhub.repository;

import com.upskillhub.model.LearningProgress;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface LearningProgressRepository extends MongoRepository<LearningProgress, String> {
    List<LearningProgress> findByUserId(String userId);
    Optional<LearningProgress> findByUserIdAndSkillName(String userId, String skillName);
    Page<LearningProgress> findByUserIdOrderByUpdatedAtDesc(String userId, Pageable pageable);
    List<LearningProgress> findByUserIdAndCurrentLevel(String userId, LearningProgress.ProgressLevel level);
}