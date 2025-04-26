import axiosInstance from './axiosConfig';

const API_URL = '/api/learning-progress';

// Fetch user's learning progress (paginated)
const getUserProgress = (page = 0, size = 10) => {
  // Retrieve userId from local storage or context
  // The backend expects userId as @AuthenticationPrincipal, which is handled by the security context based on the token.
  // We just need to pass page and size as query params.
  return axiosInstance.get(`${API_URL}`, {
    params: { page, size },
  });
};

// Add a new progress update
// NOTE: The current backend endpoint POST /api/learning-progress expects 'skillName'.
// This might need adjustment based on the requirement to log updates like 'completed tutorial' or 'learned skill'.
// For now, we might adapt or use a placeholder structure.
const addProgressUpdate = (updateData) => {
  
  return axiosInstance.post(API_URL, updateData); // Send the full object in the body
};

// Placeholder for updating progress (if needed)
const updateProgress = (progressId, progressDetails) => {
  // Backend expects userId via @AuthenticationPrincipal
  return axiosInstance.put(`${API_URL}/${progressId}`, progressDetails);
};

// Placeholder for adding a milestone (if needed)
const addMilestone = (progressId, milestone) => {
  // Backend expects userId via @AuthenticationPrincipal
  return axiosInstance.post(`${API_URL}/${progressId}/milestones`, milestone);
};

// Placeholder for completing a milestone (if needed)
const completeMilestone = (progressId, milestoneIndex) => {
  // Backend expects userId via @AuthenticationPrincipal
  return axiosInstance.put(`${API_URL}/${progressId}/milestones/${milestoneIndex}/complete`);
};

// Placeholder for adding a completed resource (if needed)
const addCompletedResource = (progressId, resource) => {
  // Backend expects userId via @AuthenticationPrincipal
  return axiosInstance.post(`${API_URL}/${progressId}/resources`, resource);
};


const learningProgressService = {
  getUserProgress,
  addProgressUpdate,
  updateProgress, // Export if needed later
  addMilestone, // Export if needed later
  completeMilestone, // Export if needed later
  addCompletedResource, // Export if needed later
};

export default learningProgressService;