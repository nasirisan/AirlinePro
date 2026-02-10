import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { Home, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';

export const Careers: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useBooking();

  const isActive = (path: string) => location.pathname === path;

  const positions = [
    { title: 'Pilot', department: 'Flight Operations', location: 'Multiple' },
    { title: 'Flight Attendant', department: 'Cabin Crew', location: 'Multiple' },
    { title: 'Aviation Technician', department: 'Maintenance', location: 'Hub Cities' },
    { title: 'Customer Service Representative', department: 'Support', location: 'Remote' },
    { title: 'Software Engineer', department: 'Technology', location: 'HQ' },
    { title: 'Marketing Manager', department: 'Marketing', location: 'HQ' }
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
            onClick={() => navigate('/careers')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${isActive('/careers') ? 'bg-blue-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            Careers
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={`text-5xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Careers at NAS Airlines
          </h1>
          <p className={`text-xl mb-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Join our team and be part of the aviation industry's brightest talent
          </p>

          <div className={`rounded-xl border p-8 mb-12 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Why Work With Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className={`font-bold mb-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Competitive Benefits</p>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Industry-leading salary, health insurance, retirement plans, and flight privileges for you and your family.
                </p>
              </div>
              <div>
                <p className={`font-bold mb-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Career Growth</p>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Continuous training, mentorship programs, and clear pathways for advancement within the company.
                </p>
              </div>
              <div>
                <p className={`font-bold mb-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Diverse Team</p>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Work with talented professionals from around the world in an inclusive, supportive environment.
                </p>
              </div>
              <div>
                <p className={`font-bold mb-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Innovation</p>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Cutting-edge technology and processes that make your work more efficient and rewarding.
                </p>
              </div>
            </div>
          </div>

          <h2 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Open Positions
          </h2>
          <div className="space-y-4">
            {positions.map((pos, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`rounded-lg border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:border-blue-600' : 'bg-white border-gray-200 hover:border-blue-600'} transition-all hover:shadow-lg cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <Briefcase className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {pos.title}
                      </h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {pos.department} • {pos.location}
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                    Apply
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className={`rounded-xl border p-8 mt-12 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Don't see a position that fits? Send your resume to
              <span className="font-bold text-blue-600"> careers@nasairlines.com</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
