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
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public Post createPost(String description, List<String> mediaUrls, Post.PostType postType) {
        // Get current user ID from security context
        String userId = ((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        System.out.println(userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate media URLs
        if (mediaUrls != null && !mediaUrls.isEmpty()) {
            if (mediaUrls.size() > 3) {
                throw new RuntimeException("Maximum 3 media files allowed");
            }
            // Validate base64 URLs
            for (String url : mediaUrls) {
                if (!url.startsWith("data:image/") || !url.contains(";base64,")) {
                    throw new RuntimeException("Invalid image format");
                }
            }
        }

        // Create new post
        Post post = new Post();
        post.setUserId(userId);
        post.setDescription(description);
        post.setType(postType);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        post.setMedia(mediaUrls);

        return postRepository.save(post);
    }

    public Post updatePost(String postId, Post postDetails, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUserId().equals(userId)) {
            throw new RuntimeException("User not authorized to update this post");
        }

        post.setDescription(postDetails.getDescription());
        post.setMedia(postDetails.getMedia());
        post.setType(postDetails.getType());
        post.setUpdatedAt(LocalDateTime.now());

        return postRepository.save(post);
    }

    public void deletePost(String postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUserId().equals(userId)) {
            throw new RuntimeException("User not authorized to delete this post");
        }

        postRepository.delete(post);
    }

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

    public Page<Post> getUserPosts(String userId, Pageable pageable) {
        Page<Post> posts = postRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        
        // Fetch and set user details for each post
        posts.getContent().forEach(post -> {
            userRepository.findById(post.getUserId()).ifPresent(user -> {
                post.setUser(new HashMap<String, String>() {{
                    put("id", user.getId());
                    put("name", user.getName());
                    put("email", user.getEmail());
                    put("profilePicture", user.getProfilePicture());
                }});
            });
            
            // Fetch and set user details for each comment
            if (post.getComments() != null) {
                post.getComments().forEach(comment -> {
                    userRepository.findById(comment.getUserId()).ifPresent(user -> {
                        comment.setUser(new HashMap<String, String>() {{
                            put("id", user.getId());
                            put("name", user.getName());
                            put("email", user.getEmail());
                            put("profilePicture", user.getProfilePicture());
                        }});
                    });
                });
            }
        });
        
        return posts;
    }

    public Page<Post> getFeedPosts(List<String> followingIds, Pageable pageable) {
        return postRepository.findByUserIdInOrderByCreatedAtDesc(followingIds, pageable);
    }

    public Page<Post> getPostsByType(Post.PostType type, Pageable pageable) {
        return postRepository.findByTypeOrderByCreatedAtDesc(type, pageable);
    }

    public Page<Post> getAllPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Post> posts = postRepository.findAll(pageable);
        
        // Fetch and set user details for each post
        posts.getContent().forEach(post -> {
            userRepository.findById(post.getUserId()).ifPresent(user -> {
                post.setUser(new HashMap<String, String>() {{
                    put("id", user.getId());
                    put("name", user.getName());
                    put("email", user.getEmail());
                    put("profilePicture", user.getProfilePicture());
                }});
            });
            
            // Fetch and set user details for each comment
            if (post.getComments() != null) {
                post.getComments().forEach(comment -> {
                    userRepository.findById(comment.getUserId()).ifPresent(user -> {
                        comment.setUser(new HashMap<String, String>() {{
                            put("id", user.getId());
                            put("name", user.getName());
                            put("email", user.getEmail());
                            put("profilePicture", user.getProfilePicture());
                        }});
                    });
                });
            }
        });
        
        return posts;
    }

    public Post getPostById(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        // Fetch and set user details
        userRepository.findById(post.getUserId()).ifPresent(user -> {
            post.setUser(new HashMap<String, String>() {{
                put("id", user.getId());
                put("name", user.getName());
                put("email", user.getEmail());
                put("profilePicture", user.getProfilePicture());
            }});
        });

        // Fetch and set user details for each comment
        if (post.getComments() != null) {
            post.getComments().forEach(comment -> {
                userRepository.findById(comment.getUserId()).ifPresent(user -> {
                    comment.setUser(new HashMap<String, String>() {{
                        put("id", user.getId());
                        put("name", user.getName());
                        put("email", user.getEmail());
                        put("profilePicture", user.getProfilePicture());
                    }});
                });
            });
        }
        
        return post;
    }
}