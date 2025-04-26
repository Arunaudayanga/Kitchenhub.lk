import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaUsers, FaLightbulb } from 'react-icons/fa';

const LandingPage = () => {
  const [isHovered, setIsHovered] = useState(null);

  const features = [
    {
      icon: <FaGraduationCap className="text-4xl text-primary" />,
      title: 'Skill Development',
      description: 'Learn from experts and develop new skills through interactive courses'
    },
    {
      icon: <FaUsers className="text-4xl text-primary" />,
      title: 'Community Learning',
      description: 'Connect with like-minded learners and share knowledge'
    },
    {
      icon: <FaLightbulb className="text-4xl text-primary" />,
      title: 'Expert Guidance',
      description: 'Get mentored by industry professionals and accelerate your growth'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center md:text-left"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Unlock Your Potential with
              <span className="text-primary block mt-2">UpSkillHub</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Join our community of learners and experts. Share knowledge, grow skills, and achieve your goals together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/auth/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-primary text-white rounded-lg font-semibold shadow-lg hover:bg-primary-dark transition-colors"
                >
                  Get Started
                </motion.button>
              </Link>
              <Link href="/auth/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
                >
                  Sign In
                </motion.button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <img
              src="/hero-image.svg"
              alt="Learning Illustration"
              className="w-full max-w-lg mx-auto"
            />
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose UpSkillHub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                onHoverStart={() => setIsHovered(index)}
                onHoverEnd={() => setIsHovered(null)}
                className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;