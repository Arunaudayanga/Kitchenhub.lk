package com.upskillhub.service;

import com.upskillhub.model.LearningPlan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface LearningPlanService {
    LearningPlan createPlan(String userId, LearningPlan plan);
    LearningPlan updatePlan(String planId, LearningPlan plan, String userId);
    LearningPlan getPlan(String planId, String userId);
    void deletePlan(String planId, String userId);
    Page<LearningPlan> getUserPlans(String userId, Pageable pageable);
    Page<LearningPlan> getPublicPlans(Pageable pageable);
    LearningPlan sharePlan(String planId, String userId);
    LearningPlan unshareplan(String planId, String userId);
    LearningPlan followPlan(String planId, String userId);
    List<LearningPlan> getFollowedPlans(String userId);
}