import axiosInstance from './axiosConfig';

const postService = {
  createPost: async (content, mediaFiles = [], postType = 'SKILL_SHARING') => {
    try {
      // Convert images to base64
      const mediaUrls = await Promise.all(
        mediaFiles.map(async (file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );

      const response = await axiosInstance.post('/posts', {
        description: content,
        media: mediaUrls,
        type: postType
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create post');
    }
  },

  getAllPosts: async (page = 0, size = 10) => {
    try {
      const response = await axiosInstance.get(`/posts?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch posts');
    }
  },

  likePost: async (postId) => {
    try {
      const response = await axiosInstance.post(`/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to like post');
    }
  },

  unlikePost: async (postId) => {
    try {
      const response = await axiosInstance.delete(`/posts/${postId}/unlike`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to unlike post');
    }
  },

  addComment: async (postId, content) => {
    try {
      console.log(content)
      const response = await axiosInstance.post(`/posts/${postId}/comments`, { content: content });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add comment');
    }
  },

  removeComment: async (postId, commentId) => {
    try {
      const response = await axiosInstance.delete(`/posts/${postId}/comments/${commentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove comment');
    }
  }
};

export default postService;