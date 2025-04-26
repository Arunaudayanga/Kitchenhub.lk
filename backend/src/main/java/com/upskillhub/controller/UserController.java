package com.upskillhub.controller;

import com.upskillhub.model.User;
import com.upskillhub.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

 @RestController
 @RequestMapping("/api/users")
 @RequiredArgsConstructor
 @CrossOrigin(origins = "*", maxAge = 3600)
 public class UserController {
     private final UserService userService;

     @PostMapping
     public ResponseEntity<User> createUser(@RequestBody User user) {
         return ResponseEntity.ok(userService.createUser(user));
     }

     @PutMapping("/{userId}")
     public ResponseEntity<User> updateUser(@PathVariable String userId, @RequestBody User userDetails) {
         return ResponseEntity.ok(userService.updateUser(userId, userDetails));
     }

     @GetMapping("/{userId}")
     public ResponseEntity<User> getUserById(@PathVariable String userId) {
         return userService.getUserById(userId)
                 .map(ResponseEntity::ok)
                 .orElse(ResponseEntity.notFound().build());
     }

     @GetMapping("/email/{email}")
     public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
         return userService.getUserByEmail(email)
                 .map(ResponseEntity::ok)
                 .orElse(ResponseEntity.notFound().build());
     }

     @PostMapping("/{userId}/follow/{targetUserId}")
     public ResponseEntity<User> followUser(@PathVariable String userId, @PathVariable String targetUserId) {
         return ResponseEntity.ok(userService.followUser(userId, targetUserId));
     }

     @PostMapping("/{userId}/unfollow/{targetUserId}")
     public ResponseEntity<User> unfollowUser(@PathVariable String userId, @PathVariable String targetUserId) {
         return ResponseEntity.ok(userService.unfollowUser(userId, targetUserId));
     }

     @GetMapping("/{userId}/followers")
     public ResponseEntity<Set<String>> getFollowers(@PathVariable String userId) {
         return ResponseEntity.ok(userService.getFollowers(userId));
     }

     @GetMapping("/{userId}/following")
     public ResponseEntity<Set<String>> getFollowing(@PathVariable String userId) {
         return ResponseEntity.ok(userService.getFollowing(userId));
     }

     @GetMapping("/{userId}/skills")
     public ResponseEntity<Set<String>> getUserSkills(@PathVariable String userId) {
         return ResponseEntity.ok(userService.getUserSkills(userId));
     }
 
     @GetMapping // Endpoint to get all users
     public ResponseEntity<List<User>> getAllUsers() {
         return ResponseEntity.ok(userService.getAllUsers());
     }
 
     @GetMapping("/batch")
     public ResponseEntity<List<User>> getUsersByIds(@RequestParam List<String> userIds) {
         return ResponseEntity.ok(userService.getUsersByIds(userIds));
     }
}