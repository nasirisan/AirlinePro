import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { Home, Search, AlertCircle, Plane, MapPin, Calendar, Clock, Armchair, DollarSign, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const FlightStatus: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookings, theme } = useBooking();
  const [searchRef, setSearchRef] = useState('');
  const [foundBooking, setFoundBooking] = useState<typeof bookings[0] | null>(null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    console.log('FlightStatus page loaded. Bookings:', bookings);
  }, [bookings]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search initiated:', { searchRef, totalBookings: bookings.length, bookings });
    // Search by booking reference (case-insensitive)
    const booking = bookings.find(b => {
      console.log(`Comparing ${b.bookingReference?.toUpperCase()} === ${searchRef.toUpperCase()}`);
      return b.bookingReference?.toUpperCase() === searchRef.toUpperCase();
    });
    console.log('Search result:', booking);
    setFoundBooking(booking || null);
  };

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
            onClick={() => navigate('/flight-status')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${isActive('/flight-status') ? 'bg-blue-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            Flight Status
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
                  placeholder="Enter your booking reference"
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} overflow-hidden`}
            >
              {/* Header with Status */}
              <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'} border-b ${theme === 'dark' ? 'border-gray-600' : 'border-blue-200'} p-6`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Booking Reference</p>
                    <p className="text-3xl font-bold text-blue-600">{foundBooking.bookingReference}</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-bold">
                    <CheckCircle className="w-5 h-5" />
                    CONFIRMED
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-8">
                {/* Passenger Info */}
                <div className="mb-8">
                  <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Passenger Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Name</p>
                      <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{foundBooking.passenger.name}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Passenger Type</p>
                      <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{foundBooking.passenger.type}</p>
                    </div>
                  </div>
                </div>

                {/* Flight Details */}
                <div className="mb-8">
                  <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Flight Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Flight Number</p>
                      <p className={`text-lg font-bold text-blue-600`}>{foundBooking.flight.flightNumber}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Date</p>
                      <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{foundBooking.flight.date}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Route</p>
                          <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{foundBooking.flight.from} → {foundBooking.flight.to}</p>
                        </div>
                      </div>
                    </div>
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Departure</p>
                          <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{foundBooking.flight.departureTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seat & Pricing */}
                <div className="mb-8">
                  <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Booking Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} border-2 border-blue-500`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Armchair className="w-5 h-5 text-blue-600" />
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Seat Assignment</p>
                      </div>
                      <p className="text-3xl font-bold text-blue-600">{foundBooking.seat.seatNumber}</p>
                      <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{foundBooking.seat.class}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Plane className="w-5 h-5 text-purple-600" />
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Ticket Class</p>
                      </div>
                      <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{foundBooking.ticketClass}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} border-2 border-green-500`}>
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Price Paid</p>
                      </div>
                      <p className="text-2xl font-bold text-green-600">${foundBooking.price}</p>
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div>
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
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
