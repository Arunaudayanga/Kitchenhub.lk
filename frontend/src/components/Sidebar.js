import { useRouter } from 'next/router';
import { FaBook, FaChartLine, FaUser, FaSignOutAlt, FaTasks, FaNewspaper, FaUsers } from 'react-icons/fa'; // Added FaUsers
import authService from '../services/authService'; // Assuming authService handles logout

const Sidebar = () => {
  const router = useRouter();

  const handleLogout = () => {
    authService.logout(); // Assuming a logout method exists
    router.push('/auth/login');
  };

  const isActive = (pathname) => router.pathname === pathname;

  return (
    <nav className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-4 flex flex-col">
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-2xl font-bold text-primary">UpSkillHub</h1>
      </div>

      <div className="space-y-4 flex-grow">
        <button
          onClick={() => router.push('/feed')}
          className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${isActive('/feed') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-primary/10 hover:text-primary'}`}
        >
          <FaNewspaper /> <span>Feed</span>
        </button>
        {/* Remove Dashboard link as requested */}
        {/* <button
          onClick={() => router.push('/dashboard')}
          className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${isActive('/dashboard') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-primary/10 hover:text-primary'}`}
        >
          <FaChartLine /> <span>Dashboard</span>
        </button> */}
        <button
          onClick={() => router.push('/learning-progress')}
          className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${isActive('/learning-progress') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-primary/10 hover:text-primary'}`}
        >
          <FaChartLine /> <span>Learning Progress</span>
        </button>
        <button
          onClick={() => router.push('/learning-plans')}
          className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${isActive('/learning-plans') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-primary/10 hover:text-primary'}`}
        >
          <FaTasks /> <span>Learning Plans</span>
        </button>
        <button
          onClick={() => router.push('/users')}
          className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${isActive('/users') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-primary/10 hover:text-primary'}`}
        >
          <FaUsers /> <span>Users</span>
        </button>
        <button
          onClick={() => router.push('/profile')}
          className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${isActive('/profile') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-primary/10 hover:text-primary'}`}
        >
          <FaUser /> <span>Profile</span>
        </button>
      </div>

      <button
        onClick={handleLogout}
        className="w-full flex items-center space-x-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-auto mb-4"
      >
        <FaSignOutAlt /> <span>Logout</span>
      </button>
    </nav>
  );
};

export default Sidebar;