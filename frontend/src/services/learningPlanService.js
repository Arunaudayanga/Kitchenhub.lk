import axios from './axiosConfig';

const API_URL = '/api/learning-plans';

// Function to extract YouTube Video ID from URL
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};
<div className="container mx-auto px-4 py-8"></div>
// Function to get YouTube thumbnail URL
const getYouTubeThumbnail = (videoId) => {
  if (!videoId) return null; // Or return a default thumbnail URL
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`; // Medium quality thumbnail
};

const createLearningPlan = async (planData) => {
  try {
    const response = await axios.post(API_URL, planData);
    return response.data;
  } catch (error) {
    console.error('Error creating learning plan:', error.response?.data || error.message);
    throw error;
  }
};

const getMyLearningPlans = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(`${API_URL}/my`, { params: { page, size } });
    // Add thumbnail URL to each plan
    const plansWithThumbnails = response.data.content.map(plan => {
      const videoId = getYouTubeVideoId(plan.contentUrl);
      const thumbnailUrl = getYouTubeThumbnail(videoId);
      return { ...plan, thumbnailUrl };
    });
    return { ...response.data, content: plansWithThumbnails };
  } catch (error) {
    console.error('Error fetching user learning plans:', error.response?.data || error.message);
    throw error;
  }
};

const getPublicLearningPlans = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(`${API_URL}/public`, { params: { page, size } });
    // Add thumbnail URL to each plan
    const plansWithThumbnails = response.data.content.map(plan => {
      const videoId = getYouTubeVideoId(plan.contentUrl);
      const thumbnailUrl = getYouTubeThumbnail(videoId);
      return { ...plan, thumbnailUrl };
    });
    return { ...response.data, content: plansWithThumbnails };
  } catch (error) {
    console.error('Error fetching public learning plans:', error.response?.data || error.message);
    throw error;
  }
};

// Function to update a learning plan
const updateLearningPlan = async (planId, planData) => {
  try {
    const response = await axios.put(`${API_URL}/${planId}`, planData);
    // Optionally re-fetch or process the updated plan data
    const videoId = getYouTubeVideoId(response.data.contentUrl);
    const thumbnailUrl = getYouTubeThumbnail(videoId);
    return { ...response.data, thumbnailUrl };
  } catch (error) {
    console.error(`Error updating learning plan ${planId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Function to delete a learning plan
const deleteLearningPlan = async (planId) => {
  try {
    await axios.delete(`${API_URL}/${planId}`);
    // No content is typically returned on successful delete
  } catch (error) {
    console.error(`Error deleting learning plan ${planId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Add other service functions as needed (getById, follow, etc.)

export default {
  createLearningPlan,
  getMyLearningPlans,
  getPublicLearningPlans,
  updateLearningPlan,
  deleteLearningPlan,
  getYouTubeVideoId, // Export helper if needed elsewhere
  getYouTubeThumbnail // Export helper if needed elsewhere
};