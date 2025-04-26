import React from 'react';

const LearningPlanCard = ({ plan, onEdit, onDelete }) => {
  const { title, description, contentUrl, tags, thumbnailUrl, userId /* Assuming userId is available for potential future use */ } = plan;

  const handleCardClick = () => {
    if (contentUrl) {
      window.open(contentUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className="bg-white shadow-md rounded-lg overflow-hidden mb-4 cursor-pointer transition-transform duration-200 hover:scale-105" 
      onClick={handleCardClick}
      title={`Click to watch: ${title}`}
    >
      {thumbnailUrl && (
        <img 
          src={thumbnailUrl} 
          alt={`Thumbnail for ${title}`} 
          className="w-full h-48 object-cover" 
          onError={(e) => { e.target.onerror = null; e.target.src='/images/default-thumbnail.svg'; }} // Fallback image
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm mb-3">{description}</p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        {/* Add other details like user info, likes, comments count if needed */}

        {/* Edit and Delete Buttons (Placeholder - Functionality to be added) */}
        <div className="mt-4 flex justify-end space-x-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(plan); }} // Call onEdit handler
            className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded transition duration-150"
          >
            Edit
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(plan.id); }} // Call onDelete handler
            className="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition duration-150"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningPlanCard;