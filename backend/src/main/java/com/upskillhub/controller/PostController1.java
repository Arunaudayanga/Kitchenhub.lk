package com.upskillhub.controller;

import com.upskillhub.model.Post;
import com.upskillhub.service.PostService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import com.upskillhub.security.UserPrincipal;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;
    
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        return ResponseEntity.ok(postService.createPost(post.getDescription(), post.getMedia(), post.getType()));
    }
    
    @GetMapping
    public ResponseEntity<Page<Post>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(postService.getAllPosts(page, size));
    }
    
    @GetMapping("/{postId}")
    public ResponseEntity<Post> getPostById(@PathVariable String postId) {
        return ResponseEntity.ok(postService.getPostById(postId));
    }

    @PutMapping("/{postId}")
    public ResponseEntity<Post> updatePost(
            @PathVariable String postId,
            @RequestBody Post postDetails,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(postService.updatePost(postId, postDetails, userPrincipal.getId()));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(
            @PathVariable String postId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        postService.deletePost(postId, userPrincipal.getId());
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{postId}/like")
    public ResponseEntity<Post> likePost(
            @PathVariable String postId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(postService.likePost(postId, userPrincipal.getId()));
    }
    
    @DeleteMapping("/{postId}/unlike")
    public ResponseEntity<Post> unlikePost(
            @PathVariable String postId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(postService.unlikePost(postId, userPrincipal.getId()));
    }
    
    public static class CommentRequest {
        private String content;
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<Post> addComment(
            @PathVariable String postId,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody CommentRequest commentRequest) {
        return ResponseEntity.ok(postService.addComment(postId, userPrincipal.getId(), commentRequest.getContent()));
    }
    
   
     @GetMapping("/user/{userId}")
    public ResponseEntity<Page<Post>> getUserPosts(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(postService.getUserPosts(userId, PageRequest.of(page, size)));
    }
   
}