import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { ArrowLeft, Search, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const FlightStatus: React.FC = () => {
  const navigate = useNavigate();
  const { bookings, theme } = useBooking();
  const [searchRef, setSearchRef] = useState('');
  const [foundBooking, setFoundBooking] = useState<typeof bookings[0] | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const booking = bookings.find(b => b.id.toUpperCase().includes(searchRef.toUpperCase()));
    setFoundBooking(booking || null);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <nav className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 font-medium transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Flight Status
          </h1>
          <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Track your flight in real-time
          </p>

          <div className={`rounded-2xl border p-8 mb-8 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <form onSubmit={handleSearch}>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={searchRef}
                  onChange={(e) => setSearchRef(e.target.value)}
                  placeholder="Enter booking reference (e.g., BK123456)"
                  className={`flex-1 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Search
                </button>
              </div>
            </form>
          </div>

          {searchRef && !foundBooking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`rounded-xl border p-6 flex items-center gap-4 ${theme === 'dark' ? 'bg-red-900/20 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}
            >
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <p>No booking found. Please check your reference number.</p>
            </motion.div>
          )}

          {foundBooking && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`rounded-xl border p-8 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Booking Reference</p>
                  <p className="text-2xl font-bold text-blue-600 mb-4">{foundBooking.id.slice(0, 8).toUpperCase()}</p>

                  <p className={`text-sm mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Passenger Name</p>
                  <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{foundBooking.passenger.name}</p>

                  <p className={`text-sm mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Booking Status</p>
                  <span className="inline-block mt-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-bold">
                    Confirmed
                  </span>
                </div>

                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Seat Assignment</p>
                  <p className="text-3xl font-bold text-blue-600 mb-4">{foundBooking.seat.seatNumber}</p>

                  <p className={`text-sm mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Seat Class</p>
                  <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{foundBooking.seat.class}</p>

                  <p className={`text-sm mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Price Paid</p>
                  <p className="text-2xl font-bold text-green-600">${foundBooking.totalPrice}</p>
                </div>
              </div>

              <div className={`border-t ${theme === 'dark' ? 'border-gray-700 pt-6' : 'border-gray-200 pt-6'}`}>
                <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Status Timeline</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Booking Confirmed</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Your ticket has been issued</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Check-in Available</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>You can check in 24 hours before your flight</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className={`font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Boarding</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Pending</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
