import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { Flight, PassengerType } from '../types';
import { StatusBadge } from './StatusBadge';
import { Plane, Calendar, Search, Users, DollarSign, Moon, Sun } from 'lucide-react';

export const FlightSearch: React.FC = () => {
  const navigate = useNavigate();
  const { searchFlights, setCurrentPassenger, theme, toggleTheme } = useBooking();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('2026-02-15');
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

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

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Plane className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SkyBook Airlines</h1>
              <p className="text-gray-600 dark:text-gray-400">Book your flight with confidence</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
            </button>
            <button
              onClick={() => navigate('/admin/login')}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Admin Login
            </button>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  From
                </label>
                <input
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="City or Airport"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  To
                </label>
                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="City or Airport"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Search Flights
                </button>
              </div>
            </div>
          </form>
        </div>

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
      </div>
    </div>
  );
};
