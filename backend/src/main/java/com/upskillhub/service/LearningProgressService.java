package com.upskillhub.service;

import com.upskillhub.exception.ResourceNotFoundException;
import com.upskillhub.exception.UnauthorizedException;
import com.upskillhub.model.LearningProgress;
import com.upskillhub.model.User;
import com.upskillhub.repository.LearningProgressRepository;
import com.upskillhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LearningProgressService {
    private final LearningProgressRepository learningProgressRepository;
    private final UserRepository userRepository;

    public LearningProgress createProgress(String userId, LearningProgress progressInput) { // Changed parameter
        User user = userRepository.findById(userId) // Get userId from input object
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Use data from progressInput, ensure required fields are set
        progressInput.setCreatedAt(LocalDateTime.now());
        progressInput.setUpdatedAt(LocalDateTime.now());
        // Set default level if not provided in input, or validate input level
        if (progressInput.getCurrentLevel() == null) {
            progressInput.setCurrentLevel(LearningProgress.ProgressLevel.BEGINNER);
        }

        progressInput.setUserId(userId);

        // Add skill to user's profile if it's a new skill for them
        if (progressInput.getSkillName() != null && !user.getSkills().contains(progressInput.getSkillName())) {
            user.getSkills().add(progressInput.getSkillName());
            userRepository.save(user);
        }

        return learningProgressRepository.save(progressInput);
    }

    public LearningProgress updateProgress(String progressId, LearningProgress progressDetails, String userId) {
        LearningProgress progress = learningProgressRepository.findById(progressId)
                .orElseThrow(() -> new ResourceNotFoundException("Progress not found with id: " + progressId));

        if (!progress.getUserId().equals(userId)) {
            throw new UnauthorizedException("User not authorized to update this progress");
        }

        progress.setCurrentLevel(progressDetails.getCurrentLevel());
        progress.setMilestones(progressDetails.getMilestones());
        progress.setCompletedResources(progressDetails.getCompletedResources());
        progress.setUpdatedAt(LocalDateTime.now());

        return learningProgressRepository.save(progress);
    }

    public LearningProgress addMilestone(String progressId, String userId, LearningProgress.Milestone milestone) {
        LearningProgress progress = learningProgressRepository.findById(progressId)
                .orElseThrow(() -> new ResourceNotFoundException("Progress not found with id: " + progressId));

        if (!progress.getUserId().equals(userId)) {
            throw new UnauthorizedException("User not authorized to update this progress");
        }

        progress.getMilestones().add(milestone);
        progress.setUpdatedAt(LocalDateTime.now());

        return learningProgressRepository.save(progress);
    }

    public LearningProgress completeMilestone(String progressId, String userId, int milestoneIndex) {
        LearningProgress progress = learningProgressRepository.findById(progressId)
                .orElseThrow(() -> new ResourceNotFoundException("Progress not found with id: " + progressId));

        if (!progress.getUserId().equals(userId)) {
            throw new UnauthorizedException("User not authorized to update this progress");
        }

        if (milestoneIndex >= 0 && milestoneIndex < progress.getMilestones().size()) {
            LearningProgress.Milestone milestone = progress.getMilestones().get(milestoneIndex);
            milestone.setCompleted(true);
            milestone.setCompletedAt(LocalDateTime.now());
            progress.setUpdatedAt(LocalDateTime.now());
        } else {
            throw new IllegalArgumentException("Invalid milestone index: " + milestoneIndex);
        }

        return learningProgressRepository.save(progress);
    }

    public LearningProgress addCompletedResource(String progressId, String userId, LearningProgress.Resource resource) {
        LearningProgress progress = learningProgressRepository.findById(progressId)
                .orElseThrow(() -> new ResourceNotFoundException("Progress not found with id: " + progressId));

        if (!progress.getUserId().equals(userId)) {
            throw new UnauthorizedException("User not authorized to update this progress");
        }

        resource.setCompletedAt(LocalDateTime.now());
        progress.getCompletedResources().add(resource);
        progress.setUpdatedAt(LocalDateTime.now());

        return learningProgressRepository.save(progress);
    }

    public void deleteProgress(String progressId, String userId) {
        LearningProgress progress = learningProgressRepository.findById(progressId)
                .orElseThrow(() -> new ResourceNotFoundException("Progress not found with id: " + progressId));

        if (!progress.getUserId().equals(userId)) {
            throw new UnauthorizedException("User not authorized to delete this progress");
        }

        // Optional: Remove skill from user's skill list if this is the only progress for that skill?
        // User user = userRepository.findById(userId).orElseThrow(...);
        // user.getSkills().remove(progress.getSkillName());
        // userRepository.save(user);

        learningProgressRepository.delete (progress);
    }

    public List<LearningProgress> getUserProgress(String userId) {
        return learningProgressRepository.findByUserId(userId);
    }

    public Page<LearningProgress> getUserProgressPaged(String userId, Pageable pageable) {
        return learningProgressRepository.findByUserIdOrderByUpdatedAtDesc(userId, pageable);
    }

    public List<LearningProgress> getUserProgressByLevel(String userId, LearningProgress.ProgressLevel level) {
        return learningProgressRepository.findByUserIdAndCurrentLevel(userId, level);
    }
}