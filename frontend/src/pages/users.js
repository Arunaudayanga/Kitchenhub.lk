import React, { useState, useEffect, useContext } from 'react';
import MainLayout from '../components/MainLayout';
import userService from '../services/userService'; // Uncommented
import UserCard from '../components/user/UserCard'; // Uncommented
import authService from '../services/authService'; // Uncommented

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggedUserId, setLoggedUserId] = useState('');
  const [currentUser, setCurrentUser] = useState(); // Uncommented

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    console.log(currentUser)
    setCurrentUser(currentUser)
    setLoggedUserId(currentUser?.userId);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await userService.getAllUsers(); // Use the service
        // Filter out the current user from the list
        const otherUsers = fetchedUsers.filter(u => u.id !== loggedUserId);
        setUsers(otherUsers);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError('Failed to load users. Please try again later.');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) { // Fetch users only if currentUser is available
        fetchUsers();
    } else {
        setLoading(false); // Stop loading if no user is logged in
        setError('Please log in to view users.');
    }

    // setLoading(false); // Remove this line when fetchUsers is uncommented - Already removed
  }, [currentUser]); // Add currentUser as dependency

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Discover Users</h1>
        {loading && <p className="text-center text-gray-500">Loading users...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Placeholder for User Cards */}
            {users.length === 0 && !loading && <p className="col-span-full text-center text-gray-500">No other users found.</p>}
            {users.map(user => (
              <UserCard key={user.id} user={user} currentUser={currentUser} /> // Pass currentUser
            ))}
            {/* <p className="text-gray-500 col-span-full">User cards will be displayed here.</p> */}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default UsersPage;