import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { Plane, ArrowLeft, Calendar, MapPin, DollarSign, Home } from 'lucide-react';
import { motion } from 'motion/react';

export const MyBookings: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookings, cancelBooking, currentPassenger, theme } = useBooking();
  const isActive = (path: string) => location.pathname === path;

  // Filter bookings to only show current passenger's bookings
  const myBookings = currentPassenger 
    ? bookings.filter(b => b.passenger.id === currentPassenger.id)
    : [];

  const handleCancel = (bookingId: string) => {
    const confirmed = window.confirm('Cancel this booking? This will release your seat.');
    if (!confirmed) return;
    cancelBooking(bookingId);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
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
            onClick={() => navigate('/bookings')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${isActive('/bookings') ? 'bg-blue-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            My Bookings
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Plane className="w-8 h-8 text-blue-600" />
              <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                My Bookings
              </h1>
            </div>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {currentPassenger ? `Showing bookings for ${currentPassenger.name}` : 'View and manage all your flight bookings'}
            </p>
          </div>

          {!currentPassenger ? (
            <div className={`rounded-xl border-2 border-dashed py-16 text-center ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'}`}>
              <Plane className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                No passenger logged in
              </h3>
              <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Book a flight first to see your bookings
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Search Flights
              </button>
            </div>
          ) : myBookings.length === 0 ? (
            <div className={`rounded-xl border-2 border-dashed py-16 text-center ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'}`}>
              <Plane className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                No bookings yet
              </h3>
              <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Start by searching and booking a flight
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Search Flights
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Booking Reference</p>
                      <p className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {booking.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Passenger</p>
                      <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {booking.passenger.name}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Seat</p>
                      <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {booking.seat.seatNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                        booking.status === 'Cancelled'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  {booking.status !== 'Cancelled' && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          theme === 'dark'
                            ? 'border-red-700 text-red-300 hover:bg-red-900/30'
                            : 'border-red-300 text-red-700 hover:bg-red-50'
                        }`}
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
