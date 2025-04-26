import axiosInstance from './axiosConfig';

const userService = {
  getAllUsers: async () => { // New function to get all users
    try {
      const response = await axiosInstance.get('/api/users'); // Assuming this endpoint exists or will be created
      return response.data;
    } catch (error) {
      console.error('Failed to fetch all users:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch all users');
    }
  },

  getUsersByIds: async (userIds) => {
    try {
      const response = await axiosInstance.get(`/api/users/batch?userIds=${userIds.join(',')}`)
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  }
    // Add follow/unfollow functions later
    ,
  
    followUser: async (userIdToFollow) => {
      try {
        // Assuming the backend expects the follower's ID in the URL or body.
        // Adjust the endpoint/payload as per your backend API design.
        // Here, we assume the backend gets the current user ID from the auth token.
        const response = await axiosInstance.post(`/api/users/follow/${userIdToFollow}`);
        return response.data;
      } catch (error) {
        console.error('Failed to follow user:', error);
        throw new Error(error.response?.data?.message || 'Failed to follow user');
      }
    },
  
    unfollowUser: async (userIdToUnfollow) => {
      try {
        // Adjust endpoint/payload as per backend API design.
        const response = await axiosInstance.post(`/api/users/unfollow/${userIdToUnfollow}`);
        return response.data;
      } catch (error) {
        console.error('Failed to unfollow user:', error);
        throw new Error(error.response?.data?.message || 'Failed to unfollow user');
      }
    }
  };
  

export default userService;