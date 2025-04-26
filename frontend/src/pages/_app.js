import '../styles/globals.css';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '../components/MainLayout'; // Import MainLayout
import { useRouter } from 'next/router'; // Import useRouter

// Define routes that need the sidebar layout
const authRoutes = ['/feed', '/my-courses', '/learning-plans', '/profile']; // Add other authenticated routes as needed

function MyApp({ Component, pageProps }) { // Removed router from props as we use the hook
  const router = useRouter(); // Use the hook inside the component

  // Check if the current route requires the MainLayout
  // In a real app, you'd also check for authentication status here
  const requiresLayout = authRoutes.includes(router.pathname);

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={router.route} // Use router.route from the hook
        initial="initialState"
        animate="animateState"
        exit="exitState"
        transition={{
          duration: 0.75
        }}
        variants={{
          initialState: {
            opacity: 0,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'
          },
          animateState: {
            opacity: 1,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'
          },
          exitState: {
            clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)'
          }
        }}
        className="app-container" // Added a class for potential global styling
      >
        {/* Conditionally apply the layout */}
        {requiresLayout ? (
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        ) : (
          <Component {...pageProps} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default MyApp;