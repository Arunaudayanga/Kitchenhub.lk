package com.upskillhub.controller;

import com.upskillhub.model.LearningProgress;
import com.upskillhub.security.UserPrincipal;
import com.upskillhub.service.LearningProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning-progress")
@RequiredArgsConstructor
public class LearningProgressController {
    private final LearningProgressService learningProgressService;

    @PostMapping
    public ResponseEntity<LearningProgress> createProgress(
        @AuthenticationPrincipal UserPrincipal user,
        @RequestBody LearningProgress progressInput) {
        // TODO: Replace @AuthenticationPrincipal String userId with UserPrincipal if using Spring Security context
        // String actualUserId = ((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        return ResponseEntity.ok(learningProgressService.createProgress(user.getId(), progressInput));
    }

    @PutMapping("/{progressId}")
    public ResponseEntity<LearningProgress> updateProgress(
            @PathVariable String progressId,
            @RequestBody LearningProgress progressDetails,
            @AuthenticationPrincipal UserPrincipal user) {
        // TODO: Replace @AuthenticationPrincipal String userId with UserPrincipal
        return ResponseEntity.ok(learningProgressService.updateProgress(progressId, progressDetails, user.getId()));
    }

    /* @PostMapping("/{progressId}/milestones")
    public ResponseEntity<LearningProgress> addMilestone(
            @PathVariable String progressId,
            @RequestBody LearningProgress.Milestone milestone,
            @AuthenticationPrincipal UserPrincipal user) {
        // TODO: Replace @AuthenticationPrincipal String userId with UserPrincipal
        return ResponseEntity.ok(learningProgressService.addMilestone(progressId, user.getId(), milestone));
    } */

    @PutMapping("/{progressId}/milestones/{milestoneIndex}/complete")
    public ResponseEntity<LearningProgress> completeMilestone(
            @PathVariable String progressId,
            @PathVariable int milestoneIndex,
            @AuthenticationPrincipal UserPrincipal user) {
        // TODO: Replace @AuthenticationPrincipal String userId with UserPrincipal
        return ResponseEntity.ok(learningProgressService.completeMilestone(progressId, user.getId(), milestoneIndex));
    }

    @PostMapping("/{progressId}/resources")
    public ResponseEntity<LearningProgress> addCompletedResource(
            @PathVariable String progressId,
            @RequestBody LearningProgress.Resource resource,
            @AuthenticationPrincipal UserPrincipal user) {
        // TODO: Replace @AuthenticationPrincipal String userId with UserPrincipal
        return ResponseEntity.ok(learningProgressService.addCompletedResource(progressId, user.getId(), resource));
    }

    @GetMapping
    public ResponseEntity<Page<LearningProgress>> getUserProgress(
        @AuthenticationPrincipal UserPrincipal user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        // TODO: Replace @AuthenticationPrincipal String userId with UserPrincipal
        return ResponseEntity.ok(learningProgressService.getUserProgressPaged(user.getId(), PageRequest.of(page, size)));
    }

    @GetMapping("/by-level/{level}")
    public ResponseEntity<List<LearningProgress>> getUserProgressByLevel(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable LearningProgress.ProgressLevel level) {
        // TODO: Replace @AuthenticationPrincipal String userId with UserPrincipal
        return ResponseEntity.ok(learningProgressService.getUserProgressByLevel(user.getId(), level));
    }

    @DeleteMapping("/{progressId}")
    public ResponseEntity<Void> deleteProgress(
            @PathVariable String progressId,
            @AuthenticationPrincipal UserPrincipal user) {
        // TODO: Replace @AuthenticationPrincipal String userId with UserPrincipal
        learningProgressService.deleteProgress(progressId, user.getId());
        return ResponseEntity.noContent().build();
    }
}