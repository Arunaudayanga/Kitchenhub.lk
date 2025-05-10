package com.upskillhub.service.impl;

import com.upskillhub.exception.ResourceNotFoundException;
import com.upskillhub.exception.UnauthorizedException;
import com.upskillhub.model.LearningPlan;
import com.upskillhub.repository.LearningPlanRepository;
import com.upskillhub.security.UserPrincipal;
import com.upskillhub.service.LearningPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LearningPlanServiceImpl implements LearningPlanService {
    private final LearningPlanRepository learningPlanRepository;

   /*  @Override
    public LearningPlan createPlan(String userId, LearningPlan plan) {
        //String userId = ((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        plan.setUserId(userId);
        plan.setContentUrl(plan.getContentUrl()); // Set contentUrl
        plan.setTags(plan.getTags()); // Set tags
        plan.setCreatedAt(LocalDateTime.now());
        plan.setUpdatedAt(LocalDateTime.now());
        return learningPlanRepository.save(plan); */
    }

    @Override
    public LearningPlan updatePlan(String planId, LearningPlan plan, String userId) {
        LearningPlan existingPlan = learningPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Learning plan not found"));

        if (!existingPlan.getUserId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to update this plan");
        }

        existingPlan.setTitle(plan.getTitle());
        existingPlan.setDescription(plan.getDescription());
        existingPlan.setContentUrl(plan.getContentUrl()); // Update contentUrl
        existingPlan.setTags(plan.getTags()); // Update tags
        existingPlan.setTopics(plan.getTopics());
        existingPlan.setUpdatedAt(LocalDateTime.now());

        return learningPlanRepository.save(existingPlan);
    }

    @Override
    public LearningPlan getPlan(String planId, String userId) {
        LearningPlan plan = learningPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Learning plan not found"));

        if (!plan.isPublic() && !plan.getUserId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to view this plan");
        }

        return plan;
    }

    @Override
    public void deletePlan(String planId, String userId) {
        LearningPlan plan = learningPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Learning plan not found"));

        if (!plan.getUserId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to delete this plan");
        }

        learningPlanRepository.delete(plan);
    }

    @Override
    public Page<LearningPlan> getUserPlans(String userId, Pageable pageable) {
        return learningPlanRepository.findByUserId(userId, pageable);
    }

    @Override
    public Page<LearningPlan> getPublicPlans(Pageable pageable) {
        return learningPlanRepository.findByIsPublicTrue(pageable);
    }

    @Override
    public LearningPlan sharePlan(String planId, String userId) {
        LearningPlan plan = learningPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Learning plan not found"));

        if (!plan.getUserId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to share this plan");
        }

        plan.setPublic(true);
        return learningPlanRepository.save(plan);
    }

    @Override
    public LearningPlan unshareplan(String planId, String userId) {
        LearningPlan plan = learningPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Learning plan not found"));

        if (!plan.getUserId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to unshare this plan");
        }

        plan.setPublic(false);
        return learningPlanRepository.save(plan);
    }

    @Override
    public LearningPlan followPlan(String planId, String userId) {
        LearningPlan plan = learningPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Learning plan not found"));

        if (!plan.isPublic()) {
            throw new UnauthorizedException("This plan is not public");
        }

        if (!plan.getFollowers().contains(userId)) {
            plan.getFollowers().add(userId);
            plan.setFollowersCount(plan.getFollowersCount() + 1);
            return learningPlanRepository.save(plan);
        }

        return plan;
    }

    @Override
    public List<LearningPlan> getFollowedPlans(String userId) {
        return learningPlanRepository.findByFollowersContaining(userId);
    }
}