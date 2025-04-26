import React, { useState, useEffect } from 'react';
import learningPlanService from '../../services/learningPlanService';

const LearningPlanEditModal = ({ plan, isOpen, onClose, onPlanUpdated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [tags, setTags] = useState(''); // Input as comma-separated string
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pre-fill form when the plan prop changes (modal opens)
  useEffect(() => {
    if (plan) {
      setTitle(plan.title || '');
      setDescription(plan.description || '');
      setContentUrl(plan.contentUrl || '');
      setTags(plan.tags ? plan.tags.join(', ') : '');
      setError(null); // Reset error when modal opens with new plan
    }
  }, [plan]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const updatedPlanData = {
      title,
      description,
      contentUrl,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      // Include other fields if they are editable
    };

    try {
      const updatedPlan = await learningPlanService.updateLearningPlan(plan.id, updatedPlanData);
      onPlanUpdated(updatedPlan); // Notify parent component (LearningPlanList via Card)
      onClose(); // Close the modal on success
    } catch (err) {
      setError('Failed to update learning plan. Please check the details and try again.');
      console.error('Error updating plan:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative mx-auto p-8 border w-full max-w-lg shadow-lg rounded-md bg-white">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Edit Learning Plan</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}

          <div className="mb-4">
            <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="edit-contentUrl" className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
            <input
              type="url"
              id="edit-contentUrl"
              value={contentUrl}
              onChange={(e) => setContentUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="edit-tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              id="edit-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., react, javascript, webdev"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LearningPlanEditModal;