package com.upskillhub.service;

import com.upskillhub.model.Post;
import com.upskillhub.model.User;
import com.upskillhub.repository.PostRepository;
import com.upskillhub.repository.UserRepository;
import com.upskillhub.security.UserPrincipal;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SocialService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;


    public Post likePost(String postId, String userId) {
        System.out.println(userId);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.getLikes().add(userId);
        Post updatedPost = postRepository.save(post);

        userRepository.findById(updatedPost.getUserId()).ifPresent(user -> {
            updatedPost.setUser(new HashMap<String, String>() {{
                put("id", user.getId());
                put("name", user.getName());
                put("email", user.getEmail());
                put("profilePicture", user.getProfilePicture());
            }});
        });


        // Fetch and set user details for each comment
        if (updatedPost.getComments() != null) {
            updatedPost.getComments().forEach(updated_comment -> {
                userRepository.findById(updated_comment.getUserId()).ifPresent(user -> {
                    updated_comment.setUser(new HashMap<String, String>() {{
                        put("id", user.getId());
                        put("name", user.getName());
                        put("email", user.getEmail());
                        put("profilePicture", user.getProfilePicture());
                    }});
                });
            });
        }

        return updatedPost;
    }

    public Post unlikePost(String postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.getLikes().remove(userId);
        
        Post updatedPost = postRepository.save(post);

        userRepository.findById(updatedPost.getUserId()).ifPresent(user -> {
            updatedPost.setUser(new HashMap<String, String>() {{
                put("id", user.getId());
                put("name", user.getName());
                put("email", user.getEmail());
                put("profilePicture", user.getProfilePicture());
            }});
        });

        // Fetch and set user details for each comment
        if (updatedPost.getComments() != null) {
            updatedPost.getComments().forEach(updated_comment -> {
                userRepository.findById(updated_comment.getUserId()).ifPresent(user -> {
                    updated_comment.setUser(new HashMap<String, String>() {{
                        put("id", user.getId());
                        put("name", user.getName());
                        put("email", user.getEmail());
                        put("profilePicture", user.getProfilePicture());
                    }});
                });
            });
        }

        return updatedPost;
    }

    public Post addComment(String postId, String userId, String content) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        System.err.println(content);

        Post.Comment comment = new Post.Comment();
        comment.setId(UUID.randomUUID().toString());
        comment.setUserId(userId);
        comment.setContent(content);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());

        if (post.getComments() == null) {
            post.setComments(new ArrayList<>());
        }
        post.getComments().add(comment);

        Post updatedPost = postRepository.save(post);
        userRepository.findById(updatedPost.getUserId()).ifPresent(user -> {
            updatedPost.setUser(new HashMap<String, String>() {{
                put("id", user.getId());
                put("name", user.getName());
                put("email", user.getEmail());
                put("profilePicture", user.getProfilePicture());
            }});
        });

        // Fetch and set user details for each comment
        if (updatedPost.getComments() != null) {
            updatedPost.getComments().forEach(updated_comment -> {
                userRepository.findById(updated_comment.getUserId()).ifPresent(user -> {
                    updated_comment.setUser(new HashMap<String, String>() {{
                        put("id", user.getId());
                        put("name", user.getName());
                        put("email", user.getEmail());
                        put("profilePicture", user.getProfilePicture());
                    }});
                });
            });
        }

        return updatedPost;
    }

    public Post removeComment(String postId, String commentId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.getComments().removeIf(comment -> 
            comment.getId().equals(commentId) && comment.getUserId().equals(userId)
        );

        Post updatedPost = postRepository.save(post);
        userRepository.findById(updatedPost.getUserId()).ifPresent(user -> {
            updatedPost.setUser(new HashMap<String, String>() {{
                put("id", user.getId());
                put("name", user.getName());
                put("email", user.getEmail());
                put("profilePicture", user.getProfilePicture());
            }});
        });


        // Fetch and set user details for each comment
        if (updatedPost.getComments() != null) {
            updatedPost.getComments().forEach(updated_comment -> {
                userRepository.findById(updated_comment.getUserId()).ifPresent(user -> {
                    updated_comment.setUser(new HashMap<String, String>() {{
                        put("id", user.getId());
                        put("name", user.getName());
                        put("email", user.getEmail());
                        put("profilePicture", user.getProfilePicture());
                    }});
                });
            });
        }

        return updatedPost;
    }

}