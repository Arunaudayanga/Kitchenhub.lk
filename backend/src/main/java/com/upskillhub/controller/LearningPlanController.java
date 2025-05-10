package com.upskillhub.controller;

import com.upskillhub.model.LearningPlan;
import com.upskillhub.security.UserPrincipal;
import com.upskillhub.service.LearningPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning-plans")
@RequiredArgsConstructor
public class LearningPlanController {
    private final LearningPlanService learningPlanService;

    @PostMapping
    public ResponseEntity<LearningPlan> createPlan(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestBody LearningPlan plan) {
        return ResponseEntity.ok(learningPlanService.createPlan(user.getId(), plan));
    }

    @PutMapping("/{planId}")
    public ResponseEntity<LearningPlan> updatePlan(
            @PathVariable String planId,
            @RequestBody LearningPlan plan,
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(learningPlanService.updatePlan(planId, plan, user.getId()));
    }

    @GetMapping("/{planId}")
    public ResponseEntity<LearningPlan> getPlan(
            @PathVariable String planId,
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(learningPlanService.getPlan(planId, user.getId()));
    }

    @DeleteMapping("/{planId}")
    public ResponseEntity<Void> deletePlan(
            @PathVariable String planId,
            @AuthenticationPrincipal UserPrincipal user) {
        learningPlanService.deletePlan(planId, user.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my")
    public ResponseEntity<Page<LearningPlan>> getMyPlans(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(learningPlanService.getUserPlans(user.getId(), PageRequest.of(page, size)));
    }

    @GetMapping("/public")
    public ResponseEntity<Page<LearningPlan>> getPublicPlans(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(learningPlanService.getPublicPlans(PageRequest.of(page, size)));
    }

    @PostMapping("/{planId}/share")
    public ResponseEntity<LearningPlan> sharePlan(
            @PathVariable String planId,
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(learningPlanService.sharePlan(planId, userId));
    }

    @PostMapping("/{planId}/unshare")
    public ResponseEntity<LearningPlan> unshareplan(
            @PathVariable String planId,
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(learningPlanService.unshareplan(planId, userId));
    }

    @PostMapping("/{planId}/follow")
    public ResponseEntity<LearningPlan> followPlan(
            @PathVariable String planId,
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(learningPlanService.followPlan(planId, userId));
    }

    @GetMapping("/followed")
    public ResponseEntity<List<LearningPlan>> getFollowedPlans(
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(learningPlanService.getFollowedPlans(userId));
    }
}// learning plan