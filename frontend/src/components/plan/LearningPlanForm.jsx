import React, { useState } from 'react';
import learningPlanService from '../../services/learningPlanService';

const LearningPlanForm = ({ onPlanCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [tags, setTags] = useState(''); // Input as comma-separated string
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const planData = {
      title,
      description,
      contentUrl,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''), // Convert string to array
      // Add other fields like skillArea, difficultyLevel if needed
    };

    try {
      const newPlan = await learningPlanService.createLearningPlan(planData);
      setTitle('');
      setDescription('');
      setContentUrl('');
      setTags('');
      if (onPlanCreated) {
        onPlanCreated(newPlan); // Notify parent component
      }
    } catch (err) {
      setError('Failed to create learning plan. Please check the details and try again.');
      console.error('Error creating plan:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Create New Learning Plan</h2>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
      
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>

      <div className="mb-4">
        <label htmlFor="contentUrl" className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
        <input
          type="url"
          id="contentUrl"
          value={contentUrl}
          onChange={(e) => setContentUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., react, javascript, webdev"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Creating...' : 'Create Plan'}
      </button>
    </form>
  );
};

export default LearningPlanForm;