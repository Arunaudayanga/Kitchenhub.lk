import axiosInstance from './axiosConfig';

const authService = {
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });
      
      if (response.data.token && response.data.userId) {
        const userData = {
          token: response.data.token,
          userId: response.data.userId, // This is now available from backend
          type: response.data.type
        };
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to login');
    }
  },

  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to register');
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  updateToken: (token) => {
    const user = authService.getCurrentUser();
    if (user) {
      user.token = token;
      localStorage.setItem('user', JSON.stringify(user));
    }
  },

  setupAxiosInterceptors: (token) => {
    // Interceptors are now handled in axiosConfig.js
    return token;
  }
};

export default authService;