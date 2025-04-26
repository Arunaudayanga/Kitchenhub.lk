import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="ml-64 flex-grow p-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;