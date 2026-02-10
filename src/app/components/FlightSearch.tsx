import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { Flight, PassengerType } from '../types';
import { StatusBadge } from './StatusBadge';
import { Plane, Calendar, Search, Users, DollarSign, Moon, Sun, Shield, Bell, Clock, ArrowRight, MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Home } from 'lucide-react';
import { motion } from 'motion/react';

export const FlightSearch: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchFlights, getAvailableDates, setCurrentPassenger, theme, toggleTheme } = useBooking();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('2026-02-15');
  const [passengers, setPassengers] = useState(1);
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  const isActive = (path: string) => location.pathname === path;

  // Update available dates when from/to changes
  React.useEffect(() => {
    const dates = getAvailableDates(from, to);
    setAvailableDates(dates);
    // If current date is not in available dates, set to first available date
    if (dates.length > 0 && !dates.includes(date)) {
      setDate(dates[0]);
    }
  }, [from, to, getAvailableDates, date]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const results = searchFlights(from, to, date);
    setSearchResults(results);
    setHasSearched(true);
  };

  const handleSelectFlight = (flight: Flight) => {
    // Create a mock passenger for demo
    const mockPassenger = {
      id: `PASS-${Date.now()}`,
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      type: PassengerType.Normal,
      loyaltyPoints: 0
    };
    
    setCurrentPassenger(mockPassenger);
    navigate(`/flight/${flight.id}/seats`);
  };

  const popularRoutes = [
    { from: 'New York', to: 'Los Angeles', code: 'JFK → LAX', price: 299 },
    { from: 'San Francisco', to: 'Miami', code: 'SFO → MIA', price: 349 },
    { from: 'Accra', to: 'Lagos', code: 'ACC → LOS', price: 189 },
    { from: 'Accra', to: 'London', code: 'ACC → LHR', price: 549 },
    { from: 'Chicago', to: 'Seattle', code: 'ORD → SEA', price: 279 },
    { from: 'Boston', to: 'Denver', code: 'BOS → DEN', price: 259 }
  ];

  const features = [
    {
      icon: Clock,
      title: 'Instant Seat Reservation',
      description: '10-minute countdown timer for secure payment processing'
    },
    {
      icon: Users,
      title: 'Smart Waiting List',
      description: 'Fair queue system with priority for VIP customers'
    },
    {
      icon: Shield,
      title: 'Priority Booking',
      description: 'VIP and business class passengers get priority access'
    },
    {
      icon: Bell,
      title: 'Real-time Notifications',
      description: 'Instant alerts for seat availability and booking updates'
    }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-white'}`}>
      {/* Navigation Header */}
      <nav className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">NAS Airlines</span>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/') 
                  ? 'bg-blue-600 text-white' 
                  : theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            <button
              onClick={() => navigate('/bookings')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/bookings')
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              My Bookings
            </button>
            <button
              onClick={() => navigate('/flight-status')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/flight-status')
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Flight Status
            </button>
            <button
              onClick={() => navigate('/help')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/help')
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Help
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'} transition-colors`}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              Become a Member
            </button>
            <button
              onClick={() => navigate('/admin/login')}
              className={`px-4 py-2 text-sm font-medium rounded-lg border ${theme === 'dark' ? 'text-gray-300 border-gray-600 hover:bg-gray-700' : 'text-gray-600 border-gray-300 hover:bg-gray-50'} transition-colors hidden md:block`}
            >
              Admin
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        {!hasSearched && (
          <div className={`relative py-20 bg-gradient-to-br ${theme === 'dark' ? 'from-blue-900 to-gray-900' : 'from-blue-50 to-indigo-100'} rounded-3xl mb-12 overflow-hidden`}>
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path d="M 50 50 Q 100 0 150 50 T 150 150 Q 100 200 50 150 T 50 50" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                  Book Flights Easily.
                </h2>
                <h3 className="text-5xl md:text-6xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                  Fly With Confidence.
                </h3>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Real-time seat availability, secure payments, and smart waiting lists.
                </p>
              </motion.div>
            </div>
          </div>
        )}

        {/* Search Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl p-8 mb-12 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  From
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="City or Airport"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  To
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="City or Airport"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Depart
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                </div>
                {from && to && availableDates.length > 0 && (
                  <div className={`mt-3 p-3 rounded-lg text-sm ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-blue-50 text-blue-700'}`}>
                    <div className="font-semibold mb-2">Available dates:</div>
                    <div className="flex flex-wrap gap-2">
                      {availableDates.map(d => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDate(d)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            date === d
                              ? 'bg-blue-600 text-white'
                              : theme === 'dark'
                              ? 'bg-gray-600 text-gray-100 hover:bg-gray-500'
                              : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-100'
                          }`}
                        >
                          {new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Passengers
                </label>
                <select 
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value))}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>)}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Search className="w-5 h-5" />
                  <span className="hidden md:inline">Search</span>
                </button>
              </div>
            </div>

            {/* Info Banner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-blue-900/20 border-blue-800 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'} text-sm flex items-center gap-2`}
            >
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>Seats are reserved for 10 minutes after selection. Limited seats available on popular routes today.</span>
            </motion.div>
          </form>
        </motion.div>

        {/* Search Form (duplicate - remove old one) */}
        <div className="hidden"></div>

        {/* Features Section */}
        {!hasSearched && (
          <div className="mb-16">
            <h2 className={`text-3xl font-bold mb-10 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Why Choose NAS Airlines?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:border-blue-600' : 'bg-white border-gray-200 hover:border-blue-600'} transition-all hover:shadow-lg`}
                  >
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {feature.title}
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Popular Routes */}
        {!hasSearched && (
          <div className="mb-16">
            <h2 className={`text-3xl font-bold mb-10 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Popular Routes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularRoutes.map((route, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => {
                    setFrom(route.from);
                    setTo(route.to);
                    setTimeout(() => {
                      const results = searchFlights(route.from, route.to, date);
                      setSearchResults(results);
                      setHasSearched(true);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }, 100);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:border-blue-600' : 'bg-white border-gray-200 hover:border-blue-600'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {route.code}
                      </p>
                      <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {route.from} → {route.to}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-blue-600 text-lg`}>From ${route.price}</span>
                    <button 
                      onClick={() => {
                        setFrom(route.from);
                        setTo(route.to);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                    >
                      View <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Trust & Security Section */}
        {!hasSearched && (
          <div className={`mb-16 py-12 px-8 rounded-2xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <h2 className={`text-3xl font-bold mb-10 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              We Keep You Safe Every Flight
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <Shield className={`w-10 h-10 mx-auto mb-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                <h4 className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Secure Payments</h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>SSL encryption and fraud protection</p>
              </div>
              <div className="text-center">
                <Mail className={`w-10 h-10 mx-auto mb-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                <h4 className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Smart Notifications</h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Real-time email and SMS alerts</p>
              </div>
              <div className="text-center">
                <Plane className={`w-10 h-10 mx-auto mb-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                <h4 className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Easy Booking</h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Book in minutes, not hours</p>
              </div>
              <div className="text-center">
                <Phone className={`w-10 h-10 mx-auto mb-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                <h4 className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>24/7 Support</h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Always here to help</p>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        {!hasSearched && (
          <div className={`mb-16 py-12 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-center`}>
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Fly?</h2>
            <p className="text-blue-100 mb-6 text-lg">Start your journey with NAS Airlines today</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Search Flights
              </button>
              <button className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
                Track Booking
              </button>
            </div>
          </div>
        )}

        {/* Search Results */}
        {hasSearched && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {searchResults.length > 0 ? 'Available Flights' : 'No flights found'}
            </h2>
            
            <div className="space-y-4">
              {searchResults.map((flight) => (
                <div
                  key={flight.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {flight.flightNumber}
                        </h3>
                        <StatusBadge status={flight.status} />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Route</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {flight.from} → {flight.to}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Departure - Arrival</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {flight.departureTime} - {flight.arrivalTime}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Available Seats
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {flight.availableSeats} / {flight.totalSeats}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            From <span className="font-bold text-gray-900 dark:text-white">${flight.price.economy}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      {flight.availableSeats > 0 ? (
                        <button
                          onClick={() => handleSelectFlight(flight)}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Select Flight
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const mockPassenger = {
                              id: `PASS-${Date.now()}`,
                              name: 'John Doe',
                              email: 'john.doe@email.com',
                              phone: '+1 (555) 123-4567',
                              type: PassengerType.Normal,
                              loyaltyPoints: 0
                            };
                            setCurrentPassenger(mockPassenger);
                            navigate(`/flight/${flight.id}/waiting-list`);
                          }}
                          className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Join Waitlist
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className={`border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} mt-16 py-12`}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Plane className="w-6 h-6 text-blue-600" />
                <span className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>NAS Airlines</span>
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Your trusted travel partner for seamless bookings and service.
              </p>
            </div>
            
            <div>
              <h4 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Company</h4>
              <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><button onClick={() => navigate('/about')} className="hover:text-blue-600">About Us</button></li>
                <li><button onClick={() => navigate('/careers')} className="hover:text-blue-600">Careers</button></li>
                <li><button onClick={() => navigate('/press')} className="hover:text-blue-600">Press</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Support</h4>
              <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><button onClick={() => navigate('/contact')} className="hover:text-blue-600">Contact Us</button></li>
                <li><button onClick={() => navigate('/help')} className="hover:text-blue-600">FAQ</button></li>
                <li><button onClick={() => navigate('/help')} className="hover:text-blue-600">24/7 Help</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Legal</h4>
              <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><button onClick={() => navigate('/terms')} className="hover:text-blue-600">Terms & Conditions</button></li>
                <li><button onClick={() => navigate('/privacy')} className="hover:text-blue-600">Privacy Policy</button></li>
                <li><button onClick={() => navigate('/refund-policy')} className="hover:text-blue-600">Refund Policy</button></li>
              </ul>
            </div>

            <div>
              <h4 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Follow Us</h4>
              <div className="flex gap-3">
                <a href="https://facebook.com/nasairlines" className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:text-blue-400' : 'bg-gray-100 text-gray-600 hover:text-blue-600'} transition-colors`}>
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://twitter.com/nasairlines" className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:text-blue-400' : 'bg-gray-100 text-gray-600 hover:text-blue-600'} transition-colors`}>
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com/company/nasairlines" className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:text-blue-400' : 'bg-gray-100 text-gray-600 hover:text-blue-600'} transition-colors`}>
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} pt-8 text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>&copy; 2026 NAS Airlines. All rights reserved. | Flying safely since 1995</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Mail className="w-4 h-4" />
              <span>support@nasairlines.com</span>
              <span className="mx-2">•</span>
              <Phone className="w-4 h-4" />
              <span>1-800-NAS-AIRLINES</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
