import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Head from 'next/head';
import learningProgressService from '../services/learningProgressService'; // Import the service

// Define predefined templates - Keeping this for now, might replace/combine with skillName
const progressTemplates = [
  'Completed tutorial',
  'Learned skill',
  'Finished project section',
  'Read documentation',
  'Solved a problem',
  'Other achievement',
];

// Define Progress Levels based on backend model
const progressLevels = [
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
  'EXPERT',
];

const LearningProgressPage = () => {
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Form state
  const [newSkillName, setNewSkillName] = useState(''); // New state for skill name
  const [newProgressLevel, setNewProgressLevel] = useState(progressLevels[0]); // New state for progress level
  const [newUpdateType, setNewUpdateType] = useState(progressTemplates[0]); // Keep type for now, maybe phase out
  const [newUpdateDescription, setNewUpdateDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const fetchProgress = () => {
    setIsLoading(true);
    setError(null);
    learningProgressService.getUserProgress()
      .then(response => {
        const updates = response.data.content || response.data || [];
        updates.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
        setProgressUpdates(updates);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching progress:", err);
        setError('Failed to load progress updates. Please ensure you are logged in.');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchProgress(); // Fetch progress on component mount
  }, []);


  const handleAddProgress = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) { // Check skill name instead of description
      setSubmitError('Please provide the skill name.');
      return;
    }
    if (!newUpdateDescription.trim()) {
      setSubmitError('Please provide a description for your progress.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);

    const updateData = {
      skillName: newSkillName, // Use new state
      currentLevel: newProgressLevel, // Use new state
      description: newUpdateDescription,
      // type: newUpdateType, // Decide if 'type' is still needed or replaced by skillName/level
    };

    try {
      const newUpdate = await learningProgressService.addProgressUpdate(updateData);
      // Prepend the new update to the list
      setProgressUpdates([newUpdate.data, ...progressUpdates]);
      // Reset form fields
      setNewSkillName('');
      setNewProgressLevel(progressLevels[0]);
      setNewUpdateType(progressTemplates[0]); // Reset if still used
      setNewUpdateDescription('');
    } catch (err) {      console.error("Error adding progress:", err);
      // Provide more specific error feedback if possible from err.response.data
      const errorMsg = err.response?.data?.message || 'Failed to add progress update. Please try again.';
      setSubmitError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Head>
        <title>Learning Progress - UpSkillHub</title>
      </Head>
      <Sidebar />
      <main className="flex-1 p-8 ml-64">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Learning Progress</h1>

        {/* Section to Add New Progress Update */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Log Your Progress</h2>
          <form onSubmit={handleAddProgress}>
            {/* Skill Name Input */}
            <div className="mb-4">
              <label htmlFor="skillName" className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
              <input
                type="text"
                id="skillName"
                placeholder="e.g., React Hooks, Python Data Analysis"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            {/* Progress Level Dropdown */}
            <div className="mb-4">
              <label htmlFor="progressLevel" className="block text-sm font-medium text-gray-700 mb-1">Current Level</label>
              <select
                id="progressLevel"
                value={newProgressLevel}
                onChange={(e) => setNewProgressLevel(e.target.value)}
                className="p-2 border rounded w-full bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {progressLevels.map(level => (
                  <option key={level} value={level}>{level.charAt(0) + level.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </div>

            {/* Description Textarea */}
            <div className="mb-4">
              <label htmlFor="progressDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="progressDescription"
                placeholder="Describe what you achieved or learned..."
                value={newUpdateDescription}
                onChange={(e) => setNewUpdateDescription(e.target.value)}
                className="p-2 border rounded w-full h-24 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            {/* Optional: Keep Type dropdown if needed, or remove */}
            {/* <div className="mb-4">
              <label htmlFor="progressType" className="block text-sm font-medium text-gray-700 mb-1">Type of Update (Optional)</label>
              <select
                id="progressType"
                value={newUpdateType}
                onChange={(e) => setNewUpdateType(e.target.value)}
                className="p-2 border rounded w-full bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {progressTemplates.map(template => (
                  <option key={template} value={template}>{template}</option>
                ))}
              </select>
            </div> */}

            {submitError && <p className="text-red-500 text-sm mb-3">{submitError}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors disabled:opacity-50 ${isSubmitting ? 'cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Adding...' : 'Add Update'}
            </button>
          </form>
        </div>

        {/* Section to Display Progress Updates (Will be updated next) */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Journey</h2>
          {isLoading ? (
            <p className="text-gray-600">Loading progress...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : progressUpdates.length > 0 ? (
            <ul className="space-y-6"> {/* Increased spacing */}
              {progressUpdates.map((update) => (
                <li key={update.id || update._id} className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-primary">{update.skillName || 'General Update'}</h3>
                    {update.currentLevel && (
                      <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                        {update.currentLevel.charAt(0) + update.currentLevel.slice(1).toLowerCase()}
                      </span>
                    )}
                  </div>
                  {update.description && <p className="text-gray-700 mb-3">{update.description}</p>}
                  <p className="text-sm text-gray-500">
                    Logged on: {new Date(update.createdAt || update.date).toLocaleString()}
                  </p>
                  {/* Future enhancements: Display milestones or resources */}
                  {/* {update.milestones && update.milestones.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-600">Milestones:</p>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {update.milestones.map((m, index) => (
                          <li key={index} className={m.completed ? 'line-through text-gray-400' : ''}>{m.description}</li>
                        ))}
                      </ul>
                    </div>
                  )} */}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No progress updates logged yet. Use the form above to add your first achievement!</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default LearningProgressPage;