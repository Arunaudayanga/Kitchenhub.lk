import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import postService from '../../services/postService';
import authService from '../../services/authService';

const PostInteractions = ({ post, onUpdate, loggedUserId }) => {
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showLikesList, setShowLikesList] = useState(false);
  const [likedUsers, setLikedUsers] = useState([]);

  useEffect(() => {
    if (showLikesList && post.likes.length > 0) {
      const fetchLikedUsers = async () => {
        try {
          const users = await userService.getUsersByIds(post.likes);
          setLikedUsers(users);
        } catch (error) {
          console.error('Error fetching liked users:', error);
        }
      };
      fetchLikedUsers();
    }
  }, [showLikesList, post.likes]);

  const handleLike = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      console.log(currentUser)
      if (!currentUser) return;
      
      const isLiked = post.likes.includes(loggedUserId);
      const response = await (isLiked ? postService.unlikePost(post.id) : postService.likePost(post.id));
      onUpdate(response);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const response = await postService.addComment(post.id, comment);
      console.log(response)
      onUpdate(response);
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await postService.removeComment(post.id, commentId);
      
      onUpdate(response);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="mt-4 space-y-4" onClick={() => showLikesList && setShowLikesList(false)}>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            className={`flex items-center space-x-1 ${post.likes.includes(loggedUserId) ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill={post.likes.includes(loggedUserId) ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowLikesList(!showLikesList);
              }}
              className="hover:underline"
            >
              {post.likes.length} Likes
            </button>
          </button>
          
          {showLikesList && post.likes.length > 0 && (
            <div className="absolute left-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="max-h-48 overflow-y-auto">
                {likedUsers.map((likedUser) => (
                  <div key={likedUser.id} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                    <img
                      src={likedUser.profilePicture || 'https://via.placeholder.com/24'}
                      alt={likedUser.name}
                      className="h-6 w-6 rounded-full"
                    />
                    <span>{likedUser.name || likedUser.email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1 text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span>{post.comments?.length || 0} Comments</span>
        </button>
      </div>

      {showComments && (
        <div className="space-y-4">
          <form onSubmit={handleComment} className="flex space-x-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Post
            </button>
          </form>

          <div className="space-y-2">
            {post.comments?.map((comment) => {
              const commentContent = typeof comment.content === 'string' ? comment.content : comment.content?.content;
              const commentUser = comment.user || { name: comment.userId };
              return (
                <div key={comment.id} className="flex items-start justify-between rounded-lg bg-gray-50 p-3">
                  <div>
                    <p className="font-medium text-gray-900">{commentUser.name}</p>
                    <p className="text-gray-600">{commentContent}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {comment.userId === loggedUserId && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostInteractions;