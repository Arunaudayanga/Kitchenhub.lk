import React, { useState, useEffect } from 'react'; // Added useEffect
import { FaUserPlus, FaUserCheck } from 'react-icons/fa';
// import userService from '../../services/userService'; // Will uncomment later
import userService from '../../services/userService'; // Uncommented

const UserCard = ({ user, currentUser }) => {
  // Assuming 'user' prop contains { id, name, email, profilePictureUrl, followers: [], following: [] }
  // Assuming 'currentUser' prop contains the logged-in user's ID and following list { id, following: [] }

  // Placeholder state - replace with actual follow status from backend/context
  // const [isFollowing, setIsFollowing] = useState(false); // Determine initial state based on currentUser.following.includes(user.id)
  const [isFollowing, setIsFollowing] = useState(false); // Initial state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Determine initial follow state when component mounts or currentUser/user changes
    if (currentUser?.following?.includes(user.id)) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  }, [currentUser, user.id]); // Dependencies

  const handleFollowToggle = async () => {
    if (!currentUser) {
      console.error("Cannot follow/unfollow: User not logged in.");
      // Optionally show a message to the user
      return;
    }
    setIsLoading(true);
    try {
      if (isFollowing) {
        // await userService.unfollowUser(user.id); // Call unfollow API
        await userService.unfollowUser(user.id); // Use actual service
        console.log(`Unfollowed ${user.name}`); // Placeholder
        setIsFollowing(false);
      } else {
        // await userService.followUser(user.id); // Call follow API
        await userService.followUser(user.id); // Use actual service
        console.log(`Followed ${user.name}`); // Placeholder
        setIsFollowing(true);
      }
      // Optionally: Update currentUser context/state if needed after follow/unfollow
    } catch (error) {
      console.error('Failed to update follow status:', error);
      // Add user feedback (e.g., toast notification)
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show follow button for the current user's own card
  const isCurrentUser = currentUser?.id === user.id;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center transition-shadow hover:shadow-lg">
      <img
        src={user.profilePictureUrl || '/images/default-avatar.png'} // Provide a default avatar
        alt={`${user.name || 'Unnamed User'}'s profile picture`}
        className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-gray-200"
      />
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{user.name || 'Unnamed User'}</h3>
      <p className="text-sm text-gray-500 mb-3">{user.email || 'No email provided'}</p>

      {/* Add other user details if needed, e.g., skills, bio */} 

      {!isCurrentUser && currentUser && ( // Also check if currentUser exists
        <button
          onClick={handleFollowToggle}
          disabled={isLoading}
          className={`mt-auto px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-1 w-full ${isFollowing
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-primary text-white hover:bg-primary-dark'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <span>Loading...</span>
          ) : isFollowing ? (
            <><FaUserCheck /> <span>Following</span></>
          ) : (
            <><FaUserPlus /> <span>Follow</span></>
          )}
        </button>
      )}
    </div>
  );
};

export default UserCard;