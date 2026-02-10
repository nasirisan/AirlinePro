import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { Home } from 'lucide-react';
import { motion } from 'motion/react';

export const Press: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useBooking();

  const isActive = (path: string) => location.pathname === path;

  const articles = [
    {
      date: '2025-11-15',
      title: 'NAS Airlines Launches Revolutionary Queue-Based Waiting List System',
      excerpt: 'Introducing fair and transparent seat allocation with VIP priority for frequent flyers...'
    },
    {
      date: '2025-09-08',
      title: 'NAS Airlines Achieves 99.2% On-Time Performance in Q3 2025',
      excerpt: 'Industry-leading operational excellence continues to drive customer satisfaction...'
    },
    {
      date: '2025-07-22',
      title: 'NAS Airlines Expands Fleet with 25 New Sustainable Aircraft',
      excerpt: 'Commitment to carbon-neutral flying by 2030 with latest generation aircraft...'
    }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <nav className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => window.location.href = '/'}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${isActive('/') ? 'bg-blue-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            <Home className="w-5 h-5" />
            Home
          </button>
          <button
            onClick={() => navigate('/press')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${isActive('/press') ? 'bg-blue-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            Press
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={`text-5xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Press & Media
          </h1>
          <p className={`text-xl mb-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Latest news and announcements from NAS Airlines
          </p>

          <div className="space-y-6 mb-12">
            {articles.map((article, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-lg border p-6 cursor-pointer transition-all hover:shadow-lg hover:border-blue-600 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
              >
                <p className="text-sm text-blue-600 font-semibold mb-2">{article.date}</p>
                <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {article.title}
                </h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {article.excerpt}
                </p>
                <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
                  Read More →
                </button>
              </motion.div>
            ))}
          </div>

          <div className={`rounded-xl border p-8 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Press Inquiries
            </h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              For media inquiries, interviews, or high-resolution images, please contact our Press Relations team:
            </p>
            <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              press@nasairlines.com
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
