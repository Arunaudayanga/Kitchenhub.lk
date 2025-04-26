package com.upskillhub.repository;

import com.upskillhub.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {
    Post getPostById(String postId);
    Page<Post> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
    Page<Post> findByUserIdInOrderByCreatedAtDesc(List<String> userIds, Pageable pageable);
    Page<Post> findByTypeOrderByCreatedAtDesc(Post.PostType type, Pageable pageable);
}