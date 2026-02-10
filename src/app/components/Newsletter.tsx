import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { Home, Mail, Bell, Gift, Plane, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const Newsletter: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useBooking();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
    }, 1500);
  };

  const perks = [
    {
      icon: Gift,
      title: 'Exclusive Deals',
      description: 'Be the first to know about flash sales, discount codes, and members-only fare drops.',
    },
    {
      icon: Bell,
      title: 'Flight Alerts',
      description: 'Get notified when prices drop on your favorite routes and destinations.',
    },
    {
      icon: Plane,
      title: 'Travel Inspiration',
      description: 'Discover new destinations, travel tips, and curated itineraries from our team.',
    },
    {
      icon: Mail,
      title: 'Monthly Digest',
      description: 'A roundup of the latest news, promotions, and updates from Seven Airlines.',
    },
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
            onClick={() => navigate('/newsletter')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${isActive('/newsletter') ? 'bg-blue-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            Newsletter
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {!subscribed ? (
            <>
              {/* Hero Section */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-6">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className={`text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Join Our Newsletter
                </h1>
                <p className={`text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Stay in the loop with Seven Airlines. Get exclusive deals, flight alerts, travel inspiration, and promotions delivered straight to your inbox.
                </p>
              </div>

              {/* Email Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`max-w-xl mx-auto rounded-2xl border p-8 mb-16 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
              >
                <h2 className={`text-2xl font-bold mb-2 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Subscribe Now
                </h2>
                <p className={`text-center mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Enter your email to start receiving our newsletter
                </p>
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-400'}`}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2 text-lg"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Subscribing...
                      </>
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <p className={`text-xs text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </form>
              </motion.div>

              {/* Perks Grid */}
              <div className="mb-16">
                <h2 className={`text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  What You'll Get
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {perks.map((perk, idx) => {
                    const Icon = perk.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        className={`rounded-xl border p-6 text-center ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                      >
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {perk.title}
                        </h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {perk.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                You're Subscribed!
              </h1>
              <p className={`text-xl mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Welcome aboard! We've sent a confirmation to
              </p>
              <p className="text-blue-600 font-bold text-lg mb-8">{email}</p>
              <p className={`text-base max-w-md mx-auto mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                You'll start receiving exclusive deals, flight alerts, travel inspiration, and promotions from Seven Airlines. Keep an eye on your inbox!
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors inline-flex items-center gap-2"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
