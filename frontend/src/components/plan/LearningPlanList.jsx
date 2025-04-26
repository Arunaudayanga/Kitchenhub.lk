import React, { useState, useEffect, useCallback } from 'react';
import learningPlanService from '../../services/learningPlanService';
import LearningPlanCard from './LearningPlanCard';
import LearningPlanEditModal from './LearningPlanEditModal'; // Import the modal

const LearningPlanList = ({ fetchPublic = false, userId = null, refreshTrigger }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [editingPlan, setEditingPlan] = useState(null); // State to hold the plan being edited
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const loadPlans = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;
        if (fetchPublic) {
          response = await learningPlanService.getPublicLearningPlans(page);
        } else if (userId) { // Assuming we might want to fetch plans for a specific user later
          // response = await learningPlanService.getUserPlans(userId, page); // Example
          response = await learningPlanService.getMyLearningPlans(page); // Fetch current user's plans for now
        } else {
           response = await learningPlanService.getMyLearningPlans(page); // Default to logged-in user's plans
        }

        if (response && response.content) {
          setPlans(prevPlans => page === 0 ? response.content : [...prevPlans, ...response.content]);
          setHasMore(!response.last);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        setError('Failed to load learning plans.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Reset page to 0 and clear plans when refreshTrigger changes
    // This ensures the list refreshes from the start including the new item
    if (refreshTrigger > 0) { // Check if it's not the initial load
        setPage(0);
        setPlans([]); // Clear existing plans before fetching page 0 again
    }
    loadPlans();
  }, [page, fetchPublic, userId, refreshTrigger]); // Add refreshTrigger to dependencies

  // Handlers for Edit/Delete actions passed down to Card
  const handleEdit = useCallback((plan) => {
    setEditingPlan(plan);
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback(async (planId) => {
    // Optional: Add a confirmation dialog here
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      try {
        await learningPlanService.deleteLearningPlan(planId);
        // Remove the plan from the local state
        setPlans(prevPlans => prevPlans.filter(p => p.id !== planId));
        // Optionally show a success message
      } catch (err) {
        setError('Failed to delete learning plan.');
        console.error('Delete error:', err);
        // Optionally show an error message to the user
      }
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingPlan(null);
  }, []);

  const handlePlanUpdated = useCallback((updatedPlan) => {
    // Update the plan in the local state
    setPlans(prevPlans => prevPlans.map(p => (p.id === updatedPlan.id ? updatedPlan : p)));
    // Optionally show a success message
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {fetchPublic ? 'Public Learning Plans' : 'My Learning Plans'}
      </h2>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
      {plans.length === 0 && !loading && (
        <p className="text-gray-500">No learning plans found.</p>
      )}
      {isEditModalOpen && editingPlan && (
        <LearningPlanEditModal
          plan={editingPlan}
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          onPlanUpdated={handlePlanUpdated}
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <LearningPlanCard
            key={plan.id}
            plan={plan}
            onEdit={handleEdit} // Pass edit handler
            onDelete={handleDelete} // Pass delete handler
          />
        ))}
      </div>
      {loading && <p className="text-center mt-4 text-gray-500">Loading...</p>}
      {!loading && hasMore && (
        <div className="text-center mt-6">
          <button 
            onClick={loadMore} 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default LearningPlanList;