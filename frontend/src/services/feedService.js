import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const feedService = {
  // Fetch user's personalized feed
  async getFeed() {
    try {
      const response = await axios.get(`${API_URL}/api/feed`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching feed:', error);
      return null;
    }
  },

  // Fetch curated content for new users
  async getCuratedContent() {
    try {
      const response = await axios.get(`${API_URL}/api/feed/curated`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching curated content:', error);
      return null;
    }
  },

  // Get recommended users to follow
  async getRecommendedUsers() {
    try {
      const response = await axios.get(`${API_URL}/api/users/recommended`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recommended users:', error);
      return null;
    }
  },

  // Get trending topics
  async getTrendingTopics() {
    try {
      const response = await axios.get(`${API_URL}/api/topics/trending`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending topics:', error);
      return null;
    }
  }
};

export default feedService;