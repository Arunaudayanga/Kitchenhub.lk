package com.upskillhub.repository;

import com.upskillhub.model.LearningPlan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {
    Page<LearningPlan> findByUserId(String userId, Pageable pageable);
    Page<LearningPlan> findByIsPublicTrue(Pageable pageable);
    Page<LearningPlan> findByIsPublicTrueAndSkillAreaOrderByCreatedAtDesc(String skillArea, Pageable pageable);
    Page<LearningPlan> findByIsPublicTrueAndDifficultyLevelOrderByCreatedAtDesc(LearningPlan.DifficultyLevel level, Pageable pageable);
    List<LearningPlan> findByUserIdAndIsPublicTrue(String userId);
    List<LearningPlan> findByFollowersContaining(String userId);
}